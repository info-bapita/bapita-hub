# Bapita — Product & Technical Audit
**Date:** 2026-06-17  
**Auditor:** PM + Technical Architecture review  
**Scope:** Settings page, public booking flow, slots API, email infrastructure, DB schema, onboarding UX  
**Source files reviewed:**
- `bapita-dashboard/src/app/(dashboard)/settings/page.tsx`
- `bapita-dashboard/src/app/(dashboard)/new-booking/page.tsx`
- `bapita-dashboard/src/app/api/public/book/route.ts`
- `bapita-dashboard/src/app/api/public/slots/route.ts`
- `bapita-dashboard/src/app/api/send-confirmation/route.ts`
- `bapita-dashboard/src/types/index.ts`
- `bapita/v2/docs/bapita-launch-qa.md`

---

## How to Use This Doc

Each finding has a severity, exact file+line, what's wrong, real-world impact, and a literal implementation blueprint.

Findings are grouped into fix batches. Start a new chat per batch with:

> "I'm working on the Bapita tech audit (`bapita/v2/docs/tech-audit-2026-06-17.md`). Let's fix Batch [X] — [name]. Dashboard repo: `/Users/admin/Desktop/bapita-dashboard`"

After each batch, update the Status column below to `✅ Done`.

---

## Status Tracker

| # | Finding | Pillar | Severity | Batch | Status |
|---|---------|--------|----------|-------|--------|
| 1 | Double-booking race condition — no atomic DB constraint | DB | **CRITICAL** | A | ✅ Done |
| 2 | WhatsApp add-on button links to broken URL | Copy | **Critical** | A | ✅ Done |
| 3 | Settings tabs overflow on mobile (375px) | Copy/UX | High | A | ✅ Done |
| 4 | Dead code: `_BookingSection` + `_NotificationsSection` | DB | Low | A | ✅ Done |
| 5 | Barber gets no notification when customer omits email | Logic | **Critical** | B | ✅ Done |
| 6 | Email send blocks API response — adds 400ms–2s latency | Logic | High | B | ✅ Done |
| 7 | Buffer time between appointments not wired to slot generator | Logic | High | B | ✅ Done |
| 8 | Advance booking window not enforced server-side | Logic | Medium | B | ✅ Done |
| 9 | Date construction timezone edge case in slots API | Logic | Low | B | ✅ Done |
| 10 | Confirmation email is English-only for Israeli customers | Copy | High | C | ✅ Done |
| 11 | Setup form copy + button text — cold, generic | Copy | High | C | ✅ Done |
| 12 | Save button shows "Saved" on first load (no action taken yet) | Copy/UX | Medium | C | ✅ Done |
| 13 | Delete service — no confirmation, instant irreversible | Copy/UX | High | C | ✅ Done |
| 14 | Save errors show "Failed to save" with zero context | Copy/UX | Medium | C | ✅ Done |
| 15 | No post-onboarding checklist after first setup | Copy/UX | Medium | C | ✅ Done |
| 16 | Slug in setup form auto-generates random hash (ugly URL) | UX/Logic | High | D | ✅ Done |
| 17 | No blocked dates / time-off for barbers | Feature | Medium | D | ✅ Done |
| 18 | No customer cancellation flow — no-shows instead of cancels | Feature | Medium | D | ⬜ Open |
| 19 | Service reorder uses N parallel DB calls, zero error handling | DB | Medium | D | ⬜ Open |
| 20 | `useBusiness` refresh silent failure — stale state after failed refresh | DB | Low | E | ⬜ Open |
| 21 | IP rate limit is in-memory — resets on cold start, bypassed on multi-instance | DB | Low | E | ⬜ Open |

**Severity key:** Critical = data integrity failure or trust-breaking bug · High = user-facing broken/wrong · Medium = friction or polish gap · Low = edge case or maintenance risk

---

## Batch A — Quick Wins + Critical DB Fix
*Can all be done in one session. Items 1–4. Max ~30 min total.*

---

### Finding #1 — Double-Booking Race Condition (CRITICAL)

**Severity:** CRITICAL  
**File:** `src/app/api/public/book/route.ts` lines 75–93  
**DB:** `bookings` table — missing unique constraint  

#### What's wrong

The POST handler reads existing bookings, checks for time conflicts, then inserts. This read-then-write is NOT atomic.

**Race condition:** Two customers submit the same slot at the same millisecond. Both requests pass the conflict check before either has inserted. Both inserts succeed. Barber gets two clients for 10:00 AM.

The application-level conflict check (lines 75–93) is a safety net, not a solution. Only a DB-level unique constraint prevents this.

#### Real-world impact

If a demo booking URL goes even slightly viral, or two people book at the same time, double-bookings happen silently. A barber's first client experience is two people showing up at once. That's the product dead on arrival.

#### Fix

**Step 1 — Run in Supabase SQL Editor:**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS bookings_slot_unique
ON bookings(business_id, appointment_date, appointment_time)
WHERE status IN ('confirmed', 'pending');
```

**Step 2 — In `route.ts`, after the `.insert()` call, catch the unique violation:**
```ts
if (bookingError) {
  console.error("Booking insert error:", bookingError);
  const msg = bookingError.code === '23505'
    ? "This time slot was just taken. Please go back and choose another time."
    : "failed to create booking";
  const status = bookingError.code === '23505' ? 409 : 500;
  return NextResponse.json({ error: msg }, { status });
}
```

**Step 3 — Optionally remove the manual conflict check (lines 75–93).** The DB constraint now handles it atomically. Keeping the app-level check as a UX fast-fail is fine, but it's no longer the safety mechanism.

#### Verify

Open two browser tabs on the same demo booking page. Both select the same date, same service, same time slot. Submit both within 1 second. Only one should succeed. Second should get: "This time slot was just taken."

---

### Finding #3 — Settings Tabs: Mobile Overflow at 375px

**Severity:** High  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 1342–1368  

#### What's wrong

Four tabs (`"Business Info"`, `"Services"`, `"Working Hours"`, `"Reviews"`) render in a flex row with `gap: 8` and `whiteSpace: "nowrap"`. At 375px (iPhone SE, many Android phones), the total width likely overflows the container. There is no `overflowX: auto` on the wrapper.

Result: "Reviews" (or "Working Hours") tab is clipped or partially off-screen. Barbers on mobile can't reach it.

#### Real-world impact

All of your initial clients (Israeli barbers) use mobile as their primary device. If Settings tabs clip on iPhone, they can't access Hours or Reviews.

#### Fix

**In `settings/page.tsx` at line ~1342–1343**, update the tab container div style:
```tsx
// Change from:
<div style={{ display: "flex", gap: 8, paddingBottom: 18 }}>

// To:
<div style={{
  display: "flex",
  gap: 8,
  paddingBottom: 18,
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
}}>
```

**Also shorten tab labels** in the `SECTIONS` constant (line ~65–70):
```ts
// Change from:
{ id: "business", label: "Business Info" },
{ id: "hours",    label: "Working Hours" },

// To:
{ id: "business", label: "Business" },
{ id: "hours",    label: "Hours" },
```

This cuts total tab width by ~60px and reduces the overflow risk significantly.

#### Verify

Open Settings on iPhone SE (375px) in browser DevTools. All 4 tabs should be reachable by scrolling the tab row. No tab should be clipped.

---

### Finding #4 — Dead Code: `_BookingSection` + `_NotificationsSection`

**Severity:** Low (maintenance risk)  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 1012–1306  

#### What's wrong

Two fully implemented, never-rendered components sit in the settings file prefixed with `_`. They use `(business as any)` type casts throughout and reference DB columns (`buffer_minutes`, `advance_days`, `cancellation_policy`, `notif_email_new_booking`, etc.) that don't exist in the schema. They will cause silent runtime errors if ever accidentally activated.

Every future Claude session editing this file reads these ~300 lines of dead code, creates noise, and risks suggesting activating them without the required DB migration.

#### Fix

Make sure it doesn't break anything, it's not used anywhere, if all ok: Delete lines 1012–1306 entirely (both `_BookingSection` and `_NotificationsSection`).

The buffer_minutes concept will be implemented cleanly when ready (see Finding #7). The WhatsApp notifications section belongs in `addons/page.tsx` when the add-on is live.

#### Verify

`settings/page.tsx` no longer contains `_BookingSection` or `_NotificationsSection`. File compiles. Settings page renders identically.

---

## Batch B — Backend Logic Fixes
*Email, slots, rate limiting. ~1.5h total.*

---

### Finding #5 — Barber Gets No Notification When Customer Omits Email (CRITICAL)

**Severity:** Critical  
**File:** `src/app/api/public/book/route.ts` lines 130–168  

#### What's wrong

The barber's BCC notification is bundled inside the customer email send block. The entire block is gated on `customerEmail && emailValid` (line 131). If a customer books without providing an email address, the block is skipped entirely — including the barber's notification.

```ts
// Current (broken):
if (customerEmail && emailValid) {
  // ... fetch bccEmail
  // ... send to customer
  // ... BCC barber ← only fires when customer has email
}
```

#### Real-world impact

A customer books without giving an email (common for older Israeli customers). The barber gets zero notification. They find out about the new booking only by opening the dashboard. Missed appointments, wasted slots, angry first client.

#### Fix
2 things: 
- phone number input when booking from any businesses website should have the rule to be a real number (correct amount of digits, no letters etc)
- Decouple barber notification from customer email send:

```ts
// In route.ts, after successful booking insert:

// 1. Always fetch barber's notification email
const { data: bizData } = await supabase
  .from("businesses")
  .select("notification_email")
  .eq("id", businessId)
  .single();
const bccEmail = bizData?.notification_email || process.env.GMAIL_USER!;

// 2. Send customer confirmation (only if email provided)
const emailValid = typeof customerEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
if (customerEmail && emailValid) {
  try {
    await transporter.sendMail({
      from: `Bapita <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      // NO bcc here — send separately below
      subject: `Booking confirmed — ${esc(businessName)}`,
      html: `...`, // customer template
    });
  } catch (e) { console.error("Customer email failed:", e); }
}

// 3. Always send barber notification (separate email)
try {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("he-IL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  await transporter.sendMail({
    from: `Bapita <${process.env.GMAIL_USER}>`,
    to: bccEmail,
    subject: `הזמנה חדשה — ${esc(customerName)} | ${esc(serviceName)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 8px;">הזמנה חדשה 📅</h2>
        <div style="background:#FAF5EC;border-radius:12px;padding:20px;margin-bottom:24px;">
          <div style="margin-bottom:8px;"><strong>לקוח:</strong> ${esc(customerName)}</div>
          <div style="margin-bottom:8px;"><strong>טלפון:</strong> ${esc(customerPhone)}</div>
          <div style="margin-bottom:8px;"><strong>שירות:</strong> ${esc(serviceName)}</div>
          <div style="margin-bottom:8px;"><strong>תאריך:</strong> ${esc(formattedDate)}</div>
          <div><strong>שעה:</strong> ${esc(time.slice(0, 5))}</div>
        </div>
      </div>
    `,
  });
} catch (e) { console.error("Barber notification failed:", e); }
```

#### Verify

Book an appointment on a demo page WITHOUT providing an email. Check `info.bapita@gmail.com` (or the business's `notification_email`) — a notification should arrive within 30 seconds.

---

### Finding #6 — Email Send Blocks API Response

**Severity:** High  
**File:** `src/app/api/public/book/route.ts` lines 133–168  

#### What's wrong

`await transporter.sendMail(...)` is called inside the POST handler before `return NextResponse.json({ ok: true })`. Gmail SMTP round-trip takes 400ms–2s. The customer sits on a spinner waiting for SMTP before their confirmation screen appears.

Secondary risk: if a customer taps Submit twice (because it feels slow), the phone rate limit catches it, but only after another DB query.

#### Fix

Use Next.js `after()` to defer email after the response is sent. Requires Next.js 15+ (which this project uses):

```ts
import { after } from 'next/server';

// In the POST handler, after booking insert succeeds,
// replace the email block with:
after(async () => {
  // All email logic here (both customer + barber emails)
  // Runs AFTER response is returned to client
});

return NextResponse.json({ ok: true }); // returns immediately
```

The customer sees their confirmation instantly. Email fires in the background on Vercel's Fluid Compute.

#### Verify

Submit a booking. The confirmation screen should appear in under 500ms. Then check email — it should still arrive (just async).

---

### Finding #7 — Buffer Time Not Wired to Slot Generator

**Severity:** High  
**File:** `src/app/api/public/slots/route.ts` lines 9–38  

#### What's wrong

The `getSlots()` function increments slots by `t += durationMinutes` with no buffer. The `_BookingSection` dead code (now deleted per Finding #4) referenced a `buffer_minutes` concept that was never wired to actual slot generation.

Result: A 30-min haircut at 10:00 shows the next slot at 10:30, even if the barber needs 10 minutes between clients. Back-to-back slots with no gap.

#### Real-world impact

A barber who wants 10 minutes between clients to clean up and reset gets zero gap. They'll be rushed, late, and blame the software.

#### Fix

**Step 1 — DB migration (run in Supabase SQL Editor):**
```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buffer_minutes integer DEFAULT 0;
```

**Step 2 — Update `types/index.ts`:** Add `buffer_minutes?: number | null;` to the `Business` type.

**Step 3 — Update `slots/route.ts`:**

In the business fetch (line ~52), add `buffer_minutes` to the select:
```ts
const { data: business } = await supabase
  .from("businesses")
  .select("business_hours, buffer_minutes")
  .eq("id", businessId)
  .single();
```

Pass buffer to `getSlots`:
```ts
const bufferMinutes = business?.buffer_minutes ?? 0;
const slots = getSlots(
  new Date(date + "T12:00:00"),
  duration,
  business?.business_hours as BusinessHours | null,
  booked,
  bufferMinutes, // ← new param
);
```

Update `getSlots` signature and logic:
```ts
function getSlots(
  date: Date,
  durationMinutes: number,
  businessHours: BusinessHours | null,
  booked: { appointment_time: string; duration: number }[],
  bufferMinutes: number = 0, // ← new param
): string[] {
  // ...
  const bookedRanges = booked.map((b) => {
    const [h, m] = b.appointment_time.split(":").map(Number);
    const start = h * 60 + m;
    return { start, end: start + (b.duration || 30) + bufferMinutes }; // ← add buffer to booked end
  });

  const slots: string[] = [];
  for (let t = openMinutes; t + durationMinutes <= closeMinutes; t += durationMinutes + bufferMinutes) { // ← add buffer to step
    const overlaps = bookedRanges.some((r) => t < r.end && t + durationMinutes > r.start);
    if (!overlaps) {
      slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
    }
  }
  return slots;
}
```

**Step 4 — Settings UI:** Add buffer picker to the `HoursSection` in `settings/page.tsx`. After the Save button, add a `SectionCard` titled `"Break between appointments"` with pill buttons: `[None] [5 min] [10 min] [15 min] [30 min]`. Save to `businesses.buffer_minutes`. Include in the `HoursSection.save()` payload.

#### Verify

Set buffer to 15 minutes. Book a 30-min service at 10:00. Public booking page should show next available slot at 10:45 (not 10:30).

---

### Finding #8 — Advance Booking Window Not Enforced Server-Side

**Severity:** Medium  
**File:** `src/app/api/public/slots/route.ts`  

#### What's wrong

Customers can request slots for any future date — 6 months, 2 years out. The `advance_days` concept exists in the dead code (defaulting to 30 days) but is never enforced server-side or client-side.

#### Real-world impact

Low-priority for launch but creates noise in the calendar. More importantly, if a barber closes for renovations in 3 months and a customer booked a slot for that date, it's an invisible problem until it becomes a no-show.

#### Fix

**Step 1 — DB migration:**
```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS advance_days integer DEFAULT 30;
```

**Step 2 — Update `types/index.ts`:** Add `advance_days?: number | null;` to `Business`.

**Step 3 — In `slots/route.ts` GET handler**, after fetching business data, add:
```ts
const advanceDays = business?.advance_days ?? 30;
const requestedDate = new Date(date + "T12:00:00");
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + advanceDays);
if (requestedDate > maxDate) {
  return NextResponse.json({ slots: [] });
}
```

**Step 4 — Settings UI:** Add a "How far ahead clients can book" picker to `HoursSection` alongside the buffer picker. Pills: `[7 days] [14 days] [30 days] [60 days] [90 days]`. Default: 30.

#### Verify

Set advance_days to 7. Try to view available slots on a date 8 days from now — should return empty slots.

---

### Finding #9 — Date Construction Timezone Edge Case

**Severity:** Low  
**File:** `src/app/api/public/slots/route.ts` line 71  

#### What's wrong

`new Date(date + "T00:00:00")` creates a date at midnight in the server's local timezone. Vercel servers run in UTC. For dates near DST transitions or when the server is under load near midnight UTC (= 3am IST), `getDay()` could theoretically return the wrong day.

This is unlikely to cause production bugs in practice, but it's a hardening issue.

#### Fix

Change to `new Date(date + "T12:00:00")` — noon UTC is always unambiguously the correct date regardless of timezone offset up to ±12 hours.

**In `slots/route.ts` line 71:**
```ts
// Change from:
const slots = getSlots(
  new Date(date + "T00:00:00"),
  ...
// To:
const slots = getSlots(
  new Date(date + "T12:00:00"),
  ...
```

Also apply the same fix in `book/route.ts` line 141 where `formattedDate` is constructed.

---

## Batch C — Copy & UX Polish
*No DB migrations needed. Settings page + email copy. ~1.5h total.*

---

### Finding #10 — Confirmation Email: English-Only for Israeli Customers

**Severity:** High  
**File:** `src/app/api/public/book/route.ts` lines 149–163  
**Also:** `src/app/api/send-confirmation/route.ts`  

#### What's wrong

The booking confirmation email is hardcoded in English (`"Booking confirmed"`, `"Hi [name], your appointment is set."`). The booking pages default to Hebrew for Israeli barbers. A customer who books through a Hebrew page receives an English email — completely inconsistent experience.

#### Real-world impact

Israeli customers (especially older demographics) receive a foreign-feeling email from what they thought was their local barber's system. The barber looks unprofessional. The Bapita brand looks like a generic foreign SaaS.

#### Fix

**Step 1 — Accept `lang` in the POST body** (sent from the public booking page):
```ts
const {
  businessId, businessName,
  serviceId, serviceName, serviceDuration, servicePrice,
  date, time,
  customerName, customerPhone, customerEmail,
  lang, // ← new: "he" or "en"
} = await req.json();
```

**Step 2 — Add Hebrew email template:**
```ts
function buildEmailHtml(params: {
  lang: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  formattedDate: string;
  time: string;
  servicePrice: number;
}): { subject: string; html: string } {
  const { lang, customerName, businessName, serviceName, formattedDate, time, servicePrice } = params;
  
  if (lang === 'he') {
    return {
      subject: `ההזמנה שלך אושרה — ${esc(businessName)}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;direction:rtl;text-align:right;">
          <h2 style="margin:0 0 8px;">הזמנה אושרה</h2>
          <p style="color:#555;margin:0 0 24px;">שלום ${esc(customerName)}, התור שלך נקבע.</p>
          <div style="background:#FAF5EC;border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="margin-bottom:8px;"><strong>עסק:</strong> ${esc(businessName)}</div>
            <div style="margin-bottom:8px;"><strong>שירות:</strong> ${esc(serviceName)}</div>
            <div style="margin-bottom:8px;"><strong>תאריך:</strong> ${esc(formattedDate)}</div>
            <div style="margin-bottom:8px;"><strong>שעה:</strong> ${esc(time.slice(0, 5))}</div>
            <div><strong>מחיר:</strong> ₪${servicePrice || 0}</div>
          </div>
          <p style="color:#888;font-size:13px;">לביטול או שינוי תור, צרו קשר עם העסק ישירות.</p>
        </div>
      `,
    };
  }

  // English (default)
  return {
    subject: `Booking confirmed — ${esc(businessName)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 8px;">Booking confirmed</h2>
        <p style="color:#555;margin:0 0 24px;">Hi ${esc(customerName)}, your appointment is set.</p>
        <div style="background:#FAF5EC;border-radius:12px;padding:20px;margin-bottom:24px;">
          <div style="margin-bottom:8px;"><strong>Business:</strong> ${esc(businessName)}</div>
          <div style="margin-bottom:8px;"><strong>Service:</strong> ${esc(serviceName)}</div>
          <div style="margin-bottom:8px;"><strong>Date:</strong> ${esc(formattedDate)}</div>
          <div style="margin-bottom:8px;"><strong>Time:</strong> ${esc(time.slice(0, 5))}</div>
          <div><strong>Price:</strong> ₪${servicePrice || 0}</div>
        </div>
        <p style="color:#888;font-size:13px;">To cancel or reschedule, contact the business directly.</p>
      </div>
    `,
  };
}
```

**Step 3 — Use the function in the email send block:**
```ts
const effectiveLang = lang === 'he' ? 'he' : 'en';
const { subject, html } = buildEmailHtml({
  lang: effectiveLang, customerName, businessName,
  serviceName, formattedDate, time, servicePrice,
});
await transporter.sendMail({ from: ..., to: customerEmail, subject, html });
```

**Step 4 — On the public booking page**, add `lang: currentLang` to the POST body where `currentLang` is the booking page's active language state.

#### Verify

Book on `demo-classic` in Hebrew mode with a customer email. Confirmation email should arrive in Hebrew with RTL layout.

---

### Finding #11 — Setup Form: Cold, Generic Copy

**Severity:** High  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 215–239  

#### What's wrong

First-time business setup screen reads:
- Header: `"Set up your business"`
- Subtext: `"Fill in the basics to get started"`
- Button: `"Create business"` / `"Creating…"`

This is generic tech-startup copy. A barber who just agreed to ₪2,500 with you expects warmth and confidence, not a cold SaaS form.

There is also no feedback after creation — the user is silently dropped into the full Settings page with no guidance about what to do next.

#### Fix

**Proposed copy changes:**

| Current | New |
|---------|-----|
| `"Set up your business"` | `"Let's build your booking page"` |
| `"Fill in the basics to get started"` | `"Takes 2 minutes. Your page goes live right after."` |
| `"Create business"` | `"Create my page"` |
| `"Creating…"` | `"Creating your page…"` |

**After successful creation**, show a one-time banner (stored in `localStorage`) above the Settings tabs:

```
✅ Your page is created! Add your services and working hours to go live.
```

**Dev instruction:** In `SetupForm` (`settings/page.tsx:215–239`), update all string literals. After `onCreated()` resolves, call `localStorage.setItem('bapita_show_welcome', '1')`. In `SettingsPage`, check `localStorage.getItem('bapita_show_welcome')` on mount — if present, render a dismissible amber banner with the welcome message. On dismiss, `localStorage.removeItem('bapita_show_welcome')`.

---

### Finding #12 — Save Button Shows "Saved" on First Load

**Severity:** Medium  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 161–183 (`SaveButton` component)  

#### What's wrong

`SaveButton` renders `"Saved"` when `dirty=false` and `saving=false`. On first load, before the user has done anything, the button shows `"Saved"`. A barber loading Settings for the first time sees a green "Saved" state without having taken any action. This creates a false sense of confirmation.

#### Fix

Option A (simpler): Change the label from `"Saved"` to `"No changes"` with fully muted gray styling (no amber, no shadow).

Option B (cleaner): Hide the button entirely on first load. Add an `everSaved` boolean prop — only show the button when `dirty || everSaved`.

**Dev instruction for Option A:**
In `SaveButton` (`settings/page.tsx:162–183`), update the `!dirty` state:
```tsx
// Change:
background: dirty ? "var(--wash-amber)" : "var(--color-cream-2)",
color: dirty ? "#fff" : "var(--color-muted)",

// The label is already: {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
// Change "Saved" to "No changes":
{saving ? "Saving…" : dirty ? "Save changes" : "No changes"}
```

---

### Finding #13 — Delete Service: No Confirmation, Instant and Irreversible

**Severity:** High  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 499–503, 685–694  

#### What's wrong

`deleteService()` calls `supabase.from("services").delete()` immediately on tap with no confirmation step. The red trash icon is small and mobile touch targets are close to the Edit button. Accidental deletion is easy. There is no undo.

#### Real-world impact

A barber on mobile, trying to drag-reorder services, taps the delete icon by accident. The service is gone. They call you in a panic. For a "done-for-you" platform, this is a trust-breaking failure.

#### Fix

Two-tap confirmation pattern (no modal needed):

```tsx
// Add to ServicesSection state:
const [pendingDelete, setPendingDelete] = useState<string | null>(null);

// Replace deleteService:
async function requestDelete(id: string) {
  if (pendingDelete === id) {
    // Second tap — confirm
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setPendingDelete(null);
    showToast("Service removed", "success");
  } else {
    // First tap — prime
    setPendingDelete(id);
    setTimeout(() => setPendingDelete(null), 2500); // auto-cancel after 2.5s
  }
}
```

**Update the delete button render:**
```tsx
<button
  onClick={() => requestDelete(service.id)}
  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
  style={{
    color: pendingDelete === service.id ? "#fff" : "#EF4444",
    background: pendingDelete === service.id ? "#EF4444" : "transparent",
  }}
  aria-label={pendingDelete === service.id ? "Tap again to confirm delete" : "Remove service"}
>
  {pendingDelete === service.id
    ? <span style={{ fontSize: 10, fontWeight: 700, padding: "0 4px" }}>✕ confirm</span>
    : <svg>...</svg> /* existing trash icon */
  }
</button>
```

---

### Finding #14 — Save Errors Show "Failed to save" With Zero Context

**Severity:** Medium  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 300, 769, 918  

#### What's wrong

Every save error calls `showToast("Failed to save", "error")`. If the slug is already taken (Supabase `code: '23505'`), the barber gets "Failed to save" with no explanation. They try again with the same slug. Same error. They call you.

#### Fix

Map Supabase error codes to human-readable messages in each save function:

```ts
function getErrorMessage(error: { code?: string; message?: string }): string {
  if (error.code === '23505') return "This URL is already taken. Choose a different one.";
  if (error.code === 'PGRST116') return "Not found — please reload the page.";
  if (error.message?.includes('network')) return "Connection issue — please try again.";
  return "Couldn't save. Please try again.";
}
```

Apply in `BusinessSection.save()` (line ~300):
```ts
if (error) { showToast(getErrorMessage(error), "error"); return; }
```

Apply in `HoursSection.save()` (line ~769):
```ts
if (error) { showToast(getErrorMessage(error), "error"); return; }
```

Apply in `ReviewsSection.saveReview()` (line ~918):
```ts
if (error) { showToast(getErrorMessage(error), "error"); return; }
```

---

### Finding #15 — No Post-Onboarding Checklist

**Severity:** Medium  
**File:** `src/app/(dashboard)/settings/page.tsx`  

#### What's wrong

After `SetupForm` creates the business and transitions to Settings, the barber lands on the Business Info tab with no guidance. The required next steps (add a service → set working hours → page is live) are invisible.

A barber who only fills in their name and address then shares the booking link — clients see no services and no available slots. They think it's broken.

#### Fix

Show a dismissible onboarding banner above the Settings tabs for new businesses. Use `localStorage` so it only appears once.

**Checklist items:**
1. `✅ Business created` (always done at this point)
2. `○ Add at least one service` (check: `services.length > 0`)
3. `○ Set working hours` (check: `business.business_hours !== null`)
4. Shows `✅ Your booking page is live!` when both #2 and #3 are done — then auto-dismiss after 3 seconds

**Dev instruction:**

```tsx
// In SettingsPage, above the tab header:
function OnboardingChecklist({ business, supabase }: { business: Business, supabase: ... }) {
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('bapita_checklist_done') === '1'
  );
  
  useEffect(() => {
    if (dismissed) return;
    supabase.from("services")
      .select("*", { count: "exact", head: true })
      .eq("business_id", business.id)
      .eq("active", true)
      .then(({ count }) => setServiceCount(count ?? 0));
  }, [business.id]);

  if (dismissed || serviceCount === null) return null;

  const hasService = serviceCount > 0;
  const hasHours = business.business_hours !== null;
  const allDone = hasService && hasHours;

  if (allDone) {
    localStorage.setItem('bapita_checklist_done', '1');
    return null;
  }

  return (
    <div style={{ background: "var(--color-amber)", color: "#fff", padding: "12px 20px", borderRadius: 12, margin: "0 0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Almost live! Finish setup:</div>
        <div style={{ fontSize: 13 }}>
          {hasService ? "✅" : "○"} Add a service &nbsp;·&nbsp;
          {hasHours ? "✅" : "○"} Set working hours
        </div>
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
    </div>
  );
}
```

---

## Batch D — Feature Additions
*Larger scope. Do each in its own session if needed.*

---

### Finding #16 — Setup Form Generates Ugly Random Slug in Booking URL

**Severity:** High  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 204–210 (`SetupForm.createBusiness`)  

#### What's wrong

The slug is auto-generated as `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`. "Studio Avi" → `studio-avi-x7k3p`. This URL is printed on business cards, shared on Instagram, and sent in confirmation emails. The random hash looks unprofessional and untrustworthy.

#### Real-world impact

A barber shares `book.bapita.com/studio-avi-x7k3p` on their Instagram bio. They'll ask you to change it (support request). Or they just won't share the link.

#### Fix

Let the barber choose their slug during setup. Show live URL preview as they type.

**Dev instruction:** In `SetupForm`:
1. Add `const [slug, setSlug] = useState("")` state.
2. Add a URL input below the business name field with `book.bapita.com/` as a static prefix (same pattern as `BusinessSection` already uses at line ~354).
3. Sanitize on input: `setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ""))`
4. Before insert, if `slug` is not empty, check uniqueness: `const { count } = await supabase.from("businesses").select("*", { count: "exact", head: true }).eq("slug", slug)`. If taken, `showToast("This URL is taken. Try adding your city or initials.", "error"); return;`
5. If `slug` is empty, generate from business name WITHOUT random suffix: `name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")`. If that's taken, append `-2`, `-3`, etc. (loop with count check).

---

### Finding #17 — No Blocked Dates / Time-Off for Barbers

**Severity:** Medium  
**File:** `src/app/api/public/slots/route.ts`, `src/app/(dashboard)/settings/page.tsx`  

#### What's wrong

Barbers cannot block specific dates (vacation, holiday, sick day). Any day with matching business hours shows available slots. A barber who's sick on Thursday will get new bookings all day. They must manually cancel each one and notify each customer.

#### Fix

**Step 1 — DB migration:**
```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS blocked_dates DATE[] DEFAULT '{}';
```

**Step 2 — Update `types/index.ts`:** Add `blocked_dates?: string[] | null;` to `Business`.

**Step 3 — Slots API guard** (in `slots/route.ts`, after fetching business):
```ts
const blocked = business?.blocked_dates || [];
if (blocked.includes(date)) {
  return NextResponse.json({ slots: [] });
}
```
Also add `blocked_dates` to the select: `.select("business_hours, buffer_minutes, advance_days, blocked_dates")`

**Step 4 — Settings UI:** Add a `Blocked dates` subsection inside `HoursSection`. Show a simple month grid. Tapping a date toggles it into/out of `blocked_dates`. Show a list of upcoming blocked dates below. Save on toggle (immediate, like `toggleActive` in services).

**UI copy:**
- Section title: `"Time off & blocked dates"`
- Helper text: `"Block a day to prevent new bookings — existing bookings are not affected."`

---

### Finding #18 — No Customer Cancellation Flow

**Severity:** Medium  
**File:** `src/app/api/public/book/route.ts`, new route needed: `src/app/api/public/cancel/route.ts`  

#### What's wrong

The confirmation email says `"To cancel or reschedule, contact the business directly."` There is no self-serve cancellation link. A customer who wants to cancel will either: (a) not bother → no-show → wasted slot; (b) try to WhatsApp the barber → friction. No-show rates in Israeli barbershops are high. A cancellation link converts no-shows into freed slots.

#### Fix

**Step 1 — DB migration:**
```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancel_token UUID DEFAULT gen_random_uuid();
```

**Step 2 — In `book/route.ts`**, after insert, fetch the cancel token:
```ts
const { data: newBooking } = await supabase
  .from("bookings")
  .select("cancel_token")
  .eq("business_id", businessId)
  .eq("appointment_date", date)
  .eq("appointment_time", time)
  .eq("customer_phone", customerPhone)
  .single();
const cancelToken = newBooking?.cancel_token;
const cancelUrl = `https://book.bapita.com/cancel/${cancelToken}`;
```

**Step 3 — Add cancellation link to email template:**
```html
<a href="${cancelUrl}" style="color:#888;font-size:13px;">Cancel this appointment</a>
```

**Step 4 — Create `src/app/cancel/[token]/page.tsx`** (server component):
- Fetch booking by `cancel_token`
- If not found or already canceled: show "This booking has already been canceled or does not exist."
- If found: show booking details + "Cancel my appointment" button
- On confirm: POST to `/api/public/cancel`

**Step 5 — Create `/api/public/cancel/route.ts`:**
```ts
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "invalid token" }, { status: 400 });
  
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "canceled" })
    .eq("cancel_token", token)
    .in("status", ["confirmed", "pending"]) // can't cancel already-canceled
    .select("customer_name, business_id, appointment_date, appointment_time")
    .single();
  
  if (error || !data) return NextResponse.json({ error: "booking not found or already canceled" }, { status: 404 });
  
  // Optionally notify barber of cancellation
  return NextResponse.json({ ok: true });
}
```

---

### Finding #19 — Service Reorder: N Parallel DB Calls, Zero Error Handling

**Severity:** Medium  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 508–518 (`onDragEnd`)  

#### What's wrong

After drag-to-reorder, `onDragEnd` calls:
```ts
await Promise.all(reordered.map((s, i) => supabase.from("services").update({ display_order: i }).eq("id", s.id)));
```
15 services = 15 parallel Supabase calls. No error handling, no `try/catch`. If 3 calls fail (network blip), the UI shows the new order but the DB has partial, inconsistent `display_order` values. Next page load shows a different order than expected.

#### Fix

Use a single batch upsert instead of N individual calls:

```ts
async function onDragEnd() {
  if (dragIndex.current === null || dragOverIndex.current === null || dragIndex.current === dragOverIndex.current) {
    dragIndex.current = null; dragOverIndex.current = null; return;
  }
  const reordered = [...services];
  const [moved] = reordered.splice(dragIndex.current, 1);
  reordered.splice(dragOverIndex.current, 0, moved);
  setServices(reordered); // optimistic UI update
  dragIndex.current = null; dragOverIndex.current = null;

  // Single batch upsert
  const updates = reordered.map((s, i) => ({
    id: s.id,
    business_id: business.id,
    display_order: i,
  }));
  const { error } = await supabase
    .from("services")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    setServices(services); // revert to pre-drag order
    showToast("Couldn't reorder. Please try again.", "error");
  }
}
```

---

## Batch E — Low Priority / Maintenance
*Do these after first client is onboarded.*

---

### Finding #20 — `useBusiness` Refresh: Silent Failure Risk

**Severity:** Low  
**File:** `src/app/(dashboard)/settings/page.tsx` lines 282–303 (`BusinessSection.save`), similar in `HoursSection`  

#### What's wrong

After every successful save, `await refresh()` is called. If `refresh()` fails (network timeout, Supabase error), the business state in `useBusiness` remains stale — but the user has already seen a success toast. Subsequent saves use a stale `original` baseline. Dirty check becomes incorrect.

Low probability, but if it happens the barber might overwrite fields accidentally.

#### Fix

Wrap `refresh()` in a try/catch with a non-alarming warning toast:

```ts
// In BusinessSection.save() and HoursSection.save():
if (error) { showToast(getErrorMessage(error), "error"); return; }
try {
  await refresh();
  showToast("Business info saved", "success");
} catch {
  showToast("Saved — reload the page if something looks off.", "error");
}
```

---

### Finding #21 — IP Rate Limit Resets on Cold Start / Bypassed on Multi-Instance

**Severity:** Low  
**File:** `src/app/api/public/book/route.ts` lines 11–23  

#### What's wrong

`ipCounts: Map<string, ...>` is module-level. On Vercel Fluid Compute, instances can be reused across requests (good for rate limiting) but reset on cold starts. On multi-instance deployments, each instance has its own Map — a user can bypass the limit by routing to different instances.

For launch scale (single demo + a few barbers), this is fine. The phone-based rate limit is the more robust protection since it's DB-backed.

#### Fix (when you have scale problems, not before)

Replace the in-memory Map with a Redis or Upstash-backed rate limiter. Vercel Marketplace has Upstash as a one-click integration. The library `@upstash/ratelimit` is 5 lines of code.

**No action needed for now.** Logging this for awareness. Phone rate limit at lines 59–68 (DB-backed) is the actual protection.

---

## Batch Summary

| Batch | Findings | Time Estimate | When |
|-------|----------|---------------|------|
| **A** — Quick wins + critical DB | #1, #2, #3, #4 | ~30 min | Before next demo |
| **B** — Backend logic | #5, #6, #7, #8, #9 | ~1.5h | Before first client |
| **C** — Copy & UX polish | #10, #11, #12, #13, #14, #15 | ~1.5h | Before first client |
| **D** — Feature additions | #16, #17, #18, #19 | ~4h | After first client |
| **E** — Maintenance | #20, #21 | ~30 min | After 5+ clients |

---

*Last updated: 2026-06-17. Batch A ✅ Batch B ✅ — Batch C next.*
