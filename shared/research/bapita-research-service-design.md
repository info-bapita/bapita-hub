# Bapita — Service Design Research Output
# Generated: 2026-05-21

## PAIN POINT MAPPING (by business type)
Barbershop, Hair Salon, Nail Salon, Beauty Clinic, Dog Groomer, Tattoo Studio, Massage Clinic, Physiotherapist — full pain mapping across 8 categories: Booking/Scheduling, Communication/WhatsApp Overload, After-Hours, No-Show/Cancellation, Review/Reputation, Payment/Cash Flow, Client Retention, Admin Overload

## 14 SERVICES TABLE

| # | Pain-Point Name | Service Name | MRR NIS | Setup NIS | Setup Days | Demo 60s? | Conversion/10 | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | Stop Missing Messages While You're With a Client | WhatsApp Auto-Responder + Booking Link Bot | 299-449 | 500-800 | 2-3 | Yes | 9 | LEAD PRODUCT |
| 2 | Remind Clients So They Actually Show Up | Automated Appointment Reminder Sequence | 199-349 | 400-600 | 2-3 | Partial | 8 | LEAD PRODUCT |
| 3 | Fill Your Empty Slots Instead of Staring at Them | Last-Minute Slot Broadcast Bot | 249-399 | 500-700 | 3-4 | Yes | 8 | BUNDLE |
| 4 | Make New Clients Put Skin in the Game Before They Book | WhatsApp Deposit Collection Flow | 349-499 | 700-1000 | 4-5 | Yes | 7 | BUNDLE/UPSELL |
| 5 | Get More Google Reviews Without Asking Awkwardly | Post-Visit Review Request Bot | 199-299 | 300-500 | 1-2 | Yes | 9 | LEAD PRODUCT |
| 6 | Stop Answering the Same Question 30 Times a Day | WhatsApp Services & Pricing Menu Bot | 149-249 | 300-500 | 1-2 | Yes | 9 | LEAD PRODUCT/GATEWAY |
| 7 | Wake Up the Clients Who've Gone Quiet | Dormant Client Reactivation Campaign | 299-449 | 500-800 | 3-4 | Partial | 7 | BUNDLE/UPSELL |
| 8 | Be the Business That Remembers Their Birthday | Birthday & Occasion WhatsApp Campaign | 149-249 | 300-400 | 2-3 | Yes | 6 | BUNDLE SWEETENER |
| 9 | Let Clients Book Themselves at 2am Without Calling You | Self-Service Booking Page (Framer Mini-Site) | 199-349 | 1500-2500 | 3-5 | Yes | 7 | BUNDLE |
| 10 | See Exactly How Your Business Is Doing Without Doing Math | Business Dashboard (Looker Studio) | 149-249 | 400-600 | 2-3 | Yes | 5 standalone/9 bundle | BUNDLE ADD-ON |
| 11 | Stop Answering the Same Question 30 Times a Day on WhatsApp | New Client Intake & FAQ Auto-Qualifier Bot | 249-349 | 500-700 | 3-4 | Yes | 7 | BUNDLE/VERTICAL |
| 12 | Promote Your Free Slots on Instagram Without Touching It | Cancellation-to-Instagram Story Auto-Poster | 299-449 | 800-1200 | 5-7 | Partial | 6 | UPSELL |
| 13 | Keep Your Clients Coming Back on Schedule | Smart Rebooking Nudge Bot | 299-399 | 500-700 | 3-4 | Partial | 8 | BUNDLE |
| 14 | A New Client Should Feel Taken Care of From the First Message | New Client Welcome Sequence | 199-299 | 400-600 | 2-3 | Yes | 7 | BUNDLE SWEETENER |

## SERVICE DETAILS (Tools & Build Steps)

### Service 1 — WhatsApp Auto-Responder
- Tools: 360dialog, Make.com, Airtable, Calendly
- Step 1: Set up 360dialog WA API, configure welcome + keyword triggers
- Step 2: Make.com: incoming WA → auto-reply with booking link, capture lead in Airtable
- Step 3: Business hours rules (daytime/after-hours), keyword menu for pricing
- Pain: hands full mid-haircut, can't answer
- Churn Risk: Low (clients adapt to WA number)

### Service 2 — Appointment Reminders
- Tools: 360dialog, Make.com, Airtable, Calendly
- Step 1: Connect booking source to Make.com
- Step 2: Trigger T-24h + T-2h WA messages via 360dialog
- Step 3: CONFIRM/CANCEL reply handling, status in Airtable
- Churn Risk: Low

### Service 3 — Last-Minute Slot Broadcast
- Tools: 360dialog, Make.com, Airtable, Calendly, Looker Studio
- Step 1: Build opt-in "last-minute" list in Airtable
- Step 2: Make.com triggered by cancellation → broadcast to opt-in list
- Step 3: Slot-taken replies, fill rate dashboard
- Churn Risk: Low

### Service 4 — Deposit Collection
- Tools: 360dialog, Make.com, Airtable, Sumit/PayPlus, Calendly
- Step 1: Sumit/PayPlus payment link setup
- Step 2: New booking → WA payment link automatically
- Step 3: Payment webhook → confirmed; no-pay → slot released after 2h
- Churn Risk: Low
- Note: Best for tattoo studios, aesthetics clinics; weaker for barbershops

### Service 5 — Review Request Bot
- Tools: 360dialog, Make.com, Airtable
- Step 1: Grab Google Maps review link
- Step 2: Trigger 2-3h after appointment end, send WA with Google link
- Step 3: Optional sentiment pre-filter (1-5 rating before sending review link)
- Churn Risk: Low
- Note: Lowest setup complexity + highest conversion = best first demo

### Service 6 — Pricing Menu Bot
- Tools: 360dialog, Make.com
- Step 1: WhatsApp List Message feature, keyword triggers
- Step 2: Each selection → service details + "Book this" button
- Step 3: Catch-all → "HUMAN" escalation
- Note: HIGHEST WOW DEMO — show it in person, watch jaw drop

### Service 7 — Dormant Client Reactivation
- Tools: 360dialog, Make.com, Airtable, Looker Studio
- Step 1: Airtable: identify last_visit_date > 42 days
- Step 2: Weekly Make.com run → personal-feeling WA nudge
- Step 3: Track who responds, who books, add non-responders to dormant list

### Service 8 — Birthday Campaign
- Tools: 360dialog, Make.com, Airtable, Looker Studio
- Step 1: Birthday field in Airtable, daily 9am trigger
- Step 2: WA birthday message + offer link
- Step 3: Track conversions

### Service 9 — Booking Mini-Site
- Tools: Framer/Webflow, Calendly, Google Analytics
- Step 1: 3-page Framer: Home + Services + Contact
- Step 2: Calendly + Google Business Profile + Waze
- Step 3: Analytics + WA chat widget + directory submissions
- Setup fee: 1,500-2,500 NIS (reflects real build time)

### Service 10 — Looker Studio Dashboard
- Tools: Looker Studio, Airtable, Google Sheets, Make.com
- Step 1: Connect Airtable → Looker Studio
- Step 2: 6-8 KPIs: appointments, no-show rate, top clients, revenue estimate
- Step 3: Weekly Monday email report
- Note: Low standalone value, high bundle stickiness/churn prevention

### Service 11 — Intake & FAQ Bot
- Tools: 360dialog, Make.com, Airtable
- Step 1: WA conversation flow for new first-time numbers
- Step 2: Branch logic per business type (groomer/clinic/tattoo)
- Step 3: Store in Airtable, send owner pre-appointment summary
- Best for: dog groomers, aesthetics clinics

### Service 12 — Instagram Story Auto-Poster
- Tools: Make.com, Calendly, Instagram Graph API, Canva API, 360dialog
- Note: Instagram API approval = delay risk; sell after trust established
- Churn Risk: Medium (API fragility)

### Service 13 — Smart Rebooking Nudge
- Tools: 360dialog, Make.com, Airtable, Looker Studio, Calendly
- Intervals: haircut=28d, color=45d, gel nails=21d, massage=14d, laser=35d
- Step 1: Daily Make.com check by service type
- Step 2: Personal WA nudge with booking link
- Step 3: No-response → dormant list (connects to Service 7)

### Service 14 — New Client Welcome Sequence
- Tools: 360dialog, Make.com, Airtable
- Step 1: Trigger on first-time booking
- Step 2: Directions, parking, what to prepare, provider intro
- Step 3: T-2h confirmation + post-visit review trigger (Service 5)
- Best for: aesthetics clinics, massage, premium salons

## 4 BUNDLES

| Bundle | Services | MRR NIS | Setup NIS | For Who | Pitch Trigger |
|---|---|---|---|---|---|
| "Don't Miss a Booking" Starter | 6+1+2 | 699 | 1,200 | Solo ops (barber/nail/hair) | "How many messages did you miss this week?" |
| "Never Lose a Slot" No-Show Killer | 2+4+3+10 | 999 | 1,800 | Barber/tattoo/aesthetics — high no-show cost | "How much did no-shows cost you last month?" |
| "Full Autopilot" Growth System | 1+2+5+7+13+10 | 1,490 | 2,500 | Salons/clinics with 100+ clients | Upgrade after 60 days on Bundle 1 |
| "Clinic Pack" | 11+1+4+14+2+5 | 1,699 | 3,000-3,500 | Aesthetics/physio/massage (200-800 NIS/visit) | "My clients expect a certain level of service" |

## COMPETITIVE POSITIONING STATEMENT

EN: Bapita builds the WhatsApp receptionist your business can't afford to hire — set up in a week, priced for a solo shop, built specifically for Israeli service businesses.

HE: בפיתה — זה שמים לך עוזר שמנהל את הוואטסאפ, ממלא את היומן, ומזכיר ללקוחות שיגיעו. בלי מזכירה, בלי טכנולוגיה מסובכת, בלי להוציא עשרת אלפים שקל.

Why ownable vs competitors:
- vs Whale Group: generic SaaS DIY → Bapita is done-for-you, vertical-specific
- vs Automaziot: 15,000+ NIS one-time → Bapita is low entry + ongoing relationship
- vs Gambot: enterprise-only → Bapita built exclusively for solo operators
- "בפיתה" concept is culturally Israeli, non-replicable by non-Israeli competitors

## FIRST 21 DAYS ACTION MAP
Week 1: Build Service 6 (Pricing Menu Bot) + Service 5 (Review Bot) — fastest build, highest demo wow
Week 2: Walk into 3 barbershops + 2 nail salons Herzliya. Demo live. Close Bundle 1: 699/mo + 1,200 setup
Week 3: First invoice = 1,899 NIS Day 1 + 699 NIS/mo recurring
