"""
AI Brief runner — called by GitHub Actions on the two daily cron triggers.

Secrets required in the repo:
  ANTHROPIC_API_KEY       — Anthropic API key
  GMAIL_CREDENTIALS_JSON  — OAuth2 client credentials (credentials.json contents)
  GMAIL_TOKEN_JSON        — OAuth2 token (token.json contents, pre-authorised for gmail.send scope)
  RECIPIENT_EMAIL         — target address (rami@trilot.com)
"""

import os
import json
import base64
import datetime
import zoneinfo
import textwrap
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import anthropic
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


AMMAN_TZ = zoneinfo.ZoneInfo("Asia/Amman")
SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


# ── slot detection ─────────────────────────────────────────────────────────────

def detect_slot() -> str:
    override = os.environ.get("RUN_TYPE_OVERRIDE", "").strip().lower()
    if override in ("midday", "evening"):
        return override
    now_amman = datetime.datetime.now(AMMAN_TZ)
    hour = now_amman.hour
    if 12 <= hour < 15:
        return "midday"
    if 18 <= hour < 21:
        return "evening"
    # Fallback: decide by UTC cron hour
    now_utc = datetime.datetime.utcnow()
    return "midday" if now_utc.hour < 14 else "evening"


# ── Claude call ────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = textwrap.dedent("""\
    You are an AI industry research agent producing a concise daily briefing email.
    Rules:
    - Every claim must link to its source URL.
    - If a section has nothing notable, write: No significant updates in this window.
    - Total body must be under 800 words.
    - No "as an AI" preambles, no closing sign-off.
    - Do not repeat items that would fall outside the specified lookback window.
    - Return ONLY the HTML body (no <html>/<head>/<body> wrappers needed), ready to embed.
""")

ROUTINE_PROMPT = textwrap.dedent("""\
    You are an AI industry research agent. The current slot is: {slot}.
    Lookback window: {lookback_desc}.

    STEP 1 — Research (use web search, restrict to lookback window):

    A) News from:
       - Anthropic (Claude models, Claude Code, Claude.ai, API, pricing, features)
       - OpenAI (GPT models, ChatGPT, Sora, API, agents, announcements)
       - Google (Gemini models, AI Studio, Vertex AI, image/video generation)
       - Any newly launched, newly funded, or newly viral AI company, model, tool, or product

    B) X.com (Twitter) intel within the lookback window:
       - Power-user tips, prompt techniques, workflow hacks for Claude, ChatGPT, Gemini
       - Notable posts from @AnthropicAI, @OpenAI, @GoogleAI, @GeminiApp, @sama, @demishassabis
       - Trending threads on AI image generation, AI video tools, AI agent workflows

    STEP 2 — Compile into an email body with these exact sections:

    Subject line (output as: SUBJECT: <subject>):
      - Midday: "AI Brief — Midday — {{date in DD MMM YYYY}}"
      - Evening: "AI Brief — Evening — {{date in DD MMM YYYY}}"

    HTML body sections (clear headers):
    1. 🔥 Top 3-5 stories — one short paragraph each with source link
    2. Anthropic updates
    3. OpenAI updates
    4. Google / Gemini updates
    5. New AI companies & launches
    6. 🐦 X.com tips & threads — 3-5 items with direct links where available
    7. ⭐ Read this first — the single most important item in one line

    Output format:
    SUBJECT: <subject line>
    ---
    <html body content>
""")


def run_claude(slot: str) -> tuple[str, str]:
    """Returns (subject, html_body)."""
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    now_amman = datetime.datetime.now(AMMAN_TZ)
    if slot == "midday":
        lookback_desc = "last 12 hours (since ~01:00 Amman time today)"
    else:
        lookback_desc = "last 6 hours (since ~13:00 Amman time today)"

    user_message = ROUTINE_PROMPT.format(slot=slot, lookback_desc=lookback_desc)

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = response.content[0].text.strip()

    # Parse subject + body
    if "---" in raw:
        parts = raw.split("---", 1)
        subject_line = parts[0].strip()
        html_body = parts[1].strip()
    else:
        subject_line = f"AI Brief — {slot.capitalize()} — {now_amman.strftime('%d %b %Y')}"
        html_body = raw

    subject = subject_line.replace("SUBJECT:", "").strip()
    return subject, html_body


# ── Gmail send ─────────────────────────────────────────────────────────────────

def build_gmail_service():
    creds_json = os.environ["GMAIL_CREDENTIALS_JSON"]
    token_json = os.environ["GMAIL_TOKEN_JSON"]

    creds_info = json.loads(token_json)
    client_info = json.loads(creds_json)

    creds = Credentials(
        token=creds_info.get("token"),
        refresh_token=creds_info.get("refresh_token"),
        token_uri=client_info.get("installed", client_info.get("web", {})).get(
            "token_uri", "https://oauth2.googleapis.com/token"
        ),
        client_id=client_info.get("installed", client_info.get("web", {})).get("client_id"),
        client_secret=client_info.get("installed", client_info.get("web", {})).get("client_secret"),
        scopes=SCOPES,
    )
    return build("gmail", "v1", credentials=creds)


def send_email(service, to: str, subject: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html"))

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()
    print(f"Sent: {subject} → {to}")


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    slot = detect_slot()
    print(f"Running AI Brief — slot: {slot}")

    subject, html_body = run_claude(slot)
    print(f"Subject: {subject}")

    service = build_gmail_service()
    recipient = os.environ.get("RECIPIENT_EMAIL", "rami@trilot.com")
    send_email(service, recipient, subject, html_body)


if __name__ == "__main__":
    main()
