# Bapita Dashboard — UI/UX Audit
**Date:** 2026-06-17  
**Auditor:** Principal Product Designer review  
**Scope:** Calendar page + BookingDrawer + all LoadingSkeleton components  
**Source files:**
- `bapita-dashboard/src/components/calendar/BookingDrawer.tsx`
- `bapita-dashboard/src/components/LoadingSkeleton.tsx`
- `bapita-dashboard/src/app/globals.css`

---

## How to Use This Doc

Each finding has a severity, exact file+line, literal fix, and a **Verify** section.  
Batch the fixes however you want across chats. After each batch, update the status column below.

**Start a new fix chat with:**  
> "I'm working on the Bapita UI/UX audit. Let's fix [Finding #X–Y]. Dashboard repo: `/Users/admin/Desktop/bapita-dashboard`"

---

## Status Tracker

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | CalendarSkeleton — structural mismatch | High | ✅ Done |
| 2 | InsightsSkeleton / SettingsSkeleton — wrong background | Medium | ✅ Done |
| 3 | Edit + "Mark as paid" buttons — contrast failure | Critical | ✅ Done |
| 4 | ActionBtn ghost state — near-invisible buttons | High | ✅ Done |
| 5 | History loading — no skeleton, plain text | Medium | ✅ Done |
| 6 | Contact section — emoji icons | Medium | ✅ Done |
| 7 | Status badge — Unicode ▾ dropdown indicator | Low | ✅ Done |
| 8 | Section headers — tracking-widest too loose | Low | ✅ Done |
| 9 | Desktop drawer — no entry animation | Medium | ✅ Done |

**Severity key:** Critical = accessibility/readability failure · High = unprofessional/broken · Medium = polish gap · Low = refinement

---

## Verification Checklist

**Setup once:** Open `dashboard.bapita.com` in Chrome. Open DevTools (F12) → Network tab → set throttling to **Slow 3G**.

---

### #1 — CalendarSkeleton layout
1. Go to `/calendar`. Hard-refresh (Cmd+Shift+R).
2. ✅ Pass: skeleton shows 7 columns with a narrow time gutter on the left and faint chip shapes inside columns.
3. ✅ Pass: background stays warm cream — no white flash.
4. ❌ Fail: 3 tall rectangles visible → old skeleton still rendering.

### #2 — Insights + Settings skeleton background
1. Go to `/insights`. Hard-refresh.
2. ✅ Pass: no white flash during skeleton → content transition.
3. Repeat on `/settings`.
4. ❌ Fail: any brief white background appears before content loads.

### #3 — Edit + "Mark as paid" button contrast *(open)*
> Not yet fixed. Skip for now.

### #4 — ActionBtn ghost buttons *(open)*
> Not yet fixed. Skip for now.

### #5 — History loading skeleton
1. Open a booking drawer for a client who has previous bookings.
2. Watch the **HISTORY** section as the drawer opens.
3. ✅ Pass: a pulsing cream block appears briefly, then resolves to the history card. No "Loading…" text.
4. ❌ Fail: "Loading…" text visible, or a height jump when history data loads.

### #6 — Contact icons (Phone + Email)
1. Open any booking drawer with a phone number and email.
2. Look at the CONTACT section.
3. ✅ Pass: crisp SVG line icons (not emoji). Vertically aligned with the contact text.
4. Open a booking with no phone/email.
5. ✅ Pass: faded (30% opacity) SVG icons, not emoji.
6. ❌ Fail: 📞 or ✉️ emoji visible in any row.

### #7 — Status badge chevron
1. Open any booking drawer. Look at the status badge (e.g. "Completed").
2. ✅ Pass: small crisp chevron-down SVG to the right of the status text.
3. Tap/click the badge — status picker should open.
4. ❌ Fail: ▾ character visible, or chevron invisible/box-shaped.

### #8 — Section header letter-spacing
1. Open any booking drawer. Look at section headers: LABEL, CONTACT, PAYMENT, NOTES, HISTORY.
2. ✅ Pass: headers read as quiet labels — not overly wide or stretched.
3. ❌ Fail: "CONTACT" or "PAYMENT" looks like it has huge gaps between letters.

### #9 — Desktop drawer slide-in animation
1. Make sure browser window is wider than 768px (desktop mode).
2. Click any booking chip on the calendar.
3. ✅ Pass: drawer slides in from the right with a smooth ~200ms motion (subtle translate + fade).
4. ❌ Fail: drawer appears instantly with no motion.

---

## Finding #1 — CalendarSkeleton: Structural Mismatch

**Severity:** High  
**File:** `src/components/LoadingSkeleton.tsx` lines 3–17

### What's wrong
The skeleton renders: 1 header bar + 3 tall monolithic rectangles.  
The real WeekView renders: a 48px time column (left) + 7 equal day columns (right), each with a day-name header and absolute-positioned booking chip blocks inside.  
On load, skeleton shows nothing resembling the real layout → violent layout shift + obvious fake feel.

Additional bug: outer container uses `bg-white` but the calendar page background is `var(--color-cream)` (`#FAF5EC`). The skeleton "pops" cream-to-white on mount.

### The Fix

**Replace entire `CalendarSkeleton` export with:**

```tsx
export function CalendarSkeleton() {
  return (
    <div
      className="flex flex-col h-full animate-pulse"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Header bar with day labels */}
      <div
        className="shrink-0 flex border-b"
        style={{ borderColor: "var(--color-cream-2)", height: 48 }}
      >
        {/* Time column gutter */}
        <div className="w-12 shrink-0" />
        {/* 7 day columns */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center"
            style={{ borderLeft: "1px solid var(--color-cream-2)" }}
          >
            <div
              className="h-5 rounded"
              style={{ width: "60%", background: "var(--color-cream-2)" }}
            />
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div
          className="w-12 shrink-0 flex flex-col gap-8 pt-6 px-1"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded"
              style={{ background: "var(--color-cream-2)" }}
            />
          ))}
        </div>

        {/* Day columns with booking chip skeletons */}
        {Array.from({ length: 7 }).map((_, col) => (
          <div
            key={col}
            className="flex-1 relative pt-3 flex flex-col gap-3 px-1"
            style={{ borderLeft: "1px solid var(--color-cream-2)" }}
          >
            {/* Show chips only on 2–3 columns to mimic sparse real data */}
            {col % 3 !== 2 && (
              <div
                className="rounded-lg"
                style={{
                  height: 36,
                  background: "var(--color-cream-2)",
                  marginTop: `${col * 8}px`,
                }}
              />
            )}
            {col % 4 === 0 && (
              <div
                className="rounded-lg"
                style={{ height: 52, background: "var(--color-cream-2)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Verify
1. Open `dashboard.bapita.com/calendar` on a slow network (Chrome DevTools → Network → Slow 3G).
2. Hard-refresh (Cmd+Shift+R).
3. **Pass:** Skeleton shows a 7-column grid with time labels on the left and faint chip shapes inside columns. Matches the general shape of the loaded calendar.
4. **Pass:** No white flash when skeleton transitions to loaded state — background stays cream throughout.
5. **Fail signal:** If you see 3 tall rectangles, the old skeleton is still rendering.

---

## Finding #2 — InsightsSkeleton / SettingsSkeleton: Wrong Background Token

**Severity:** Medium  
**File:** `src/components/LoadingSkeleton.tsx` lines 44, 74

### What's wrong
Both skeletons use `bg-white` on the outer container. Insights and Settings pages render on `var(--color-cream)`. On page load: skeleton is white → page mounts cream → visible "warm-up" flash.

### The Fix

**`InsightsSkeleton` line 44:** Change:
```tsx
<div className="flex flex-col h-full bg-white">
```
To:
```tsx
<div className="flex flex-col h-full" style={{ background: "var(--color-cream)" }}>
```

**`SettingsSkeleton` line 74:** Change:
```tsx
<div className="flex flex-col h-full bg-white">
```
To:
```tsx
<div className="flex flex-col h-full" style={{ background: "var(--color-cream)" }}>
```

### Verify
1. Open `/insights` and `/settings` on Slow 3G in DevTools.
2. Hard-refresh each page.
3. **Pass:** No white flash during skeleton → content transition. Background stays consistently warm cream throughout.
4. **Fail signal:** Any brief white flash before content appears.

---

## Finding #3 — Edit + "Mark as Paid" Buttons: Contrast Failure (Critical)

**Severity:** Critical  
**File:** `src/components/calendar/BookingDrawer.tsx` lines 888–893 (Edit footer button) and lines 635–639 (Mark as paid button)

### What's wrong
Both buttons use `background: "var(--wash-amber)"`.  
`--wash-amber` is defined in `globals.css` as `linear-gradient(157deg, #F8DEAE 0%, #E79B22 100%)`.  
The gradient **ends** at `#E79B22`. The text color is `var(--color-amber)` = `#E8920A`.  
At the right edge of every button: amber (`#E8920A`) text on amber (`#E79B22`) background = ~1.05:1 contrast ratio.  
WCAG minimum is 4.5:1. The button text is **invisible** on half its surface area.

### The Fix

**Both locations** — replace `background: "var(--wash-amber)"` with a flat amber tint:

**Footer Edit button (line 888–893):**
```tsx
// Before:
style={{ background: "var(--wash-amber)", color: "var(--color-amber)" }}

// After:
style={{ background: "rgba(232,146,10,0.12)", color: "var(--color-amber)" }}
```

**"Mark as paid →" button (line 635):**
```tsx
// Before:
style={{ background: "var(--wash-amber)", color: "var(--color-amber)" }}

// After:
style={{ background: "rgba(232,146,10,0.12)", color: "var(--color-amber)" }}
```

### Verify
1. Open any booking drawer on `dashboard.bapita.com/calendar`.
2. Scroll to the bottom — check "Edit" button in sticky footer.
3. Open a completed booking with unpaid status — check "Mark as paid →" button in Payment section.
4. **Pass:** Button text "Edit" and "Mark as paid →" is clearly legible across the full width of the button at any viewport size.
5. **Pass:** Run Chrome DevTools Accessibility → check contrast on button text — should report ≥4.5:1.
6. **Fail signal:** Text appears to fade or disappear toward the right edge of the button.

---

## Finding #4 — ActionBtn Ghost State: Near-Invisible Buttons

**Severity:** High  
**File:** `src/components/calendar/BookingDrawer.tsx` lines 57–71 (ActionBtn component)

### What's wrong
Non-primary `ActionBtn` uses `background: ${color}18`.  
Hex `18` = decimal 24 = ~9.4% opacity. For "Reschedule" using `SLATE = #94A3B8`, the background is a faint blue wash barely distinguishable from the cream drawer. Buttons look **disabled**, not active. Users may not tap them.

### The Fix

In the `ActionBtn` component, change the non-primary background AND add a visible border:

```tsx
// Before:
style={{
  background: primary ? color : `${color}18`,
  color: primary ? "#fff" : color,
  minWidth: 0,
}}

// After:
style={{
  background: primary ? color : `${color}22`,
  border: primary ? "none" : `1.5px solid ${color}40`,
  color: primary ? "#fff" : color,
  minWidth: 0,
}}
```

Hex `22` = 13.3% opacity fill. Hex `40` = 25% opacity border. The border gives the button a clear boundary without making it heavy.

### Verify
1. Open a booking in **confirmed** status (has Reschedule / No-show / Cancel row).
2. Open a booking in **completed** status (has Reschedule / Reopen row).
3. **Pass:** All buttons in the action row are clearly distinguishable as interactive elements — visible boundary, readable text.
4. **Pass:** "Reschedule" button (slate color) does not look disabled or greyed-out.
5. **Fail signal:** Any action button is invisible or blends into the cream background.

---

## Finding #5 — History Section: Plain Text Loading State

**Severity:** Medium  
**File:** `src/components/calendar/BookingDrawer.tsx` lines 673–676

### What's wrong
When `prevBooking === "loading"`, the component renders `<p>Loading…</p>` plain text.  
Every other loading state in the app uses animated skeleton components. This inconsistency breaks the pattern and causes layout shift when data arrives (short text → tall card).

### The Fix

Replace the loading branch:

```tsx
// Before:
if (prevBooking === "loading") {
  return (
    <p className="text-[14px] px-1" style={{ color: "var(--color-muted)" }}>
      Loading…
    </p>
  );
}

// After:
if (prevBooking === "loading") {
  return (
    <div
      className="animate-pulse rounded-2xl"
      style={{
        height: 72,
        background: "var(--color-cream-2)",
        border: "1px solid var(--color-cream-2)",
      }}
    />
  );
}
```

### Verify
1. Open a booking for a client who **has** previous bookings (ensures the loading state fires before resolving to a card).
2. Watch the HISTORY section on drawer open — brief skeleton block should pulse, then resolve to the history card.
3. **Pass:** No "Loading…" text appears. A pulsing block the same height as the history card appears briefly.
4. **Pass:** No layout shift when history data arrives — skeleton and card are the same height.
5. **Fail signal:** "Loading…" text is visible or a height jump occurs when history data loads.

---

## Finding #6 — Contact Section: Emoji Icons

**Severity:** Medium  
**File:** `src/components/calendar/BookingDrawer.tsx` lines 515, 540, 558, 572

### What's wrong
`📞` and `✉️` are native emoji used as UI icons. Emoji render differently per OS/browser (Apple vs Android vs Windows). They color-shift in dark mode, scale inconsistently, and have poor vertical alignment with text. In a professional SaaS dashboard this reads as a WhatsApp chatbot, not a booking tool.

### The Fix

Install lucide-react if not already present (likely already installed — check `package.json`):
```bash
# Only if not present:
npm install lucide-react
```

**Replace emoji in `renderContact()`:**

```tsx
// Add import at top of file:
import { Phone, Mail } from "lucide-react";

// Replace emoji in phone row (present data):
// Before: <span className="text-[18px] shrink-0">📞</span>
// After:
<Phone size={16} strokeWidth={2} className="shrink-0" style={{ color: "var(--color-dark)" }} />

// Replace emoji in phone row (no data):
// Before: <span className="text-[18px] shrink-0 opacity-30">📞</span>
// After:
<Phone size={16} strokeWidth={2} className="shrink-0 opacity-30" style={{ color: "var(--color-muted)" }} />

// Replace emoji in email row (present data):
// Before: <span className="text-[18px] shrink-0">✉️</span>
// After:
<Mail size={16} strokeWidth={2} className="shrink-0" style={{ color: "var(--color-dark)" }} />

// Replace emoji in email row (no data):
// Before: <span className="text-[18px] shrink-0 opacity-30">✉️</span>
// After:
<Mail size={16} strokeWidth={2} className="shrink-0 opacity-30" style={{ color: "var(--color-muted)" }} />
```

### Verify
1. Open a booking drawer with a client who has both phone and email.
2. Open a booking drawer with a client who has no phone or email.
3. Check in Chrome on Mac AND in Chrome DevTools mobile emulation (Pixel 5).
4. **Pass:** Phone and email icons are crisp SVG lines, not color emoji. Vertically centered with contact text.
5. **Pass:** Empty state icons appear faded (opacity-30) same as before.
6. **Fail signal:** Emoji visible in any row, or icon misaligned vertically with text.

---

## Finding #7 — Status Badge: Unicode ▾ Dropdown Indicator

**Severity:** Low  
**File:** `src/components/calendar/BookingDrawer.tsx` line 795

### What's wrong
`▾` (U+25BE) is a Unicode geometric shape rendered by font fallback, not by Heebo. On Windows Chrome it sometimes renders as an empty box or near-invisible. Makes the status badge look like a static label — hides the key interaction.

### The Fix

```tsx
// Add to imports:
import { ChevronDown } from "lucide-react";

// Replace the status badge button content:
// Before:
{STATUS_LABEL[current.status]} ▾

// After:
<span className="flex items-center gap-1">
  {STATUS_LABEL[current.status]}
  <ChevronDown size={10} strokeWidth={2.5} />
</span>
```

Also update the button className to include flex alignment:
```tsx
// Before:
className="mt-2 px-3 py-1 rounded-full text-[12px] font-bold"

// After:
className="mt-2 px-3 py-1 rounded-full text-[12px] font-bold inline-flex items-center gap-1"
```

### Verify
1. Open any booking drawer. Check the status badge (e.g., "Completed").
2. **Pass:** A small crisp chevron-down SVG appears to the right of the status text.
3. **Pass:** Chevron is visible at small size — not a filled triangle or empty box.
4. Tap/click the badge — status picker sheet should open.
5. **Fail signal:** ▾ character visible instead of SVG, or chevron invisible.

---

## Finding #8 — Section Headers: `tracking-widest` Too Loose

**Severity:** Low  
**File:** `src/components/calendar/BookingDrawer.tsx` lines 83–87 (Section component)

### What's wrong
`tracking-widest` in Tailwind = `letter-spacing: 0.1em`. On 11px uppercase text that is 1.1px between each character. Headers like "CONTACT" and "PAYMENT" look stretched rather than crisp. Premium SaaS tools use `tracking-wider` (0.05em) — enough to signal "metadata label" without looking oversized.

### The Fix

```tsx
// In the Section component <p> element:

// Before:
className="text-[11px] font-bold uppercase tracking-widest mb-2.5 px-1"

// After:
className="text-[10px] font-bold uppercase tracking-wider mb-2.5 px-1"
```

### Verify
1. Open any booking drawer. Compare section headers: LABEL, CONTACT, PAYMENT, NOTES, HISTORY.
2. **Pass:** Headers read as quiet structural labels — present but not drawing attention away from content.
3. **Pass:** "CONTACT" does not appear overly wide or spaced-out.
4. No visual regression check needed beyond eyeballing.

---

## Finding #9 — Desktop Drawer: No Entry Animation

**Severity:** Medium  
**File:** `src/components/calendar/BookingDrawer.tsx` line 742  
**Also:** `src/app/globals.css`

### What's wrong
On desktop (md breakpoint and up), the 400px right-panel drawer appears instantly — no slide or fade transition. It abruptly replaces the calendar view. Mobile bottom sheet has an implied native animation from the browser, but desktop has none. Every premium calendar tool (Google Calendar, Calendly, Cal.com) animates the detail panel in.

### The Fix

**Step 1 — Add keyframe to `globals.css`:**
```css
@keyframes drawerSlideIn {
  from {
    transform: translateX(16px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

**Step 2 — Apply to drawer div in `BookingDrawer.tsx` line 742:**

Find the main drawer div:
```tsx
<div
  className="fixed bottom-0 inset-x-0 z-50 rounded-t-[24px] max-h-[90vh] flex flex-col md:inset-y-0 md:left-auto md:end-0 md:w-[400px] md:rounded-none md:max-h-none"
  style={{
    background: "var(--color-cream)",
    boxShadow: "0 -8px 40px rgba(30,26,20,0.16)",
  }}
```

Add animation to style:
```tsx
style={{
  background: "var(--color-cream)",
  boxShadow: "0 -8px 40px rgba(30,26,20,0.16)",
  animation: "drawerSlideIn 200ms cubic-bezier(0.16,1,0.3,1) both",
}}
```

### Verify
1. On desktop (browser window >768px wide), click any booking chip on the calendar.
2. **Pass:** Drawer slides in from the right with a smooth ~200ms motion. Subtle translate + fade.
3. **Pass:** Animation does not feel slow or bouncy.
4. **Pass:** Mobile (emulate in DevTools) — bottom sheet appears normally, animation is acceptable or barely noticeable since the translate is small.
5. **Fail signal:** Drawer pops in instantly with no motion on desktop.

---

## Global Systemic Notes

These apply across the whole codebase, not just the calendar. Flag these if touching related files:

| Issue | Where to fix | Rule |
|---|---|---|
| `--wash-amber` as button background | Any button using this token | Never use a gradient that ends at the same hue as the text color. Replace with flat `rgba(232,146,10,0.12)` for tinted fills. |
| `bg-white` in skeleton components | `LoadingSkeleton.tsx` | Each skeleton's outer background must match its page's actual background token. |
| Emoji as UI icons | Any component using `📞 ✉️ 📋` etc | Replace all with `lucide-react` SVG icons — enforce this as a project rule. |
| `▾ ▸ ▴` Unicode as UI indicators | Any dropdown/accordion trigger | Replace with Lucide `ChevronDown / ChevronRight / ChevronUp`. |
| "Loading…" text as loading state | Any component with async sub-sections | Replace with matching-height `animate-pulse` skeleton divs. |

---

## Suggested Batches

| Batch | Findings | Effort | Notes |
|---|---|---|---|
| A — Critical fixes | #3, #4 | ~30 min | Contrast failure + invisible buttons. Fix first. |
| B — Skeleton overhaul | #1, #2, #5 | ~45 min | All loading state fixes in one pass. |
| C — Icon cleanup | #6, #7 | ~20 min | Both use lucide-react — do together. |
| D — Polish | #8, #9 | ~20 min | Low-risk cosmetic. |
| Global Systemic Notes | #8, #9 | ~20 min | Low-risk cosmetic. |
