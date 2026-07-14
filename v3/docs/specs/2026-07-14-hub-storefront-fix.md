# Spec — Hub storefront fix (Phase 1) + mobile fix

- **Date:** 2026-07-14  **Owner:** Rami  **Driver:** docs/2026-07-14-bapita-suite-prd.md §6/§8
- **Goal:** Make bapita.com a sales machine that books a call. Fix known mobile-invisible bug. Elevate to premium/on-spine. Ship live.

## What
1. **Mobile fix:** `reveal.tsx` gates all content visibility on framer `whileInView`; when it doesn't fire (mobile + lenis + IO race) content stays `opacity:0`. Decouple — reveal only adds motion, never gates visibility (IO trigger + mount fallback).
2. **Lineup 6→4:** cut seo/outreach/ads, add reach. Statuses: Book Live(hero), Social Coming next, Bots/Reach Rolling out. Strip Shopify/agency/e-commerce.
3. **Hero:** local wedge eyebrow, 48h-promise subhead, headline+CTA on load, clay physics pointer-events pass-through, persistent header CTA.
4. **Proof/trust:** founder block (placeholder), Book-specific proof, WhatsApp contact, FAQ pricing objection, 2nd/loss-framed CTAs, kill dead black gaps. Premium polish + animations.

## Acceptance
- All content visible on mobile (390px) with no scroll-reveal dead zones.
- Homepage shows 4 falafels, no SEO/Outreach/Ads, no Shopify/agency copy.
- Headline + primary CTA visible on load; header CTA persists on scroll.
- `npm run lint && npm run build` green; deployed to bapita.com.

## Out of scope (this session)
Book page Phase 1b, Social Phase 2, i18n, SSO, billing.
