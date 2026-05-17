#!/usr/bin/env python3
"""AI Brief — daily AI industry research agent.

Runs twice daily (midday + evening Amman time), searches for AI news,
compiles a structured brief via Claude, and sends it via Gmail SMTP.

Required env vars:
  ANTHROPIC_API_KEY   — Anthropic API key
  GMAIL_FROM          — Gmail address to send from
  GMAIL_APP_PASSWORD  — Gmail App Password (not your login password)
  GMAIL_TO            — Recipient (default: rami@trilot.com)
  RUN_TYPE_OVERRIDE   — Optional: 'midday' or 'evening' to force a slot
"""

import os
import re
import smtplib
import sys
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import anthropic
import pytz
from duckduckgo_search import DDGS

AMMAN_TZ = pytz.timezone("Asia/Amman")
GMAIL_TO = os.environ.get("GMAIL_TO", "rami@trilot.com")


def get_run_slot() -> str:
    override = os.environ.get("RUN_TYPE_OVERRIDE", "").strip().lower()
    if override in ("midday", "evening"):
        print(f"[slot] forced to '{override}' via RUN_TYPE_OVERRIDE")
        return override

    now = datetime.now(AMMAN_TZ)
    hour = now.hour
    print(f"[slot] current Amman time: {now.strftime('%H:%M')} (hour={hour})")

    if 12 <= hour < 15:
        return "midday"
    elif 18 <= hour < 21:
        return "evening"
    else:
        # Outside expected windows — default to midday (e.g. manual dispatch)
        print("[slot] outside expected windows, defaulting to 'midday'")
        return "midday"


def get_lookback_hours(slot: str) -> int:
    return 12 if slot == "midday" else 6


def search_news(queries: list[str], max_results: int = 6) -> list[dict]:
    results = []
    with DDGS() as ddgs:
        for query in queries:
            try:
                hits = list(ddgs.news(query, max_results=max_results, timelimit="d"))
                results.extend(hits)
                print(f"  [search] '{query[:60]}' → {len(hits)} results")
            except Exception as exc:
                print(f"  [search] '{query[:60]}' → error: {exc}")
    return results


def format_results(results: list[dict]) -> str:
    seen = set()
    lines = []
    for r in results:
        url = r.get("url", "")
        if url in seen:
            continue
        seen.add(url)
        title = r.get("title", "No title")
        body = r.get("body", "")[:350]
        source = r.get("source", "")
        lines.append(f"SOURCE: {source}\nTITLE: {title}\nURL: {url}\nSNIPPET: {body}\n")
    return "\n---\n".join(lines)


def compile_email(slot: str, lookback: int, raw_results: str) -> tuple[str, str]:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    now = datetime.now(AMMAN_TZ)
    date_str = now.strftime("%d %b %Y")
    slot_label = "Midday" if slot == "midday" else "Evening"
    subject = f"AI Brief — {slot_label} — {date_str}"

    system = """You are an AI industry research editor. Compile raw search snippets into a tight, factual email brief.

Rules:
- Every factual claim must include its source as a hyperlink
- If a section has nothing notable, write exactly: No significant updates in this window
- Total body under 800 words
- No "as an AI" preambles, no closing sign-off
- Output valid HTML: use <h2> for section headers, <p> for text, <a href="..."> for links, <ul><li> for lists
- No <html>, <head>, or <body> wrapper tags"""

    user = f"""Compile the AI Brief for the {slot_label.upper()} run.
Lookback window: last {lookback} hours.
Today's date: {date_str}

RAW SEARCH RESULTS:
{raw_results}

Required sections (use these exact headers):
<h2>🔥 Top 3–5 Stories</h2>
<h2>Anthropic Updates</h2>
<h2>OpenAI Updates</h2>
<h2>Google / Gemini Updates</h2>
<h2>New AI Companies &amp; Launches</h2>
<h2>🐦 X.com Tips &amp; Threads</h2>
<h2>⭐ Read This First</h2>

For "Read This First" write one sentence — the single most important item with its source link."""

    resp = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": user}],
    )

    html_body = resp.content[0].text
    return subject, html_body


def html_to_plain(html: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)
    text = re.sub(r"</p>", "\n\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</h[1-6]>", "\n\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</li>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<a[^>]+href=['\"]([^'\"]+)['\"][^>]*>([^<]+)</a>", r"\2 (\1)", text)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def send_email(subject: str, html_body: str) -> None:
    gmail_from = os.environ["GMAIL_FROM"]
    app_password = os.environ["GMAIL_APP_PASSWORD"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = gmail_from
    msg["To"] = GMAIL_TO

    msg.attach(MIMEText(html_to_plain(html_body), "plain"))
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(gmail_from, app_password)
        smtp.sendmail(gmail_from, GMAIL_TO, msg.as_string())

    print(f"[send] Email delivered: {subject!r} → {GMAIL_TO}")


def main() -> None:
    slot = get_run_slot()
    lookback = get_lookback_hours(slot)
    print(f"[main] slot={slot}, lookback={lookback}h")

    queries = [
        "Anthropic Claude news updates 2026",
        "OpenAI GPT ChatGPT announcements 2026",
        "Google Gemini AI Studio Vertex news 2026",
        "new AI company model launched funded viral 2026",
        "X twitter Claude ChatGPT Gemini AI tips workflow power user 2026",
        "Anthropic Claude Code features May 2026",
    ]

    print("[main] Searching for AI news...")
    results = search_news(queries, max_results=6)

    if not results:
        print("[main] No search results. Aborting.")
        sys.exit(1)

    formatted = format_results(results)
    print(f"[main] {len(results)} unique results. Compiling via Claude...")

    subject, html_body = compile_email(slot, lookback, formatted)
    print(f"[main] Compiled. Subject: {subject!r}")

    send_email(subject, html_body)


if __name__ == "__main__":
    main()
