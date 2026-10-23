# HiFone — code fixes applied

Patched source tree (frontend). Rebuild + redeploy required for changes to go live:
`cd frontend && npm ci && npm run build` (build runs react-snap + fix-duplicate-titles + prerender-seo).
No full rebuild was run here (no network/node_modules in this environment) — source + configs are patched.

## Fixed
1. **Canonical / og:url host** — default site URL now `https://www.hifone.com.au` (was non-www, mismatched the serving host).
   Files: `src/components/SEO.jsx`, `scripts/prerender-seo.mjs`. Added apex→www 301 in `vercel.json`.
2. **`<meta name="keywords">` removed** from `SEO.jsx` (ignored by Google, flagged as spammy). Keywords prop dropped on the homepage.
3. **Geo coordinates aligned** — meta + schema now `-34.9456, 138.5722` (matched to the Google Business map pin; was `-34.9530, 138.5660`). Homepage map fallback now uses the real HiFone place ID instead of a generic "Kurralta Park" pin. `SEO.jsx`, `HomePage.jsx`, `index.html`.
4. **FAQ answers now in the HTML** — Radix accordion unmounted collapsed answers, so crawlers/AI saw none. Added `forceMount` + closed-hidden CSS so answer text stays in the DOM. `FAQ.jsx`, `ui/accordion.jsx`.
5. **FAQ schema == visible answers** — single source `src/data/faqs.js` now feeds both the visible accordion and the FAQPage JSON-LD (Google requires them to match). `FAQ.jsx`, `SEO.jsx`, `HomePage.jsx`.
6. **Structured data guaranteed** — static LocalBusiness + AggregateRating JSON-LD added to `index.html` so it is in the raw HTML of every route regardless of the prerender pipeline (belt-and-suspenders; Helmet still adds page-specific schema). Meaningful `<noscript>` content added (name, services, phone, address, link).
7. **Rating made honest & consistent** — 5.0/150 → **4.9 / 708** everywhere (schema + Hero + Testimonials + About + Dynamic SEO pages), matching the real Google profile.
8. **"Certified Techs / 5+ years"** → "Experienced Techs / Thousands of repairs"; "Certified Technicians" → "Experienced Technicians" (unsubstantiated claims removed). `Hero.jsx`, `DynamicSEOPage.jsx`.
9. **Wikimedia hot-linked brand logos removed** — replaced 12 `upload.wikimedia.org` images with a self-hosted text wordmark strip (removes the fragile hotlink AND the trademark-image concern). `ServicesGrid.jsx`.
10. **Brand marquee** — duplicate loop set now `aria-hidden` so the brand list isn't double-counted by AT/crawlers. `ServicesGrid.jsx`.
11. **"Drone" removed from phone brands** — `NON_BRANDS` filter ({Drone, Other, Others, Generic}) on the brand chips. `ServicesGrid.jsx`.
12. **Stock photo in mail-in section** → local store photo `/store/shop_kiosk_main.jpg` (honours "our work, not stock photos"). `WhyChooseUs.jsx`.
13. **Blog dates** — homepage placeholder posts were all "today"; now staggered (12 Aug / 28 Aug / 9 Sep 2026). `HomePage.jsx`.
14. **Warranty standardised to "6-month"** everywhere (was "3–6 month" in some places, "6 months" in schema). `Hero.jsx`, `Navbar.jsx`, `FAQ` data, `MailInPage.jsx`, `AboutPage.jsx`, `HomePage.jsx`.

## ⚠️ Needs YOUR decision / input before go-live
- **A. Testimonials are still placeholders.** `Testimonials.jsx` is flagged loudly (`REVIEWS_VERIFIED = false`). The 6 quotes are invented — publishing them breaches Australian Consumer Law + Google policy. Replace each with a REAL Google review (name verbatim, text verbatim, actual stars). I can't fetch these — no access to your Google profile.
- **B. Confirm the warranty period.** I standardised to "6-month". If different parts/repairs carry different cover (e.g. 3 months on some), tell me and I'll word it precisely (e.g. "up to 6 months").
- **C. Confirm exact lat/long.** I used the map pin's coords (`-34.9456, 138.5722`). Please verify against your Google Business Profile and I'll adjust the one constant if needed.

## Not changed (flagged)
- Category tile images + device/brand thumbnails still use Unsplash (no local replacements available). Lower priority than the mail-in image, but worth swapping for real store/device photos later.
- The apex→www redirect is also usually set at the Vercel domain level — check that www is the Primary Domain in Vercel too.
