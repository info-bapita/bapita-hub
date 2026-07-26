# Bapita — Multi-Product SaaS Platform

**Workspace root.** Contains v1/ (historical prototypes), v2/ (booking-era docs), v3/ (active Next.js app), shared/ (assets), competitor-profiles/, + index.html landing.

## Active Work
- **v3/** — Master hub homepage + product suite (bapita.com). Next.js 16.2.9 with framer-motion + lenis; the hero is a scroll-driven DOM/CSS scene (falafels dropping into the pita), not react-three-fiber.
  - **Deploy: Vercel project `bapita-hub`** (Root Directory `v3`) — this is what serves bapita.com. The project named `v3` is a scratch project on `v3-eta-pied.vercel.app`; deploying there does NOT touch the live site.
  - No GitHub→Vercel integration exists, so `git push` alone never deploys. Run `vercel --prod` from the repo root (`~/Desktop/bapita/hub`) with the root linked to `bapita-hub`.
- **Marketing context** — `.agents/product-marketing.md` (v3 positioning, updated July 2026)
- **Brand canon** — v2/docs/brand/bapita-brand-doc.md (booking-platform era). v3 has new brand system at v3/docs/brand/bapita-v3-brand-system.md.

## Key Facts
- Account: info.bapita@gmail.com
- GitHub master: info-bapita/bapita-hub (this workspace)
- Use the **info-bapita** GitHub + Vercel accounts, never ramikan. Machine defaults to `ramikan96-collab` for `gh`; check `gh auth status` and `vercel whoami` before any push or deploy.
- Stack: Next.js, Vercel, Supabase (region: Sydney, pending migration)
- Hebrew/RTL required
- Solo founder (Rami)

## Repos Status
- **Book Dashboard** (`bapita-dashboard`): Next.js 16.2.7, Supabase backend. GitHub: ramikan96-collab/bapita-dashboard. Deploy: Vercel `bapita-dashboard` project.
- **Social** (`social-ops-platform`): IG/FB post scheduler. Next.js 16.2.9, Groq + Supabase. Deploy: Vercel `social-ops-platform`.
- Legacy repos `DostiAziz/bapita-dashboard` + `ramikan96-collab/dashboard` — marked for migration to info-bapita org.

