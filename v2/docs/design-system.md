# Bapita Design System

**Stack:** Next.js 16 · Tailwind CSS v4 · Heebo font · RTL/Hebrew-first  
**Quality bar:** GlossGenius-level polish, Boulevard-level calendar power — without enterprise complexity.

---

## Colors

All tokens defined in `globals.css` via `@theme inline`. Use CSS vars everywhere, not raw hex.

### Full Token List

| Token | Hex | Tailwind class |
|---|---|---|
| `--color-dark` | `#1E1A14` | `text-dark` / `bg-dark` |
| `--color-dark-footer` | `#16120D` | `bg-dark-footer` |
| `--color-amber` | `#E8920A` | `bg-amber` / `text-amber` |
| `--color-amber-dark` | `#B86800` | hover state for amber buttons |
| `--color-amber-hover` | `#D4830A` | amber button hover (lighter) |
| `--color-cream` | `#FAF5EC` | page background |
| `--color-cream-2` | `#F5EFE3` | dividers, subtle borders |
| `--color-terra` | `#D4622A` | accents, destructive-adjacent warm CTA |
| `--color-muted` | `#6B6052` | secondary text, inactive nav icons |
| `--color-surface` | `#FFFFFF` | cards, top bar, bottom nav bg |
| `--color-background` | `#FAF5EC` | page bg (alias of cream) |
| `--color-foreground` | `#1E1A14` | body text (alias of dark) |

### Usage Rules

**Amber `#E8920A`**  
Primary buttons, today-highlight pill in calendar week strip, confirmed booking status, active nav icon, FAB background.  
Never use as small body text on white — contrast ratio too low. Min usage: 18px bold or larger as text.

**Terra cotta `#D4622A`**  
Secondary CTAs, "danger-adjacent" warm actions (e.g. cancel booking hover), accent in marketing copy.  
Not for status — amber already owns confirmed. Don't mix amber + terra in the same component.

**Cream `#FAF5EC`**  
Page background. The default canvas. Never use pure `#FFFFFF` as a page bg — feels clinical.

**Surface `#FFFFFF`**  
Cards, top bar, bottom nav. Sits on cream background — the slight contrast creates depth without shadows.

**Dark `#1E1A14`**  
Headings, primary body text, active button text on light background. Warm near-black (not neutral gray).

**Muted `#6B6052`**  
Secondary text, placeholder text, inactive nav icons, subtle labels. Warm gray — matches the earthy palette.

**Cream-2 `#F5EFE3`**  
Borders and dividers only. Not for text, not for large fills.

### Status Colors

| Status | Color | Hex | Usage |
|---|---|---|---|
| Pending | Slate | `#94A3B8` | Awaiting confirmation |
| Confirmed | Amber | `#E8920A` | Confirmed appointment |
| Completed | Green | `#22C55E` | Past, completed |
| Cancelled | Red | `#EF4444` | Cancelled by owner or client |
| No-show | Red | `#EF4444` | Same color as cancelled — they're both "lost" |

**Status color application rule:**  
Booking blocks use a **3px left border** in status color + **8% opacity fill** of that color.  
Status badges use a **pill** with the status color at 15% opacity background + status color text.

```
pending block:   border-l-[3px] border-[#94A3B8]  bg-[#94A3B8]/8
confirmed block: border-l-[3px] border-amber       bg-amber/8
completed block: border-l-[3px] border-[#22C55E]   bg-[#22C55E]/8
cancelled block: border-l-[3px] border-[#EF4444]   bg-[#EF4444]/8
```

---

## Typography

Font: **Heebo** (Google Fonts). Supports Hebrew natively. Single family for both scripts.

```css
--font-sans: 'Heebo', system-ui, sans-serif;
```

### Type Scale

| Token | Size (mobile) | Size (desktop) | Weight | Line-height | Use |
|---|---|---|---|---|---|
| H1 | 28px | 36px | 800 | 1.15 | Page titles, hero headlines |
| H2 | 22px | 28px | 700 | 1.2 | Section headers, modal titles |
| H3 | 18px | 22px | 700 | 1.25 | Card headers, subsection titles |
| H4 | 16px | 18px | 600 | 1.3 | List group headers, table heads |
| body-lg | 17px | 17px | 400 | 1.6 | Lead text, key descriptions |
| body | 15px | 16px | 400 | 1.6 | Default body, form copy |
| label | 13px | 13px | 500 | 1.4 | Form labels, nav labels, chips |
| caption | 12px | 12px | 400 | 1.4 | Timestamps, helper text, tooltips |

**Hard rule:** Minimum **15px on mobile** for any readable text. Caption (12px) only for non-essential meta (timestamps, counters).

### Tailwind Utility Shortcuts

```
H1:      text-[28px] md:text-[36px] font-extrabold leading-tight
H2:      text-[22px] md:text-[28px] font-bold leading-snug
H3:      text-[18px] md:text-[22px] font-bold leading-snug
H4:      text-[16px] md:text-[18px] font-semibold leading-normal
body-lg: text-[17px] font-normal leading-relaxed
body:    text-[15px] md:text-[16px] font-normal leading-relaxed
label:   text-[13px] font-medium leading-snug
caption: text-[12px] font-normal leading-snug
```

### Hebrew-Specific Notes

- Hebrew text is 15–20% longer than English equivalent. Design with this budget.
- Heebo ExtraBold (800) holds up well in Hebrew at all sizes.
- Never use `uppercase` CSS — Hebrew has no case. Use only for Latin labels/badges.
- Heebo Hebrew glyphs align naturally with its Latin glyphs at same size — no baseline correction needed.

---

## Spacing

Base unit: **4px**. All spacing is multiples of 4.

| Token | px | Use case |
|---|---|---|
| `space-1` | 4px | Icon gaps, tight inline padding |
| `space-2` | 8px | Internal component padding (badge, chip) |
| `space-3` | 12px | Input padding vertical, list item gap |
| `space-4` | 16px | Card padding, horizontal screen edge padding |
| `space-6` | 24px | Between card sections, form field gap |
| `space-8` | 32px | Between cards in a list, section top margin |
| `space-12` | 48px | Section-level separation on page |
| `space-16` | 64px | Top bar height, bottom nav height |

### When to Use Which

- **4px** — icon-to-label gap, dot indicators, micro-spacing inside a chip
- **8px** — badge/pill internal padding, tight button padding (icon-only)
- **12px** — input field internal vertical padding, row items in a list
- **16px** — card padding (`p-4`), left/right screen margin on mobile, standard button padding
- **24px** — gap between two cards, between a label and its section content
- **32px** — section spacing within a page, between form groups
- **48px** — major page section separation (used sparingly)
- **64px** — fixed heights (top bar, bottom nav) — exact, not approximate

---

## Border Radius

| Element | Radius | Tailwind |
|---|---|---|
| Card | 16px | `rounded-2xl` |
| Button | 12px | `rounded-xl` |
| Input | 10px | `rounded-[10px]` |
| Drawer / bottom sheet | 20px top corners | `rounded-t-[20px]` |
| Modal | 20px | `rounded-[20px]` |
| Badge / pill | 999px | `rounded-full` |
| Nav icon button | 12px | `rounded-xl` |
| Booking block (calendar) | 6px | `rounded-[6px]` |
| Avatar | 999px | `rounded-full` |

**Rule:** Warmer = rounder. Never 0px radius on user-facing interactive elements. Functional tables can use 0px internally.

---

## Shadows

Warm shadows only. No cold `rgba(0,0,0,…)` — use `rgba(30, 26, 20, …)` (dark color, desaturated warm).

| Element | Shadow |
|---|---|
| Card (resting) | `0 1px 2px rgba(30,26,20,0.06), 0 2px 8px rgba(30,26,20,0.05)` |
| Card (hover/focus) | `0 2px 4px rgba(30,26,20,0.08), 0 4px 16px rgba(30,26,20,0.08)` |
| Drawer / bottom sheet | `0 -4px 24px rgba(30,26,20,0.12)` |
| Modal | `0 8px 32px rgba(30,26,20,0.16)` |
| FAB | `0 4px 12px rgba(232,146,10,0.35)` — amber-tinted |
| Top bar | `0 1px 0 var(--color-cream-2)` — border-only, no elevation |
| Bottom nav | `0 -1px 0 var(--color-cream-2)` — border-only |

Tailwind: shadows this specific require inline `style` or `@layer` utilities. Don't fight Tailwind's preset shadow scale for these.

---

## Components

### Card

Visually: white surface, 16px radius, warm shadow, 16px padding. On cream background, creates clear depth.

```tsx
<div className="bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(30,26,20,0.06),0_2px_8px_rgba(30,26,20,0.05)]">
  {children}
</div>
```

Variants:
- **Default**: white bg, resting shadow
- **Interactive** (tappable): add `active:scale-[0.98] transition-transform cursor-pointer`
- **Elevated** (modal-adjacent): hover shadow

Never put a card inside a card. Use dividers (`border-b border-cream-2`) for internal sections instead.

---

### Button

**Primary**  
Amber bg, white text, 12px radius, 14px vertical padding.

```tsx
<button className="bg-amber text-white font-semibold text-[15px] px-5 py-3.5 rounded-xl
  hover:bg-[#D4830A] active:bg-[#B86800] transition-colors">
  Label
</button>
```

**Secondary**  
Dark bg, white text. Same sizing as primary.

```tsx
<button className="bg-dark text-white font-semibold text-[15px] px-5 py-3.5 rounded-xl
  hover:bg-[#2d2820] transition-colors">
  Label
</button>
```

**Ghost**  
Transparent bg, dark text, cream-2 border.

```tsx
<button className="bg-transparent text-dark font-medium text-[15px] px-5 py-3.5 rounded-xl
  border border-[var(--color-cream-2)] hover:bg-cream transition-colors">
  Label
</button>
```

**Danger**  
Red text, transparent bg, red border. Full red bg only for destructive confirmation dialogs.

```tsx
<button className="text-[#EF4444] font-medium text-[15px] px-5 py-3.5 rounded-xl
  border border-[#EF4444]/30 hover:bg-[#EF4444]/8 transition-colors">
  Cancel Booking
</button>
```

**Sizing:**
- Default (mobile): min-height 48px, min-width 120px
- Full-width: add `w-full`
- Icon-only: 44×44px, `rounded-xl`

---

### Input + Label

Label always **above** the input, never floating/inside. 13px label, 500 weight, dark color.

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-[13px] font-medium text-dark">
    Client name
  </label>
  <input
    className="h-12 px-4 rounded-[10px] border border-[var(--color-cream-2)]
      bg-white text-[15px] text-dark placeholder:text-muted
      focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30
      transition-colors"
    placeholder="e.g. Avi Cohen"
  />
</div>
```

States:
- Default: `border-cream-2`
- Focus: `border-amber` + soft amber ring
- Error: `border-[#EF4444]` + red helper text below
- Disabled: `opacity-50 cursor-not-allowed`

Helper/error text: `text-[12px] text-[#EF4444] mt-1`

---

### Status Badge / Pill

```tsx
const statusStyles = {
  pending:   'bg-[#94A3B8]/15 text-[#64748B]',
  confirmed: 'bg-amber/15 text-[#B86800]',
  completed: 'bg-[#22C55E]/15 text-[#16A34A]',
  cancelled: 'bg-[#EF4444]/15 text-[#DC2626]',
  'no-show': 'bg-[#EF4444]/15 text-[#DC2626]',
};

<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${statusStyles[status]}`}>
  {label}
</span>
```

---

### FAB (Floating Action Button)

Primary shortcut for New Booking. Lives above bottom nav.

```tsx
<button
  className="fixed z-20 flex items-center justify-center rounded-full bg-amber text-white
    shadow-[0_4px_12px_rgba(232,146,10,0.35)] active:scale-95 transition-transform"
  style={{ width: 56, height: 56, bottom: 80, insetInlineEnd: 16 }}
  aria-label="New booking"
>
  <PlusIcon size={24} strokeWidth={2.5} />
</button>
```

- Size: 56×56px
- Position: `bottom: 80px` (64px nav + 16px gap), `inset-inline-end: 16px` (RTL-safe)
- On calendar: tapping FAB opens New Booking drawer pre-filled with next available slot
- On other screens: tapping FAB opens New Booking drawer from scratch
- Hide FAB while a drawer/modal is open

---

### Toast

Non-blocking feedback. Slides up from bottom above the nav.

```tsx
// Success
<div className="fixed bottom-20 inset-x-4 z-50 flex items-center gap-3
  bg-dark text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up">
  <CheckIcon className="text-[#22C55E]" size={18} />
  <span className="text-[14px] font-medium">Booking confirmed</span>
</div>

// Error
<div className="... bg-[#EF4444] text-white ...">
  <XIcon size={18} />
  <span>Something went wrong</span>
</div>
```

- Auto-dismiss: 3 seconds
- Success: dark bg with green icon
- Error: red bg
- Width: `inset-x-4` (full-width minus 16px padding each side)
- Position: above bottom nav — `bottom: calc(64px + 16px)` = `bottom-20`

---

### Drawer / Bottom Sheet

Slides up from bottom. Covers 70–92% of screen height depending on content.

```tsx
<>
  {/* Backdrop */}
  <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]" onClick={onClose} />

  {/* Sheet */}
  <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-[20px]
    shadow-[0_-4px_24px_rgba(30,26,20,0.12)] flex flex-col"
    style={{ maxHeight: '92dvh' }}>

    {/* Drag handle */}
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-10 h-1 rounded-full bg-cream-2" />
    </div>

    {/* Title */}
    <div className="px-4 pb-3 border-b border-cream-2">
      <h2 className="text-[18px] font-bold text-dark">New Booking</h2>
    </div>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {children}
    </div>
  </div>
</>
```

- Use `dvh` (dynamic viewport height) not `vh` to avoid mobile browser chrome issues
- Always include drag handle for discoverability
- Scrollable content area — title stays fixed

---

### Loading Skeleton

Matches shape of the content it replaces. Warm shimmer animation.

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-cream-2) 25%,
    var(--color-cream) 50%,
    var(--color-cream-2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 8px;
}
```

Example — booking card skeleton:
```tsx
<div className="bg-white rounded-2xl p-4 space-y-3">
  <div className="skeleton h-4 w-32" />
  <div className="skeleton h-3 w-24" />
  <div className="skeleton h-3 w-16" />
</div>
```

---

## Mobile Navigation

### Bottom Nav — Final Structure

**4 tabs: Calendar · Clients · Insights · Financials**

Removed from tabs:
- **New Booking** → FAB (Floating Action Button — amber `+` circle fixed bottom-right, above bottom nav) + tap any empty time slot on calendar
- **Settings / Add-ons / Profile** → hamburger drawer (☰ top-left)

```
┌──────────────────────────────────────────────────┐
│  📅 Calendar  👥 Clients  📊 Insights  💰 Financials  │
└──────────────────────────────────────────────────┘
```

Specs:
- Height: 64px
- Background: `#FFFFFF`
- Border-top: `1px solid var(--color-cream-2)`
- Safe area: add `padding-bottom: env(safe-area-inset-bottom)` for iPhone notch
- Icon: 24×24px, stroke-only (not filled), `strokeWidth={1.5}`
- Label: 10px, font-medium, Heebo
- Active: amber icon + amber label
- Inactive: `color: var(--color-muted)` — `#6B6052`
- Active indicator: color change only, no background pill

```tsx
const bottomNavItems = [
  { path: '/calendar',   icon: CalendarIcon,  label: 'Calendar',   labelHe: 'יומן' },
  { path: '/clients',    icon: UsersIcon,     label: 'Clients',    labelHe: 'לקוחות' },
  { path: '/insights',   icon: BarChartIcon,  label: 'Insights',   labelHe: 'נתונים' },
  { path: '/financials', icon: CreditCardIcon, label: 'Financials', labelHe: 'כספים' },
];
```

---

### FAB — Floating Action Button

The amber `+` circle fixed above the bottom nav. Primary shortcut for new booking.

```
Position: fixed, bottom-right
Size: 56×56px
Color: bg-amber (#E8920A), text-white
Shadow: 0 4px 16px rgba(232,146,10,0.35)
z-index: above content, below drawers/modals
Icon: Plus, 24px, strokeWidth={2}
```

- On calendar: opens new booking drawer pre-filled with next available slot
- On all other screens: opens new booking drawer from scratch
- Hide while any drawer or modal is open

```tsx
<button
  className="fixed bottom-[calc(64px+16px)] end-4 z-40 w-14 h-14 rounded-full
    bg-amber text-white flex items-center justify-center
    shadow-[0_4px_16px_rgba(232,146,10,0.35)] active:scale-95 transition-transform"
  onClick={openNewBooking}
>
  <PlusIcon size={24} strokeWidth={2} />
</button>
```

---

### Hamburger Drawer (☰)

Full-height slide-in panel from the left. Opens from ☰ in the top bar on all screens.

```
┌─────────────────────────────┐
│  [Logo]  Business Name      │
│  business-slug.bapita.com   │
├─────────────────────────────┤
│  ⚙️  Settings               │
│  📦  Add-ons                │
│  📊  Usage                  │
├─────────────────────────────┤
│  👤  Profile                │
├─────────────────────────────┤
│  🚪  Sign out               │
└─────────────────────────────┘
```

**Drawer items:**
- **Settings** → `/settings` — Business info, services, business hours
- **Add-ons** → `/addons` — Enable/disable add-ons (WhatsApp, Stripe, etc.), "Contact us" CTA per add-on
- **Usage** → `/usage` — Per-add-on stats: messages sent, payments processed, etc. Read-only.
- **Profile** → `/profile` — Password change, email
- **Sign out** — Supabase `signOut()`, redirects to login

Specs:
- Width: `min(320px, 85vw)`
- Background: `#FFFFFF`
- Shadow: `4px 0 24px rgba(30,26,20,0.12)`
- Overlay: `bg-dark/40` behind drawer, tap to close
- Animation: slide in from left, 250ms ease-out
- Business name: H3, `font-bold`, dark
- Slug: caption, `text-muted`
- Nav items: 48px tap target, 16px padding, body size text
- Active item: amber left border `border-s-[3px] border-amber bg-amber/5`
- Dividers: `1px solid var(--color-cream-2)`

---

### Top Bar — General Pages

All pages use a standard top bar:
- Height: 64px
- Left: `☰` hamburger → opens drawer
- Center: **"bapita"** wordmark, `font-black`, `text-dark`
- Right: empty spacer for balance (or context action if needed per page)

```tsx
<div className="fixed top-0 inset-x-0 h-16 flex items-center px-4 z-10 bg-white
  border-b border-[var(--color-cream-2)]">
  <button className="p-2 -ms-2" onClick={openDrawer}>
    <MenuIcon size={24} />
  </button>
  <div className="flex-1 text-center font-black text-[18px] tracking-tight text-dark">
    bapita
  </div>
  <div className="w-10" />
</div>
```

---

### Calendar Top Bar — Detailed Spec

Calendar page overrides the standard top bar:

```
┌────────────────────────────────────────────┐
│  ☰     │    June 2026  ▾    │         ⋮   │
└────────────────────────────────────────────┘
```

- **Left** `☰` — same hamburger, opens same drawer
- **Center** `"Month Year ▾"` — taps to open date picker (month/year only — day picked from week strip)
  - Format: `"June 2026"` (Hebrew: `"יוני 2026"`)
  - `▾` caret: `text-muted`, 16px
  - Entire center tappable, min 44px height
- **Right** `⋮` — opens action sheet:
  - View toggle: Day / Week / Month (current highlighted amber)
  - Filter: All · Pending · Confirmed · Completed
  - Link: Calendar settings

```tsx
<div className="fixed top-0 inset-x-0 h-16 flex items-center px-4 z-10 bg-white
  border-b border-[var(--color-cream-2)]">
  <button className="p-2 -ms-2" onClick={openDrawer}>
    <MenuIcon size={24} />
  </button>
  <button className="flex-1 flex items-center justify-center gap-1.5 py-2"
    onClick={openDatePicker}>
    <span className="font-bold text-[16px] text-dark">{monthYear}</span>
    <ChevronDownIcon size={14} className="text-muted" />
  </button>
  <button className="p-2 -me-2" onClick={openViewMenu}>
    <MoreVerticalIcon size={24} />
  </button>
</div>
```

---

### Availability Blocking (Airbnb-style)

Barber can block off time on the calendar — marks slots as unavailable without a booking.

**How to trigger:**
- Long-press (500ms) on any empty time slot → opens "Block time" bottom sheet
- OR: `⋮` menu in calendar top bar → "Block time" option

**Block time sheet:**
- Title: "Block time" / "חסום זמן"
- Fields: Date (pre-filled), Start time, End time, Label (optional: "Lunch", "Personal", "Break")
- Confirm button: amber, "Block" / "חסום"
- Cancel: ghost button

**Visual treatment on calendar:**
- Blocked slots: diagonal stripe pattern, `bg-[--color-cream-2]`, no left border
- Label shown if provided (same small text as booking blocks)
- Tap blocked slot → shows sheet with option to remove block
- Blocked slots are NOT clickable for new bookings

**Data:** Stored as `blocked_times` table in Supabase (business_id, start_at, end_at, label).

---

## Calendar Patterns

### Week Strip (below top bar)

Persistent header row showing current week days. Tapping a day scrolls to that day in the time grid (or switches to day view).

```
Sun  Mon  Tue  Wed  Thu  Fri  Sat
 4    5   [6]   7    8    9   10
```

- Height: **56px** total
- Day name: 11px, `font-medium`, `text-muted` — short form ("Sun"/"א'")
- Day number: 17px, `font-semibold`, `text-dark`
- Today: amber pill behind the day number — `bg-amber text-white`, 32×32px, `rounded-full`
- Selected (non-today): dark pill — `bg-dark text-white`, 32×32px, `rounded-full`
- Column width: `1fr` per day in week view; full-width in day view
- Sticky: position fixed or sticky below top bar

---

### Time Grid

The scrollable area below the week strip.

- **Pixels per hour: 64px** — enough to see 2-line booking labels, not too tall
- Time labels: left column, 40px wide, `text-[11px] text-muted`, right-aligned, top-aligned to the hour line
- Grid lines:
  - Hour lines: `1px solid rgba(30,26,20,0.07)` — visible but not loud
  - Half-hour lines: `1px solid rgba(30,26,20,0.03)` — barely visible, visual rhythm only
  - No quarter-hour lines
- Current time indicator: `2px solid var(--color-amber)` horizontal line + amber dot on left edge
- Background: `var(--color-cream)` — not white, matches page

**Auto-scroll on load:** Scroll to `businessOpenHour × 64px` on mount (e.g., 9:00 AM → scroll to 576px). Never start at midnight (0px).

```tsx
useEffect(() => {
  const OPEN_HOUR = 9; // from business settings
  gridRef.current?.scrollTo({ top: OPEN_HOUR * 64 - 32, behavior: 'instant' });
}, []);
```

---

### Booking Block

```
┌──────────────────────────────┐
│ Avi Cohen                    │
│ Haircut · 45 min             │
└──────────────────────────────┘
```

Height calculation:
```ts
const blockHeight = (durationMinutes / 60) * 64; // px per hour
const minHeight = 28; // never smaller — shows at least 1 line
```

Styles:
```tsx
<div
  className="absolute inset-x-1 rounded-[6px] px-2 py-1 overflow-hidden cursor-pointer
    border-s-[3px] transition-opacity hover:opacity-90 active:opacity-70"
  style={{
    top: (startMinutes / 60) * 64,
    height: Math.max((durationMinutes / 60) * 64, 28),
    borderColor: STATUS_COLOR[status],
    backgroundColor: `${STATUS_COLOR[status]}14`, // ~8% opacity
  }}
>
  <p className="text-[12px] font-semibold text-dark truncate leading-tight">{clientName}</p>
  {blockHeight > 40 && (
    <p className="text-[11px] text-muted truncate leading-tight">{service}</p>
  )}
</div>
```

- `border-s-[3px]` — RTL-safe (renders left in LTR, right in RTL)
- Only show service name if block is tall enough (> 40px)
- Blocks in week view: narrower, may only show first initial + service icon

---

### Day View vs Week View

| Property | Day View | Week View |
|---|---|---|
| Columns | 1 (full width) | 7 (equal `1fr`) |
| Time label column | 40px | 40px |
| Block padding | `px-2 py-1.5` | `px-1 py-0.5` |
| Client name | Full name | First name + last initial |
| Service | Always shown if space | Omit if block < 48px |
| Today highlight | Entire column bg: `amber/4` | Only day header pill |

Week view minimum block width: enough to see 1 truncated character. Stack overlapping bookings side-by-side within the column.

---

## RTL / Hebrew

### Global Setup

```html
<html lang="he" dir="rtl">
```

When supporting both locales, toggle `dir` on `<html>` based on user preference. Do not rely on CSS `direction` property alone — some third-party components break without the HTML attribute.

### Layout Rules

Use **logical properties** throughout — they flip automatically with `dir`:

| Avoid | Use instead |
|---|---|
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `left-*` / `right-*` | `inset-inline-start-*` / `inset-inline-end-*` |
| `border-l-*` | `border-s-*` |
| `rounded-l-*` | `rounded-s-*` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |

### Directional Icons

Chevrons, arrows, and any "pointing" icon must flip in RTL:

```tsx
// ChevronRight in LTR = ChevronLeft in RTL
<ChevronRightIcon className="rtl:rotate-180" />

// Or use logical approach
<ChevronRightIcon className="ltr:block rtl:hidden" />
<ChevronLeftIcon className="ltr:hidden rtl:block" />
```

### Calendar RTL

In Hebrew locale, days of week display **right-to-left** (Sunday on the right side of the strip). This is a **data-level** change — reverse the `days` array when `dir === 'rtl'`, not a CSS flip.

Status badge border: `border-s-[3px]` renders on the **right side** in RTL (correct — it's the visually "leading" edge of the block).

### Known Tailwind v4 RTL Gotchas

- `ms-*` and `me-*` utilities require `dir` attribute on a parent element — not just `class="rtl:..."`. Always set on `<html>`.
- Tailwind v4 logical property utilities generate both `margin-inline-start` and the `-webkit-` prefix. No extra config needed.
- Avoid `space-x-*` — it uses `margin-left` internally. Use `gap-*` in flex/grid instead.
- `divide-x-*` has the same issue — use `border-s` on individual children.
- `inset-inline-start/end` not yet a Tailwind utility as of v4 — use `style={{ insetInlineStart: 16 }}` or `@layer utilities`.
- Sticky positioned elements with `left-0` will not flip to right in RTL. Use `inset-inline-start-0` via inline style.

### Text Alignment

- Body text in Hebrew: `text-start` (renders as right-aligned in RTL)
- Form labels: `text-start`
- Centered UI (top bar title, empty states, loading): `text-center` — stays centered in both directions
- Navigation labels: `text-center` — centered under icon, fine for both
- Tables: `text-start` for data cells

---

## Design Principles Summary

1. **Warm, not sterile** — cream backgrounds, amber accents, rounded corners everywhere
2. **Mobile-first, thumb-friendly** — 44px min tap targets, bottom-of-screen actions
3. **Single owner, single location** — no multi-staff views, no enterprise complexity
4. **Glance-able calendar** — scroll to business hours, color-coded blocks, status visible at a glance
5. **RTL-native** — Hebrew is the primary experience; English is documentation
6. **"You never touch it"** — UI should feel effortless; no settings user doesn't understand
