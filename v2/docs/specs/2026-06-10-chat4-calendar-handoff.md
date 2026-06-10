# Chat 4 — Calendar Rebuild · HANDOFF (COMPLETE ✅)

**Date:** 2026-06-10
**Repo:** `~/Desktop/bapita-dashboard`
**Branch:** `main`
**Status:** DONE. Build green, pushed live to dashboard.bapita.com (`323a145` calendar, `152fa95` empty-state polish).

## Completed in resume session (everything in TODO below shipped)
- No-business empty state redesigned (`calendar/page.tsx`) — premium welcome card: amber icon tile, "Welcome to Bapita", 3-step onboarding checklist (Business info / Services / Hours), amber CTA → /settings. (Was a bare emoji + link; gated screen new owners see before adding a business.)
- `WeekView.tsx` rewritten — sticky 56px strip (amber today / dark selected pill), shared 64px/hr grid, autoscroll to open hour, lane-packed blocks (firstName only, service if tall), tap-day→day-view, swipe ±week, now-line on today column.
- `calendar/page.tsx` rewired — default `week`, **service embed alias fixed** (`duration:duration_minutes, price:price_nis`), `blocked_times` fetch for visible range, BlockDraft state + onCreateAt/onLongPressAt/onBlockClick handlers, `openHourFor`, new props to all 3 views, refetch blocked on sheet save.
- `new-booking/page.tsx` — service + slot-query aliases fixed, reads `?date=&time=` → prefills selectedDate/selectedTime (starts at client step), wrapped in `<Suspense>` (Next 16 useSearchParams req).
- `MonthView.tsx` — swipe ±month, count chips +N, bigger tap targets.
- `BookingDrawer.tsx` — cream-2 handle, rounded-t-[20px], warm shadow.
- Build passes; `/new-booking` + `/calendar` prerender clean; no stale `initials` imports.

### Known follow-ups (not blockers)
- Tap-to-book launches `/new-booking` prefilled but completes in the 4-step flow, not inline. Full inline redesign = **Chat 6 (New Booking Flow)**.
- FAB opens `/new-booking` from scratch (not "next available slot" prefill) — lives in AppShell from Chat 3.
- Touch gestures (tap/long-press/swipe/autoscroll) verified by build only — confirm on a real phone.

---

## Original handoff (for reference — all items below now done)

**Status was:** ~55% done. Build was broken (DayView rewritten with new props that page.tsx did not yet pass; WeekView still old).

---

## Critical bug found (must keep fixed)

`services` table real columns are `duration_minutes` + `price_nis`, NOT `duration`/`price`.
Calendar query `service:services(name, duration, price)` returns PostgREST 400 → **calendar renders nothing**.
**Fix:** alias in the embed: `service:services(name, duration:duration_minutes, price:price_nis)`.
Same aliasing needed in `new-booking/page.tsx` service fetch (`select id, name, duration:duration_minutes, price:price_nis, active, display_order, business_id`).

---

## DONE

1. **Migration applied to live DB** (project `ixihybsstplqavbpbrlo`): created `blocked_times` table
   `(id, business_id, block_date date, start_time time, end_time time, label text, created_at)` + RLS owner policy + index.
   Chose date+time cols (not start_at/end_at timestamptz) to match `bookings` convention and dodge tz bugs.
2. **`src/types/index.ts`** — added `BlockedTime` interface.
3. **`src/components/calendar/grid.ts`** (NEW) — shared geometry + helpers:
   `PX_PER_HOUR=64`, full 24h grid (`TOTAL_H`), `timeToMins/minsToTime/snap/formatRange/firstName/initials`,
   `openHourFor(business,date?)` (autoscroll target), `packLanes()` (overlap side-by-side),
   `useGridGestures(onTap,onLongPress)` (tap=book, 500ms hold=block), `useSwipe(onLeft,onRight)`.
4. **`src/components/calendar/BlockTimeSheet.tsx`** (NEW) — bottom sheet, create + remove modes, writes `blocked_times`, calls `onSaved()` to refetch.
5. **`src/components/calendar/DayView.tsx`** (REWRITTEN) — shared grid, 24h, autoscroll to openHour, hour+half-hour lines, blocked blocks (diagonal stripes), booking blocks w/ lane packing, current-time amber line, tap-empty→book, long-press→block, swipe→prev/next day.
   New props: `{date, bookings, blocked, openHour, onSelectBooking, onCreateAt(date,mins), onLongPressAt(date,mins), onBlockClick(b), onPrev, onNext}`.

---

## TODO (in order)

1. **`WeekView.tsx`** (REWRITE — was mid-write when stopped). Needs:
   - Sticky 56px week strip: 44px left spacer (aligns w/ time-label col) + 7 `flex-1` cells. Day name (11px muted) + number pill. Today=amber pill, selected-non-today=dark pill. **Tap cell → onSelectDay(day)** (switches to day view).
   - Shared scroll container below strip: 44px time labels + 7 day columns, same grid as DayView (import from `./grid`).
   - Per-day: filter bookings + blocked by `format(day,'yyyy-MM-dd')`, `packLanes` per column, gestures bound to that day's Date. Booking block: `firstName()` only, omit service if block <48px. Now-line on today's column.
   - Autoscroll to `openHour*64-32`. Swipe → prev/next **week** (±7 days).
   - Props mirror DayView + `onSelectDay(d)`.

2. **`calendar/page.tsx`** (REWIRE):
   - Fix service embed alias (see Critical bug above).
   - **Default view `week`** (currently `"day"`) — Chat 4 wants week as home.
   - Fetch `blocked_times` for the visible range (same date filters as bookings, col `block_date`); add to realtime OR just refetch after BlockTimeSheet `onSaved`.
   - State for BlockTimeSheet draft (`BlockDraft | null`).
   - Handlers: `onCreateAt(date,mins)` → `router.push(\`/new-booking?date=${yyyy-MM-dd}&time=${HH:MM}\`)`; `onLongPressAt(date,mins)` → open BlockTimeSheet create draft (default end = start+60); `onBlockClick(b)` → open BlockTimeSheet existing draft.
   - Compute `openHour` via `openHourFor(business, view==='day'?date:undefined)`.
   - Pass new props to Day/Week views. Keep existing today-summary strip + BookingDrawer.

3. **`new-booking/page.tsx`**:
   - Fix service fetch column alias (Critical bug).
   - Read `useSearchParams()` `date` + `time`; prefill `selectedDate`/`selectedTime`; if both present, deep-link to `datetime`/`confirm` step. Wrap in `<Suspense>` (Next 16 requirement for useSearchParams).

4. **`MonthView.tsx`** — polish: bigger tap targets, count chips/dots per day, tap→day view (mostly OK already, light touch).

5. **`BookingDrawer.tsx`** — minor token polish: handle color `var(--color-cream-2)` not `#E5E7EB`, drawer radius `rounded-t-[20px]`, warm shadow. Logic fine.

6. **Verify:** `npm run build` must pass. Check nothing imports removed `initials` export from DayView (old file had `export {initials}`; BookingDrawer has its own local copy — should be fine, grep to confirm).

7. **Commit + push** (only after build green):
   ```
   cd ~/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: calendar — premium week/day/month views with tap-to-book" && git push
   ```
   Then verify live at https://dashboard.bapita.com.

---

## Notes / decisions
- Grid renders full 24h (1536px) so any-time blocks render; autoscroll hides dead pre-dawn hours (Google-Calendar-style). Spec formula `openHour*64` assumes midnight origin — matches.
- Status block = 3px left border (`border-s-`, RTL-safe) + status color at 8% fill (`${color}14`). `STATUS_BG` in types is 15% — use for badges, not blocks.
- blocked_times has no realtime subscription; refetch on sheet `onSaved` is enough.
- Resume point: pick up at "Rewrite WeekView" then page.tsx rewire.
