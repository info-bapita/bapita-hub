# Bapita v3 — Master Homepage + Hub

**Active Next.js app.** bapita.com marketing site + product hub. Neutral-dark premium design. Hebrew/RTL support.

## Stack
- Next.js 16.2.9, React 19.2.4
- @react-three/fiber 9.6.1, @react-three/rapier 2.2.0 — 3D Pita Catch hero animation
- framer-motion 12.42.0, lenis 1.3.25 — scroll motion + smoothing
- Tailwind 4, TypeScript 5
- Deploy: Vercel

## Deploy Gotchas
1. **Vercel "Invalid Version"** — versionless `unrs-resolver` entry in package-lock.json causes build failure. Fix: regenerate lockfile (`npm ci` or `npm install`).
2. **Preview env vars** — deployments crash if Supabase env vars not scoped to Preview. Fix: add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, + service role key to Vercel Preview environment scope.

## Notes
- Design system in globals.css (shared with homepage nav tokens)
- Brand doc: v3/docs/brand/bapita-v3-brand-system.md
- Account: info.bapita@gmail.com


## Next.js 16 note
Breaking changes vs training data — check `node_modules/next/dist/docs/` before writing framework code.

## Design System (tokens live in src/app/globals.css — use them, never hardcode colors)
- **Hub (dark):** bg `--color-ink` #0b0b0c, cards `--color-surface`, text `--color-cream` / `--color-cream-muted`
- **Product worlds (light):** `--color-paper`, clay scale (`--color-clay` → `--color-clay-toast`), text `--color-espresso`
- **Product colors:** book=orange #d4622a, social=emerald, seo=azure, outreach=violet, bots=magenta, analytics=teal — each has a `-glow` variant
- **Radii:** `--radius-sm/md/lg` (8/12/16px), `--radius-pill`; shadows `--shadow-sm/md/lg`
- **Font:** Heebo (`--font-sans`) — chosen for Hebrew support; all UI must work RTL
