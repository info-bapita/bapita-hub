# Bapita MVP — System Design
**Date:** 2026-05-21  
**Status:** Approved  
**Stack:** Supabase + GitHub Actions + Meta WhatsApp Cloud API + Next.js (Vercel)

---

## What Bapita is (one sentence)

A done-for-you digital operations service for Israeli appointment-based businesses (barbershops, salons, dog groomers, clinics). You configure and run their WhatsApp automations, booking system, Google presence, and client retention — they pay a setup fee and monthly retainer, see results, never touch the engine.

---

## Business Model

**Sold as bundles, not à la carte.**

| Bundle | What's included | Setup NIS | Monthly NIS |
|---|---|---|---|
| Starter — Don't Miss a Booking | Pricing menu bot + auto-responder + appointment reminders | 1,200 | 699 |
| No-Show Killer | Reminders + deposit collection + slot broadcast + dashboard | 1,800 | 999 |
| Full Autopilot | Everything above + review bot + dormant reactivation + rebooking nudge | 2,500 | 1,490 |
| Clinic Pack | Full Autopilot + new client intake bot + welcome sequence | 3,000–3,500 | 1,699 |

**Setup fee add-ons (one-time, billed with the setup fee):**
- Google Business Profile setup + optimization: +400–600 NIS
- Landing page / mini-site (Framer): +1,500–2,500 NIS

**Rules:**
- Setup fee collected before work starts
- Monthly retainer starts when system goes live (day 3–5)
- Minimum contract: 3 months, signed upfront
- Meta WhatsApp conversation costs (~$5–8/month) absorbed into retainer

**What the monthly retainer covers (what you tell clients):**
- System monitoring and uptime
- Template and message updates (promotions, holidays, new services)
- New automations added as business grows
- Monthly performance report (bookings, no-shows prevented, reviews generated)
- WhatsApp message costs included

Frames it as ongoing operations partner, not software license. Much harder to cancel.

**Payments:** Start with bank transfer (Bit/Pepper) — zero friction. Move to Sumit or PayPlus for recurring invoices when you have 3+ clients. Always send a חשבונית.

---

## Anti-Churn Mechanisms

These are the real reasons clients don't leave — not technical lock-in, but switching cost:

| Mechanism | How it works |
|---|---|
| 3-month contract | Legal obligation. If they cancel early, they owe remaining months |
| Customer database | 6+ months of their customers' history lives in YOUR Supabase. They leave — start from zero |
| Switching complexity | New provider needs to re-learn their business, re-submit Meta templates, re-do integrations. 2–4 weeks of dead automation |
| Monthly ROI report | "Last month: 23 no-shows prevented, 11 new Google reviews." Hard to cancel something with visible results |
| Template dependency | You know which message templates work for their audience. Institutional knowledge = switching cost |

**What NOT to do:** Don't register their WhatsApp number under YOUR Meta Business Manager to create lock-in. That's ethically bad and legally risky in Israel. Their number stays theirs — you get API access as a System User. If they cancel, they revoke your access. That's fair.

---

## System Architecture

### How it flows

**Booking intake:**
Calendly (or Google Forms) receives a booking → sends a webhook to your system → appointment is created in the database.

**Outbound automations (scheduled):**
GitHub Actions runs every hour → triggers your reminder job → the job checks the database for appointments needing a 24h or 2h reminder → sends WhatsApp template message to the customer.

Same pattern for review requests: 2 hours after appointment time, the job checks for completed appointments and sends a review request with the client's Google link.

**Inbound WhatsApp (customer replies):**
Customer sends a message → Meta forwards it to your webhook → your system figures out which client it belongs to (see Multi-tenancy section) → routes based on content:
- "ביטול" or "cancel" → cancels their upcoming appointment in DB, sends confirmation reply
- "אישור" or "yes" → confirms appointment, updates status
- Anything else → sends to AI (Claude Haiku) → auto-reply in the customer's language (Hebrew/Arabic/English)

**Dashboard:**
Client logs in with email + password → sees their own data only (row-level security) → appointments this week, reminders sent, reviews generated, message log.

### Database — what's stored

- **clients** — your clients (the barbershops). Stores their Meta API credentials (encrypted), Google review link, business FAQ context (hours, services, prices, address), contract details.
- **customers** — each client's customer list. Name, phone number, preferred language.
- **appointments** — all bookings. Status (confirmed / reminded / completed / cancelled / no-show), timestamps for when each reminder/review was sent.
- **messages_log** — every WhatsApp message in and out. Direction, type, content, Meta message ID, delivery status (sent → delivered → read or failed).
- **templates** — Meta-approved message templates per client. Stores the exact template name (must match Meta exactly), type, language, approval status.

---

## Critical Flags — Read These Before Building

### FLAG 1 — WhatsApp Business App vs WhatsApp Business API

These are completely different things.

**WhatsApp Business App** = the phone app. Free. Manual. No automation possible. Cannot receive webhooks or send programmatic messages.

**WhatsApp Business API (Cloud API)** = what you need. Sends/receives messages programmatically. Requires Meta approval. Has per-conversation costs (~$0.04–0.08 per 24h window). You access it through Meta's Graph API.

If a client already uses the WhatsApp Business App on their business number, they need to migrate that number to the API. This causes ~24h downtime. Plan it for Sunday. It's worth it because their customers recognize the number.

Alternative: use a new prepaid SIM (~10 NIS) for the API. Zero downtime, but customers see an unknown number. Not recommended unless the client is resistant to downtime.

### FLAG 2 — WhatsApp messaging rules (outbound vs inbound windows)

**Outbound (you initiate):** You can ONLY send pre-approved template messages. These are submitted to Meta, reviewed, and approved (usually 30 min to 48h). You cannot send free-form text to a customer who hasn't messaged you recently. This is why reminders and review requests must be templates.

**Inbound window (24h free-form):** When a customer messages you, a 24h window opens. During this window, you can reply with free-form text — no template needed. This is when the AI FAQ bot works. After 24h of silence, the window closes and you're back to templates only.

Practical impact: your AI auto-reply only works if the customer initiated the conversation OR replied to one of your templates within 24h.

### FLAG 3 — Meta test number vs real number

When you first set up in Meta's developer dashboard, you get a free test phone number and can add up to 5 "recipient" numbers (your personal phone). You can send test messages immediately — no template approval needed for test mode.

This means you can build and test the entire system on your own number before dealing with any real client. Don't wait for template approval to start testing the webhook and reminder flow. Test with the Meta test number first.

### FLAG 4 — Template submission timing

Submit your 3 message templates (reminder 24h, reminder 2h, review request) to Meta as soon as you set up your Meta app. Approval takes 30 minutes to 48 hours. If you wait until the system is built, you'll be stuck waiting.

Submit templates → continue coding in parallel → by the time you're ready to test, templates are approved.

### FLAG 5 — Multi-tenancy webhook routing

Meta sends ALL your clients' WhatsApp events to ONE single webhook URL. When a customer of Client A sends a message, and a customer of Client B sends a message, both arrive at the same endpoint.

How you tell them apart: every Meta webhook payload includes a `phone_number_id` field. This is the unique ID of the WhatsApp number that received the message. You match this against your database (`clients` table has a `meta_phone_number_id` column) to find which client the event belongs to. Then you use THAT client's API credentials to send the reply.

Never hardcode credentials for one client. All API calls must look up the client first, then fetch their credentials from Supabase Vault.

### FLAG 6 — Supabase Vault for credentials

Each client's Meta access token is sensitive. Don't store it as plain text in the database. Use Supabase Vault (built-in secrets manager). Store the actual token in Vault under a name like `client_[name]_meta_token`. In the `clients` table, store only the Vault secret name (not the token). Your edge function retrieves the actual token from Vault at runtime.

This means even if someone gets read access to your database, they can't steal client credentials.

### FLAG 7 — GitHub Actions as scheduler

GitHub Actions runs your cron jobs (hourly reminders, daily summary). It simply sends an HTTP request to your Supabase edge function on schedule. The edge function does the actual work.

Secure this: the cron job sends a shared secret in the Authorization header. Your edge function checks this secret and rejects any request that doesn't have it. This prevents anyone from triggering your jobs externally.

Store the shared secret in both GitHub repo secrets AND Supabase edge function environment variables. They must match.

### FLAG 8 — Calendly webhook setup per client

Each client needs their Calendly (or booking system) configured to send webhooks to your endpoint. This is done manually during onboarding. The webhook URL will be your Supabase edge function URL. Calendly also sends a signature with each webhook — store the Calendly webhook secret per client in your `clients` table so you can verify the payload is genuine.

If a client doesn't use Calendly, appointments must be entered manually into the database (or via a simple form you build later).

---

## Client Onboarding — Step by Step

Realistic timeline: **3–5 business days** calendar time (most of it is Meta waiting, not your work).

**Your actual work time: ~3 hours per client.**

| Step | Who | Your time | Wait time |
|---|---|---|---|
| 1. Client creates Meta Business Manager | Client (you guide on a call) | 30 min call | — |
| 2. You're added as System User (Admin) | You + client on call | 10 min | — |
| 3. WhatsApp number submitted to Meta | You submit | 15 min | 24–48h ← blocker |
| 4. Submit message templates to Meta | You write + submit | 45 min | 24–48h (overlaps with step 3) |
| 5. Insert client into database + Vault | You | 15 min | — |
| 6. Configure Calendly webhook | You | 20 min | — |
| 7. Create dashboard login for client | You | 5 min | — |
| 8. Import existing customer list (CSV) | You | 30–60 min if they have a list | — |

**Submit templates the same day as the number — they run in parallel.**

---

## Build Order (7 Days)

### Day 1 — Meta setup + Supabase project
- Create Meta Developer App (type: Business) at developers.facebook.com
- Add WhatsApp product → get test phone number + temporary access token + phone_number_id
- Add your personal number as test recipient (verify via OTP on your phone)
- Create Supabase project + GitHub repo with folder structure:
  ```
  bapita/
  ├── supabase/
  │   ├── migrations/     ← schema SQL files
  │   └── functions/      ← edge functions (one folder per function)
  ├── dashboard/          ← Next.js app (leave empty for now)
  └── .github/workflows/  ← GitHub Actions scheduler
  ```
- Set up Supabase CLI locally, run local dev environment

### Day 2 — Database schema + inbound webhook
- Write and run the schema migration (all 5 tables)
- Set up Row Level Security policies (dashboard users see only their client's data)
- Build `webhook-whatsapp` edge function:
  1. Handle Meta's GET verification request (required before Meta accepts your URL)
  2. Verify Meta's HMAC-SHA256 signature on every POST (security check)
  3. Read `phone_number_id` from payload → find matching client in DB
  4. Handle delivery/read status updates → update messages_log
  5. Handle incoming messages → route to cancel / confirm / AI
- Deploy edge function → register URL in Meta dashboard → subscribe to "messages" events
- **Test:** Send yourself a WhatsApp message → confirm it appears in messages_log in Supabase

### Day 3 — Reminder and review jobs
- Build `jobs-reminders` edge function:
  - Queries appointments due for 24h reminder (23–25h from now) → sends template → updates DB
  - Queries appointments due for 2h reminder (1h50m–2h10m from now) → sends template → updates DB
- Build `jobs-reviews` edge function:
  - Queries appointments where time + 2h has passed, no review sent, not cancelled → sends review template → updates DB
- Write GitHub Actions scheduler YAML (hourly trigger → HTTP call to both functions)
- Add `SUPABASE_URL` and `CRON_SECRET` to GitHub repo secrets
- **Test:** Insert a fake appointment 25h from now in the DB → manually trigger GitHub Actions → watch WhatsApp reminder arrive on your phone

### Day 4 — Templates + AI reply
- Submit 3 templates to Meta (do this ASAP — earlier the better for approval)
- Build `ai-reply` helper inside webhook function:
  - Takes customer message + client's FAQ context from DB
  - Calls Claude Haiku API
  - Returns Hebrew/Arabic/English reply (≤150 tokens, fast + cheap)
- **Test:** Message your test number with "מה שעות הפעילות?" → get auto-reply in Hebrew

### Day 5 — Full end-to-end test
Simulate a complete client lifecycle on your own number:
1. Trigger booking webhook → appointment appears in DB
2. Wait for / manually trigger reminder job → receive WhatsApp reminder on your phone
3. Reply "אישור" → appointment status updates in DB
4. Manually trigger review job → receive review request with Google link
5. Reply "ביטול" → appointment marked cancelled in DB

If all 5 pass → system works. Architecture is validated.

### Day 6–7 — Minimal dashboard
- Next.js app with Supabase Auth (email + password login)
- After login: one page only
  - 3 counters at top: reminders sent this month / reviews requested / appointments this week
  - Table: this week's appointments with status
  - Message log: last 30 messages in/out
- No config panel — all client configuration is done by you in Supabase directly
- Deploy to Vercel (free tier)
- **Test:** Log in as a client → confirm you see only their data

### After Day 7 — First outreach
- Pick one business from the Gold List (Fake Digital segment — Instagram active, manual operations)
- Offer: free 30-day pilot. No setup fee, no contract. Just let them see it work.
- After 30 days of results → 3-month contract + setup fee for next client

---

## Environment Variables

Set all of these in Supabase dashboard → Project Settings → Edge Functions → Secrets.
Set GitHub-related ones in the GitHub repo → Settings → Secrets.

| Variable | What it is | Where to set |
|---|---|---|
| `META_VERIFY_TOKEN` | Any random string you choose. Used when registering your webhook URL with Meta | Supabase edge function secrets |
| `META_APP_SECRET` | Found in Meta App dashboard → App Settings → Basic. Used to verify webhook signatures | Supabase edge function secrets |
| `ANTHROPIC_API_KEY` | From console.anthropic.com | Supabase edge function secrets |
| `CRON_SECRET` | Any random string you choose. Shared between GitHub Actions and your edge functions to prevent unauthorized cron triggers | Both Supabase secrets AND GitHub repo secrets |
| `SUPABASE_URL` | Auto-set by Supabase in edge functions. Also add to GitHub secrets for the scheduler | GitHub repo secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-set by Supabase in edge functions. Never expose this to the frontend | — (already set) |

Client Meta credentials (access tokens) → stored in Supabase Vault. Referenced by name in the `clients` table. Never stored as plain text anywhere.

---

## Message Templates to Submit to Meta

Submit these under your Meta app → WhatsApp → Message Templates. Category: UTILITY.

**Template 1 — appointment_reminder_24h**
Variables: `{{1}}` = customer name, `{{2}}` = time, `{{3}}` = service name
```
שלום {{1}},
מזכירים לך שיש לך תור מחר ב-{{2}} ל{{3}} 💈

לאישור כתוב: אישור
לביטול כתוב: ביטול
```

**Template 2 — appointment_reminder_2h**
Variables: `{{1}}` = customer name, `{{2}}` = time
```
היי {{1}} 👋
תזכורת – התור שלך ב-{{2}} עוד קצת!
מחכים לך 🙂
```

**Template 3 — review_request**
Variables: `{{1}}` = customer name, `{{2}}` = Google review link
```
שלום {{1}},
תודה שבאת היום! 🙏
אם נהנית, נשמח אם תשאיר ביקורת קטנה:
{{2}}

זה עוזר לנו להגיע ליותר אנשים ♥️
```

---

## FAQ Context Structure (per client in DB)

When onboarding a new client, fill in their `faq_context` field in the `clients` table. This is what the AI uses to answer customer questions.

```json
{
  "business_name": "מספרת כהן",
  "type": "barbershop",
  "hours": "ראשון-חמישי 10:00-20:00, שישי 09:00-15:00, שבת סגור",
  "location": "הרצליה פיתוח",
  "address": "רחוב הרצל 14, הרצליה פיתוח",
  "services": ["תספורת גברים", "זקן", "תספורת ילדים", "גוון"],
  "prices": "תספורת 70-100 ₪, זקן 50 ₪, ילדים 60 ₪",
  "booking_instructions": "שלח תאריך ושעה מועדפים ונחזור אליך לאישור",
  "parking": "חניה חינמית ברחוב"
}
```

---

*Saved: 2026-05-21 | Bapita MVP System Design v1*
