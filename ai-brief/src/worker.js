/**
 * AI Brief — Cloudflare Worker
 *
 * Cron triggers (wrangler.toml):
 *   "0 10 * * *"  →  13:00 Asia/Amman  (Midday run)
 *   "0 16 * * *"  →  19:00 Asia/Amman  (Evening run)
 *
 * Manual trigger:  GET /trigger?slot=midday  or  GET /trigger?slot=evening
 *
 * Required secrets (wrangler secret put <NAME>):
 *   ANTHROPIC_API_KEY, BRAVE_SEARCH_API_KEY,
 *   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, FROM_EMAIL
 *
 * Required var (wrangler.toml [vars]):
 *   TO_EMAIL
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const BRAVE_SEARCH_API = 'https://api.search.brave.com/res/v1/web/search';
const GMAIL_TOKEN_API = 'https://oauth2.googleapis.com/token';
const GMAIL_SEND_API = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

// ─── Slot detection ──────────────────────────────────────────────────────────

function getSlotInfo(forceSlot = null) {
  const now = new Date();
  // Asia/Amman = UTC+3
  const ammanMs = now.getTime() + 3 * 60 * 60 * 1000;
  const ammanDate = new Date(ammanMs);
  const ammanHour = ammanDate.getUTCHours();

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateStr = [
    String(ammanDate.getUTCDate()).padStart(2, '0'),
    MONTHS[ammanDate.getUTCMonth()],
    ammanDate.getUTCFullYear()
  ].join(' ');

  const slot = forceSlot ?? (ammanHour >= 18 && ammanHour < 21 ? 'EVENING' : 'MIDDAY');

  return {
    slot,
    dateStr,
    lookbackDesc: slot === 'EVENING'
      ? 'last 6 hours (since 13:00 Amman time today)'
      : 'last 12 hours (since 01:00 Amman time today)',
  };
}

// ─── Brave Search ─────────────────────────────────────────────────────────────

async function braveSearch(query, apiKey) {
  const url = new URL(BRAVE_SEARCH_API);
  url.searchParams.set('q', query);
  url.searchParams.set('count', '10');
  url.searchParams.set('freshness', 'pd'); // past day

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });
  if (!res.ok) return `Search error ${res.status}`;

  const data = await res.json();
  return (data.web?.results ?? [])
    .map(r => `${r.title}\n${r.url}\n${r.description ?? ''}`)
    .join('\n\n') || 'No results found.';
}

// ─── Gmail ────────────────────────────────────────────────────────────────────

async function getAccessToken(env) {
  const res = await fetch(GMAIL_TOKEN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

function encodeMessage(to, from, subject, htmlBody) {
  // Gmail API expects the full RFC 2822 message as base64url
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ].join('\r\n');

  // TextEncoder → Latin-1 binary string → btoa → base64url
  const bytes = new TextEncoder().encode(raw);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendEmail(subject, htmlBody, env) {
  const token = await getAccessToken(env);
  const raw = encodeMessage(env.TO_EMAIL, env.FROM_EMAIL, subject, htmlBody);

  const res = await fetch(GMAIL_SEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) throw new Error(`Gmail send failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

// ─── Claude tool definitions ──────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'web_search',
    description: 'Search the web for recent AI news, announcements, and social posts.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'send_email',
    description: 'Send the compiled AI Brief email. Call this exactly once when the email is ready.',
    input_schema: {
      type: 'object',
      properties: {
        subject: { type: 'string', description: 'Email subject line.' },
        html_body: { type: 'string', description: 'Full HTML body of the email.' },
      },
      required: ['subject', 'html_body'],
    },
  },
];

function systemPrompt(toEmail) {
  return `You are an AI industry research agent running an automated email brief called "AI Brief".

You will be given the current run slot (MIDDAY or EVENING) and the lookback window. Use web_search aggressively — at least 6-8 searches — then call send_email exactly once with the compiled result.

STEP 1 — Research (restrict searches to the lookback window):

A) News and updates from:
   - Anthropic — Claude models, Claude Code, Claude.ai, API, pricing, new features
   - OpenAI — GPT models, ChatGPT, Sora, API, agents, DevDay-style announcements
   - Google — Gemini models, AI Studio, Vertex AI, image generation
   - Any newly launched, newly funded, or newly viral AI company, model, tool, or product

B) X.com (Twitter) intel within the lookback window:
   - Power-user tips, prompt techniques, workflow hacks for Claude, ChatGPT, Gemini
   - Notable posts from @AnthropicAI, @OpenAI, @GoogleAI, @GeminiApp, @sama, @demishassabis
   - Trending threads on AI image generation, AI video tools, and AI agent workflows

STEP 2 — Compile the email. Subject line format:
   - Midday: "AI Brief — Midday — {DD MMM YYYY}"
   - Evening: "AI Brief — Evening — {DD MMM YYYY}"

Body sections (use clear HTML headers, no marketing fluff):
1. 🔥 Top 3-5 stories — one short paragraph each, with source link
2. Anthropic updates
3. OpenAI updates
4. Google / Gemini updates
5. New AI companies & launches
6. 🐦 X.com tips & threads — 3-5 items with direct tweet links where available
7. ⭐ Read this first — the single most important item in one line

Rules:
- Every claim must link to its source
- If a section has nothing notable, write "No significant updates in this window"
- Total body under 800 words
- No "as an AI" preambles, no closing sign-off
- Do not repeat items already covered in the previous run's window

STEP 3 — Call send_email with To: ${toEmail}`;
}

// ─── Agentic loop ─────────────────────────────────────────────────────────────

async function runAIBrief(env, forceSlot = null) {
  const { slot, dateStr, lookbackDesc } = getSlotInfo(forceSlot);

  const userMessage = `Slot: ${slot}\nDate: ${dateStr}\nLookback window: ${lookbackDesc}\n\nBegin research and send the AI Brief now.`;

  const messages = [{ role: 'user', content: userMessage }];
  let emailSent = false;

  for (let turn = 0; turn < 25 && !emailSent; turn++) {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 4096,
        system: systemPrompt(env.TO_EMAIL),
        tools: TOOLS,
        messages,
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
    const msg = await res.json();

    messages.push({ role: 'assistant', content: msg.content });

    if (msg.stop_reason === 'end_turn') break;

    if (msg.stop_reason === 'tool_use') {
      const toolResults = [];

      for (const block of msg.content) {
        if (block.type !== 'tool_use') continue;

        let result;
        try {
          if (block.name === 'web_search') {
            result = await braveSearch(block.input.query, env.BRAVE_SEARCH_API_KEY);
          } else if (block.name === 'send_email') {
            await sendEmail(block.input.subject, block.input.html_body, env);
            result = 'Email sent successfully.';
            emailSent = true;
          } else {
            result = `Unknown tool: ${block.name}`;
          }
        } catch (err) {
          result = `Error: ${err.message}`;
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }

      messages.push({ role: 'user', content: toolResults });
    }
  }

  if (!emailSent) {
    throw new Error('AI Brief completed without sending an email.');
  }

  return { slot, dateStr, emailSent };
}

// ─── Worker entry points ──────────────────────────────────────────────────────

export default {
  // Cron trigger — runs at 10:00 UTC (13:00 Amman) and 16:00 UTC (19:00 Amman)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runAIBrief(env));
  },

  // HTTP trigger — GET /trigger?slot=midday|evening
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/trigger') {
      const slotParam = url.searchParams.get('slot');
      const forceSlot = slotParam === 'evening' ? 'EVENING' : 'MIDDAY';
      ctx.waitUntil(
        runAIBrief(env, forceSlot).catch(err => console.error('AI Brief error:', err))
      );
      return new Response(
        JSON.stringify({ status: 'triggered', slot: forceSlot }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      'AI Brief Worker\n\nRoutes:\n  GET /trigger?slot=midday   — manual midday run\n  GET /trigger?slot=evening  — manual evening run',
      { status: 200 }
    );
  },
};
