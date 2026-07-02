# Bapita — Go-To-Market Plan
**Created:** 2026-06-14  
**Reference:** webtoclients.com / @christian.wtc  
**Purpose:** System comparison, pricing, outreach, closing, onboarding — full playbook

---

## The Model (Christian vs Bapita)

Christian runs two businesses:
1. Web design agency — builds sites for local businesses on GoHighLevel, charges monthly
2. Course — teaches others his system ($89 one-time)

Bapita runs one (for now):
1. Booking system + booking page as a service, built on owned stack, charged monthly

Course layer is optional future. Not the focus now.

---

## Product Comparison: GoHighLevel vs Bapita

| Feature | GoHighLevel (Christian) | Bapita (Rami) |
|---|---|---|
| Ownership | Rented — $297/mo agency account | Fully owned stack |
| Sub-accounts | GHL sub-accounts per client | Businesses in Supabase |
| Client page | GHL drag-drop site builder | Classic / Clean / Dark templates |
| Booking system | Basic contact forms | Full booking calendar + time slots |
| Admin panel | GHL agency dashboard | dashboard.bapita.com/admin |
| Automations | GHL built-in workflows | WhatsApp/SMS reminders (add-on) |
| Client dependency | Client can learn GHL and fire you | Client can't replicate Bapita |
| Onboarding time | 2–4 hours per client | 10–20 minutes per client |
| Cost to run | $297/mo flat | ~₪100/mo hosting (Vercel + Supabase) |

**Bapita is the stronger product on every axis except time-to-market.** GHL lets Christian sell in week 1 with no build time. Bapita took months to build but is now a real moat — clients are sticky, booking history lives in the system, no one can replicate it by learning a tool.

---

## Templates (what clients see)

Three templates, each a dedicated Next.js page. Sellable = yes when polished.

| Template | Style | Status |
|---|---|---|
| Classic | Cream/gold, Playfair Display, Ken Burns hero | ✅ Done — `book.bapita.com/demo-classic` |
| Clean | Minimal, modern, light | 🔜 Next |
| Dark | Bold, dark background | 🔜 After Clean |

Every client gets a dedicated file forked from their template:
```
src/app/[slug]/customs/[slug].tsx
```
Fully independent after fork — customizable per barber without touching the template.

**Before starting outreach:** all 3 templates must be done and visually polished. demo-classic + demo-clean + demo-dark all live with dummy data that looks real.

---

## Pricing

### Setup fee (one-time, covers build + onboarding)

| Client size | Price |
|---|---|
| Small barber (1 chair, just starting) | ₪2,000 |
| Mid (2–3 chairs, established local) | ₪2,500 |
| Established shop (known name, multiple services) | ₪3,000 |

No prices shown on bapita.com. Custom pricing per barber. These are your internal anchors.

### Monthly base

| What's included | Price |
|---|---|
| Hosting, booking page live, dashboard access, basic support | ₪200/month |
| Unlimited bookings | No cap |

### Add-ons (monthly unless noted)

| Add-on | Price | Limit |
|---|---|---|
| WhatsApp Reminders | ₪200/month | 500 messages/month |
| SMS Confirmations | ₪150/month | 200 SMS/month |
| Online Payments | ₪200/month | No transaction limit |
| Google Reviews | ₪150/month | 300 requests/month |
| Google Business Setup | ₪200 one-time | N/A |
| Paid Ads (Meta) | TBD | TBD |

All limits adjustable per barber via admin dashboard (`plan_booking_limit` + `plan_addons` fields).

### Example client totals

| Setup | Monthly base | Add-ons | Monthly total |
|---|---|---|---|
| ₪2,000 | ₪200 | None | ₪200/mo |
| ₪2,500 | ₪200 | WhatsApp (₪200) | ₪400/mo |
| ₪3,000 | ₪200 | WhatsApp + Reviews (₪350) | ₪550/mo |

### Payment

PayPal for now. Stripe integration in admin dashboard is a future build.

Verbal pitch (Hebrew):
> "₪X פעם אחת — בונים לך את הדף עם כל השירותים שלך, תוך יומיים. אחר כך ₪200 בחודש לאחסון ולגישה לדשבורד — שם אתה רואה את כל התורים, הלקוחות, הסטטיסטיקות. מה אתה אומר?"

Verbal pitch (English):
> "₪X once — your booking page is live in two days with all your services. Then ₪200/month for hosting and dashboard access — you see all bookings, clients, stats. What do you think?"

---

## The 6-Step System (adapted from Christian's model)

### Step 1 — Niche ✅ Done

**Bapita niche:** barbers in Israel.

Why it works:
- Each client's customers are worth ₪50–200/visit, recurring
- Most still manage bookings via WhatsApp — clear pain
- Underserved: Booksy/Fresha charge % per booking, Bapita is flat monthly
- Physical businesses = can walk in and demo in person

**Competitors to know:**
- Fresha: free to use but takes % on payments, limited customization
- Booksy: monthly fee, generic UI, not Israel-focused
- Square: US-centric, complex
- Bapita: flat monthly, fully customized page, 2-day delivery, Israeli support

### Step 2 — Backend ✅ Done

Admin dashboard at `dashboard.bapita.com/admin`:
- Add business → slug → services → gallery → hours → live in 35 seconds on push
- Plan & stats tab tracks each client's tier, add-ons, billing dates, notes
- Health indicators per barber (services, hero, gallery, WhatsApp, about)

### Step 3 — Website (what the client gets)

Page lives at `book.bapita.com/[slug]` (or future: their custom domain).

**What's on every booking page:**
- Hero with name + tagline + Ken Burns image
- Service cards (name, price, duration)
- Full booking calendar + time slot picker
- Gallery
- About section
- Business hours
- Location (address + Waze + Google Maps links)
- WhatsApp + Instagram + Facebook links
- Google review link

**Better than GHL for barbershops:** client goes from browsing → booked appointment with time + date confirmed. GHL sites go from browsing → calling. Bapita wins on conversion for this niche.

### Step 4 — Outreach (steal from Christian)

Three channels, in priority order:

**A. Door to door (highest conversion for barbers)**
- Walk into barbershop with phone
- Ask for the owner
- Open `book.bapita.com/demo-classic` on your phone
- "I build booking pages for barbers in [city]. Takes me 2 days. This is what yours would look like."
- Let them scroll it. They'll ask questions. That's the close.

**B. Loom video DM (Instagram)**
- Find target barber on Instagram
- Record 60–90 second screen recording:
  1. Start on their Instagram or current site: "Hey [Name], saw you on Instagram, love the work..."
  2. Call out the pain: "Right now clients have to DM you to book — you're probably spending an hour a day managing that"
  3. Switch to `book.bapita.com/demo-classic`: "I built this for a barber in [area] — your page would look like this, with your name, your services, your photos"
  4. "Clients pick a slot and book in under a minute. No back and forth."
  5. CTA: "Takes me 2 days to build yours. Want to see a preview with your actual name on it? Just reply."
- DM link on Instagram: "Made this quick video for you 👇 [Loom link]"
- Volume: 20–30 DMs/day → ~3–5 replies → 1–2 calls → 1 close

**C. Cold call**
- Find via Google Maps or Instagram
- Intro: "Hey, I build booking pages for barbers in [city] — 2-day turnaround. Do you currently take online bookings?"
- If no: "Want to see what yours would look like? Takes 2 minutes."
- If yes: "What do you use? I can show you what Bapita does differently."

**Before starting any outreach:** all 3 templates done, demo-classic + demo-clean + demo-dark live with polished dummy data.

### Step 5 — Closing

**Structure (20-minute call or in-person):**

1. **Questions first, pitch second:**
   - "How do you currently handle bookings?"
   - "How many DMs a day do you get asking 'when are you free?'"
   - "Do you ever get no-shows?"
   - Let them describe the pain — don't tell them

2. **Demo:**
   - Pull up `book.bapita.com/demo-classic` or the template matching their vibe
   - Show the full flow: services → calendar → slot → booked
   - "This is what your clients would see. Takes them under a minute."

3. **Anchor pricing:**
   - "Booksy charges you per booking on top of a monthly fee. Fresha takes a percentage of every payment. With Bapita it's flat — ₪X setup, ₪200/month, that's it."
   - Give setup price based on their size (₪2k/2.5k/3k)

4. **Close:**
   - "I can have this live for you by [date + 2 days]. Want me to build a preview with your actual name and services first, no cost?"
   - Or: "First month is on me. If you don't love it, you pay nothing."

5. **Handle objections:**
   - "I already have a website" → "Your site doesn't take bookings. Bapita does."
   - "I need to think about it" → "Want me to build the preview first? Costs you nothing to look."
   - "Too expensive" → "One extra client a month covers the whole year. You'll get 5–10 new bookings/month minimum."
   - "I use Booksy" → "Keep it if you want. I can show you what's different side by side."

### Step 6 — Onboarding + Delivery

**Promise: live in 2 business days.**

**Process:**
1. Client pays setup fee via PayPal
2. Go to `dashboard.bapita.com/admin/businesses` → Add New Business
3. Fill: name, slug, contact info, tagline, about text, template choice
4. Upload hero image + gallery
5. Add services (name, price, duration)
6. Set business hours
7. Push → live at `book.bapita.com/[slug]` in 35 seconds
8. If dedicated customization needed: `cp ClassicPage.tsx customs/[slug].tsx` → push
9. Send barber their link
10. Walkthrough: "Share this in your Instagram bio and Stories. Clients will start booking."

**Monthly after that:**
- Rami manages via admin panel
- Service/price updates on request (included in ₪200/month)
- Add-ons activated per client in Plan tab
- Stats visible in admin: total bookings, this month, last booking

---

## Gaps Before Full Outreach

| Gap | Status |
|---|---|
| Classic template — fully polished | 🔜 Next chat |
| Clean template — built | 🔜 After Classic |
| Dark template — built | 🔜 After Clean |
| All 3 demos live with polished dummy data | 🔜 After templates |
| Loom recorded (using demo-classic) | 🔜 After templates |
| First real client: studio-avi getting actual bookings | In progress |
| Client wins: screenshot + testimonial from Avi | 🔜 First booking |
| Stripe in admin dashboard | Future (PayPal covers now) |
| WhatsApp reminders built | Future add-on |

---

## What to Steal from Christian (priority order)

1. **Loom outreach** — most scalable channel, start after templates done
2. **Pain-first close** — ask about WhatsApp chaos before any pitch
3. **Speed promise** — "live in 2 days" is a weapon, use it every time
4. **Preview offer** — "let me build a preview with your name, free, no obligation"
5. **Client wins gallery** — document every barber who goes live, screenshot bookings received
6. **"No booking limit" base plan** — removes a common objection before it's raised

---

## Key Paths

| Thing | Path |
|---|---|
| Admin dashboard | `dashboard.bapita.com/admin/businesses` |
| Classic template | `src/app/[slug]/themes/classic/ClassicPage.tsx` |
| Clean template | `src/app/[slug]/themes/clean/CleanPage.tsx` (to build) |
| Dark template | `src/app/[slug]/themes/dark/DarkPage.tsx` (to build) |
| Dedicated pages | `src/app/[slug]/customs/[slug].tsx` |
| BookingShell map | `src/app/[slug]/BookingShell.tsx` → `CUSTOM_PAGES` |
| Demo classic | `book.bapita.com/demo-classic` |
| Push command | `git -C /Users/admin/Desktop/bapita-dashboard add src/ && git commit -m "..." && git push` |
