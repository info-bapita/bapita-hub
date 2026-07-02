# Bapita — Final Pre-Launch Audit
**Date:** 2026-06-17  
**Status:** Login fixed + deployed. Manual QA in progress.  
**Legend:** 🔴 P1 = blocks launch | 🟡 P2 = fix before first meeting | 🟢 P3 = after first client | ✅ = verified OK | ❌ = broken | ⚠️ = needs attention

---

## Fixes Applied This Session

| Fix | File | Commit | Status |
|---|---|---|---|
| Login race condition — `router.push+refresh` → `window.location.href` | `src/app/login/page.tsx` | `c8c61af` | ✅ Deployed |
| Financials "Connect" → request form modal (no WA number) — submits to `addon_requests` table | `src/app/(dashboard)/financials/page.tsx` | `1dcb0ee` | ✅ Pushed |
| Extras fake usage data — zeroed out CHANNEL_USAGE (1247/342 → 0/0) | `src/app/(dashboard)/extras/page.tsx` | `568cfab` | ✅ Pushed |
| Sitemap try/catch + corrected URLs to `book.bapita.com` | `src/app/sitemap.ts` | `568cfab` | ✅ Pushed |
| `sitemap.xml` + `robots.txt` added to `bapita.com` static landing page | `bapita/sitemap.xml`, `bapita/robots.txt` | `8c45093` | ✅ Pushed |
| A7 — Password reset email: custom API route via Gmail instead of Supabase SMTP | `src/app/api/auth/forgot-password/route.ts`, `src/app/login/page.tsx` | `086d57f` | ✅ Pushed |
| A10 — Signup confirmation email: custom API route via Gmail (branded, not Supabase boilerplate) | `src/app/api/auth/signup/route.ts`, `src/app/login/page.tsx` | `086d57f` | ✅ Pushed |

---

## Known Issues (Pre-QA)

| Item | Severity | Action |
|---|---|---|
| **Financials WA number** — hardcoded `972501234567` placeholder | 🔴 P1 | Update `WA_NUMBER` in `src/app/(dashboard)/financials/page.tsx` with your real number (format: `972` + number without leading 0) |
Done - | **Cancel token DB trigger** — `cancel_token` in bookings is set by a Supabase trigger, not app code. If trigger is missing, no cancel link in emails. | 🔴 P1 | Run in Supabase SQL Editor: `SELECT cancel_token FROM bookings LIMIT 5;` — must be UUID strings, not null |
| **Extras fake usage data** — hardcoded 1,247 WA / 342 SMS | ✅ Fixed | Zeroed out. Now shows 0/2500 WA, 0/1000 SMS. |
| **Gmail sending limit** — all app emails (booking confirmations, auth) go via `info.bapita@gmail.com` SMTP | ℹ️ Expected | 500 emails/day limit. Sufficient for launch and early clients. Upgrade to Resend/SendGrid when approaching limit. |
| **Middleware latency** — `supabase.auth.getUser()` makes network call to Supabase on every protected route | ℹ️ Expected | ~200–400ms per page nav. Normal. Not a bug. |
| **GSC sitemap** — `bapita.com/sitemap.xml` was 404 (static site, no Next.js) | ✅ Fixed | Created static `sitemap.xml` + `robots.txt` in bapita landing repo. After Vercel deploys, resubmit in GSC. |
| **robots.txt for bapita.com** | ✅ Fixed | `robots.txt` created in landing page repo — allows all, references sitemap. |


---

## 1. AUTH FLOWS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| A1 | **Login — email/password** | `dashboard.bapita.com/login` → credentials → Log in | Full page reload → lands on `/calendar`. No spinner hang. | 🔴 P1 | | |
| A2 | **Login — wrong password** | Correct email + wrong password → submit | Red error inline. No redirect. | 🔴 P1 | | |
| A3 | **Login — Google OAuth** | Click "Continue with Google" → pick account | Redirected to `/calendar`. No 404. | 🟡 P2 | | |
| A4 | **Logged-in redirect** | While logged in, visit `/login` | Auto-redirected to `/calendar` | 🟡 P2 | | |
| A5 | **Unauth guard** | Incognito → `dashboard.bapita.com/calendar` | Redirected to `/login` | 🔴 P1 | | |
| A6 | **Forgot password** | "Forgot password?" → email → submit | "Check your email" screen. Email arrives. | 🟡 P2 | | |
| A7 | **Password reset link** | Click link from reset email | Opens `/auth/callback?next=/profile` → Profile page | 🟡 P2 | ✅ Fixed 2026-06-17 | Custom API route `/api/auth/forgot-password` — generates link via service role, sends via Gmail (info.bapita@gmail.com). No Supabase SMTP dependency. |
| A8 | **Sign out** | Hamburger → Sign out | Full redirect to `bapita.com`. Session cleared. | 🔴 P1 | | |
| A9 | **After sign out — back button** | Sign out → press back | Stays on `bapita.com` or `/login` — NOT protected page | 🔴 P1 | | |
| A10 | **New signup** | Signup tab → name, email, password → Create account | "Check your email" screen. Confirm email arrives. | 🔴 P1 | ✅ Fixed 2026-06-17 | Custom API route `/api/auth/signup` — creates user via admin, sends branded confirmation email via Gmail (info.bapita@gmail.com). Subject: "Confirm your Bapita account". ⚠️ Counts toward Gmail 500/day limit. |
| A11 | **Signup → confirm → first login** | Click confirm link → login | `/calendar` loads. `/settings` shows onboarding form. | 🔴 P1 | | |

---

## 2. CALENDAR

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| B1 | **Day view loads** | Login → `/calendar` → Day tab | Today's bookings visible. No crash. | 🔴 P1 | | |
| B2 | **Week view — starts today** | Switch to Week | Leftmost column = today | 🟡 P2 | | |
| B3 | **Month view loads** | Switch to Month | Grid renders. Booking dots on correct dates. | 🟡 P2 | | |
| B4 | **Navigate dates** | Day view → tap forward arrow | Moves to tomorrow. Correct bookings load. | 🟡 P2 | | |
| B5 | **Tap booking → drawer** | Tap any booking | Drawer opens: client name, service, time, status, contact | 🔴 P1 | | |
| B6 | **Update status** | Drawer → change status to "Completed" | Updates immediately (optimistic). Reflects in calendar. | 🔴 P1 | | |
| B7 | **Today strip** | Day view | Booking count + total revenue + up-next chip | 🟡 P2 | | |
| B8 | **Empty day** | Navigate to day with no bookings | Clean empty state, no error | 🟡 P2 | | |
| B9 | **Mobile swipe** | Phone: swipe left/right on day view | Navigates between days smoothly | 🟡 P2 | | |

---

## 3. NEW BOOKING (Owner-Created)

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| C1 | **Search existing client** | `/new-booking` → type name | Matching clients in dropdown | 🔴 P1 | | |
| C2 | **Recent clients on load** | Open `/new-booking` (no typing) | "Recent clients" top 10 shows immediately | 🟡 P2 | | |
| C3 | **Select client → advance** | Click client name | Step 2 (service selection) | 🔴 P1 | | |
| C4 | **Create new client** | "+ New client" → name + phone → Save | Client created → Step 2 | 🔴 P1 | | |
| C5 | **Service list** | Step 2 | Active services with name, duration, price | 🔴 P1 | | |
| C6 | **Select service → Step 3** | Click service | Step 3 (date/time picker) | 🔴 P1 | | |
| C7 | **Time slots load** | Step 3 → pick a date | Slots appear based on `business_hours` | 🔴 P1 | | |
| C8 | **No slots on closed day** | Pick day toggled off in Hours settings | Empty slots / "no availability" | 🟡 P2 | | |
| C9 | **Confirm booking** | Step 4 → Confirm | "Booking confirmed". "View in calendar" button works. | 🔴 P1 | | |
| C10 | **Booking in calendar** | After C9, check `/calendar` | Booking on correct date/time | 🔴 P1 | | |
| C11 | **Email sent** | C9 with client email set | Confirmation arrives at client + BCC to notification email | 🟡 P2 | | |
| C12 | **Mark as paid** | Step 4 → toggle paid → confirm | `payment_status = "cash"` in booking drawer | 🟢 P3 | | |

---

## 4. CLIENTS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| D1 | **Client list loads** | `/clients` | All clients visible. No layout break mobile/desktop. | 🔴 P1 | | |
| D2 | **Search by name** | Type partial name | List filters in real time | 🟡 P2 | | |
| D3 | **Sort options** | Recent / Name / Visits | List reorders correctly | 🟢 P3 | | |
| D4 | **Client profile** | Tap any client | Profile: booking history, total spent, notes | 🔴 P1 | | |
| D5 | **Add note** | Profile → add note → save | Note persists after refresh | 🟡 P2 | | |
| D6 | **Booking history** | Client with past bookings | List with date, service, status | 🟡 P2 | | |
| D7 | **Empty state** | Fresh account, no clients | "No clients yet" — not an error | 🟡 P2 | | |

---

## 5. SETTINGS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| E1 | **Details tab loads** | `/settings` | Name, phone, address pre-filled from DB | 🔴 P1 | | |
| E2 | **Save business info** | Edit name → Save → refresh | Name persists. Toast shown. | 🔴 P1 | | |
| E3 | **Hebrew fields** | Edit `שם`, `סלוגן`, `אודות` → Save | Hebrew content on booking page in HE mode | 🟡 P2 | | |
| E4 | **Notification email** | Change email → Save → make public booking | BCC arrives at new email | 🟡 P2 | | |
| E5 | **Unsaved changes warning** | Edit anything → try to close tab | Browser "Leave site?" prompt | 🟢 P3 | | |
| E6 | **Add service** | Services tab → fill name/price/duration → Add | Appears in list immediately | 🔴 P1 | | |
| E7 | **Toggle service off** | Toggle service | Instantly inactive. Gone from public booking page. | 🔴 P1 | | |
| E8 | **Edit service** | Pencil icon → edit | Form pre-fills with existing data (not blank) | 🟡 P2 | | |
| E9 | **Delete service** | Delete a service | Removed from list and from booking page | 🟡 P2 | | |
| E10 | **Hours — toggle day off** | Toggle Monday off → Save | No slots on Monday on booking page | 🔴 P1 | | |
| E11 | **Hours — change times** | Change open to 10:00 → Save | Booking page slots start at 10:00 | 🔴 P1 | | |
| E12 | **Blocked dates** | Add today as blocked → check booking page | No slots for that date | 🟡 P2 | | |
| E13 | **Default language** | Change to EN → Save | Booking page opens in English by default | 🟡 P2 | | |
| E14 | **Gallery upload** | Upload 3 images | Images appear in gallery on booking page | 🔴 P1 (demo) | | |

---

## 6. INSIGHTS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| F1 | **Revenue card** | `/insights` | Real total from completed bookings | 🟡 P2 | | |
| F2 | **Bar chart** | `/insights` | Recharts renders. No console errors. | 🟡 P2 | | |
| F3 | **Stats grid** | `/insights` | Real booking count, no-shows, etc. | 🟡 P2 | | |
| F4 | **Empty state** | Fresh account | Shows zeros / empty chart without crash | 🟡 P2 | | |

---

## 7. EXTRAS (Add-ons)

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| G1 | **Page loads** | `/extras` | Add-on cards render (WA, Stripe, Google, Ads) | 🟡 P2 | | |
| G2 | **CTA buttons** | Click "Connect" on any card | Opens correct WhatsApp / contact | 🟡 P2 | | |
| G3 | **⚠️ Fake usage numbers** | Click WA or SMS tag | Shows hardcoded 1,247 WA / 342 SMS. Not real. Hide before client demo. | 🟡 P2 | | |

---

## 8. FINANCIALS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| H1 | **Page loads** | `/financials` | Transaction list renders | 🟡 P2 | | |
| H2 | **Real bookings visible** | `/financials` | Completed bookings as transactions | 🟡 P2 | | |
| H3 | **⚠️ WA number** | Click any WhatsApp CTA | Opens `wa.me/972501234567` — fake. **Update `WA_NUMBER` in `financials/page.tsx` to your real number before demo.** | 🔴 P1 | | |

---

## 9. PROFILE

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| I1 | **Change password** | `/profile` → old + new password → Save | Toast success. New password works on next login. | 🟡 P2 | | |
| I2 | **Sign out** | Sign out button | Redirect to `bapita.com` | 🟡 P2 | | |
| I3 | **Delete account** | Delete account flow | Account deleted. Redirect to `bapita.com`. **Test on test account only.** | 🔴 TEST ACCOUNT ONLY | | |

---

## 10. ADMIN (ramikan96@gmail.com only)

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| J1 | **Admin link visible** | Login as `ramikan96@gmail.com` → hamburger | "Admin" entry appears | 🔴 P1 | | |
| J2 | **Admin link hidden** | Login as any other account → hamburger | "Admin" NOT visible | 🔴 P1 | | |
| J3 | **Business list** | `/admin/businesses` | All rows listed | 🔴 P1 | | |
| J4 | **Add new business** | "New Business" → fill form → Save | Row created. `book.bapita.com/[slug]` accessible. | 🔴 P1 | | |
| J5 | **Edit existing business** | Click row → edit name → Save | Change live on booking page | 🔴 P1 | | |

---

## 11. PUBLIC BOOKING PAGES

Run for each: `book.bapita.com/demo-classic` · `book.bapita.com/demo-clean` · `book.bapita.com/demo-dark`

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| K1 | **Mobile load** | Open on phone (375px) | No horizontal scroll. Name + tagline above fold. | 🔴 P1 | | |
| K2 | **Desktop load** | Open at 1440px | Hero fills screen. Layout balanced. | 🔴 P1 | | |
| K3 | **Language toggle** | Click HE/EN | Full RTL in Hebrew. All text translates. No layout break. | 🔴 P1 | | |
| K4 | **Service list** | Scroll to services | Name, price, duration visible. Tap → overlay opens. | 🔴 P1 | | |
| K5 | **Step 1 — service** | Select service | Overlay opens. Service shown. | 🔴 P1 | | |
| K6 | **Step 2 — date** | Pick a date | Date picker works. Closed days grayed. | 🔴 P1 | | |
| K7 | **Step 3 — time slots** | Pick valid date | Slots appear. Match business hours. | 🔴 P1 | | |
| K8 | **Step 4 — submit** | Fill name + phone → Submit | "Booking confirmed" screen. No white screen. | 🔴 P1 | | |
| K9 | **Booking in dashboard** | After K8 → check `/calendar` | Booking on correct date/time | 🔴 P1 | | |
| K10 | **Email confirmation** | K8 with real email | Email arrives at customer. BCC at notification email. | 🟡 P2 | | |
| K11 | **Cancel link in email** | Check email from K10 | Cancel link present. Click → cancel page loads. | 🟡 P2 | ⚠️ Requires cancel_token DB trigger | |
| K12 | **Double booking blocked** | Book a slot, try to book same slot again | Error: "This time slot was just taken." | 🔴 P1 | | |
| K13 | **WA float button** | Scroll past hero (if whatsapp_number set) | WA button visible. Tap → opens WA. | 🟡 P2 | | |
| K14 | **⚠️ Cancel token DB check** | Supabase SQL Editor: `SELECT cancel_token FROM bookings LIMIT 5;` | Non-null UUID in every row. If null → trigger missing → cancel links broken. | 🔴 P1 | ✅ Verified 2026-06-17 | All 5 rows have valid UUIDs |
| K15 | **Gallery** | Scroll to gallery | Images load. Tap → lightbox. Tap outside → closes. | 🟡 P2 | | |
| K16 | **Waze / Google Maps** | Location section | Both links open correct location | 🟡 P2 | | |
| K17 | **Social links** | Instagram / Facebook icons | Open correct profiles or hidden if not set | 🟡 P2 | | |

---

## 12. CANCEL FLOW

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| L1 | **Cancel page loads** | Make booking → email → click cancel link | "Cancel appointment?" with booking details | 🟡 P2 | | |
| L2 | **Confirm cancel** | Click cancel button | Success. Booking status = "cancelled" in dashboard. | 🟡 P2 | | |
| L3 | **Already-cancelled link** | Use same link again | "Already cancelled" — not a crash | 🟡 P2 | | |
| L4 | **Invalid token** | Visit `/cancel/fake-token-xyz` | "Link not found" — not a crash | 🟡 P2 | | |

---

## 13. LANDING PAGE (bapita.com)

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| M1 | **Mobile load** | `bapita.com` on phone | No horizontal scroll. Sharp above fold. | 🔴 P1 | | |
| M2 | **Desktop load** | `bapita.com` on desktop | Hero fills viewport | 🔴 P1 | | |
| M3 | **Demo links** | Click classic/clean/dark links | Open correct booking pages | 🔴 P1 | | |
| M4 | **CTAs** | All buttons | Correct action (WA / email). No dead links. | 🔴 P1 | | |
| M5 | **Footer email** | Footer | Shows `info.bapita@gmail.com` | 🟡 P2 | | |
| M6 | **Page speed** | DevTools → Network → Slow 4G | Loads in under 5 seconds | 🟡 P2 | | |

---

## 14. EMAILS

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| N1 | **Public booking — customer** | Book at `book.bapita.com/demo-classic` with real email | Hebrew email from `info.bapita@gmail.com` with service, date, time, cancel link | 🔴 P1 | | |
| N2 | **Public booking — owner BCC** | Same as N1 | BCC arrives at `notification_email` (or `info.bapita@gmail.com`) | 🔴 P1 | | |
| N3 | **Dashboard new-booking** | `/new-booking` → client with email | English confirmation email sent | 🟡 P2 | | |
| N4 | **No customer email** | Book without email on public page | No crash. No customer email. Owner BCC still sent. | 🟡 P2 | | |

---

## Multi-Tenant Security (Run Once)

| # | Check | Steps | Expected | Priority | Result | Notes |
|---|---|---|---|---|---|---|
| S1 | **RLS isolation** | Create second Supabase user (different email). Login as User B. Go to `/clients`, `/calendar`. | Zero data from User A. | 🔴 P1 | | |
| S2 | **Admin access guard** | Login as non-admin → visit `/admin/businesses` | 403 or redirected. Data not exposed. | 🔴 P1 | | |

---

## Launch Blockers Summary

Before first demo/first client:
- [ ] ✅ Login fix deployed (`c8c61af`)
- [x] ✅ Update `WA_NUMBER` in `financials/page.tsx` → `972534379176` (commit `568cfab`)
- [x] ✅ Verify `cancel_token` DB trigger: all rows have valid UUIDs (verified 2026-06-17)
- [ ] After Vercel deploys: resubmit sitemap in GSC → `https://bapita.com/sitemap.xml`
- [ ] Run full booking flow end-to-end on mobile (public page → calendar → email)
- [ ] Verify RLS: second user cannot see first user's data

---

*Last updated: 2026-06-17*
