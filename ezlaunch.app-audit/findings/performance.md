# Performance / Core Web Vitals Audit — ezlaunch.app

**Pages audited:** `https://ezlaunch.app/` (homepage), `https://ezlaunch.app/blog/deploying-ai-built-sites`
**Date:** 2026-09-13

## Data availability

- **PageSpeed Insights API: UNAVAILABLE.** All three calls (home/mobile, home/desktop, blog/mobile) returned HTTP 429 `RESOURCE_EXHAUSTED` — `quota_limit_value: "0"`, daily anonymous-key quota for `pagespeedonline.googleapis.com` already exhausted. No Lighthouse lab data (LCP/CLS/TBT/Speed Index/audit details) and no CrUX field data (`loadingExperience`) could be retrieved.
- **This score and all findings below are derived entirely from response-header and static-asset evidence** (curl + source inspection), not from a Lighthouse run or CrUX percentiles. Treat the score as a directional estimate, not a measured Lighthouse score. Re-run PSI once quota resets (resets daily) or with an API key for a metrics-backed score.

## Score (evidence-based estimate, 0–100)

| Page | Estimated score | Rating |
|---|---|---|
| Homepage (`/`) | **~58** | Needs Improvement |
| Blog post (`/blog/deploying-ai-built-sites`) | **~38** | Poor |

Homepage is held back mainly by zero HTTP compression and a fully render-blocking, unminified-scale stylesheet with an abandoned critical-CSS optimization. The blog post inherits all of that plus a 2.64 MB uncompressed PNG rendered directly above the fold, which is almost certainly its LCP element — pushing it into "Poor" territory on mobile.

## Metrics table

No lab (Lighthouse) or field (CrUX) LCP/INP/CLS values are available — see above. Structural proxies gathered instead:

| Signal | Homepage | Blog post | Good threshold |
|---|---|---|---|
| HTTP protocol | HTTP/2 (h3 advertised via `alt-svc`, not used) | HTTP/2 | HTTP/2+ |
| HTML `content-encoding` | none (br/gzip both absent) | none | br or gzip |
| CSS `content-encoding` | none (123,506 B raw = transferred) | same (shared file) | br or gzip |
| JS `content-encoding` | none | none | br or gzip |
| Render-blocking CSS in `<head>` | `css/fonts.css` (1,195 B) + `css/styles.css` (123,506 B), both blocking | same | inline/minimal critical CSS |
| Unused critical-CSS asset | `css/critical-index.css` (33,038 B) exists, **not referenced anywhere** | `css/critical-sub.css` (14,544 B) exists, **not referenced anywhere** | n/a |
| Font preload | 2 fonts preloaded w/ `crossorigin` (dm-sans 36,980 B, urbanist 27,812 B) | same | preload above-fold fonts |
| `font-display` | `swap` on all 3 `@font-face` rules | same | `swap`/`optional` |
| Images have explicit width/height | Yes, all 37 `<img>` tags | Yes | prevents CLS |
| Likely LCP resource | Hero text/SVG logos only (no large in-page raster image) | `assets/blog/deploying-ai-built-sites.png`, 1672×941, **2,772,403 B**, rendered directly under H1, no lazy-load (correct) but no `fetchpriority="high"`, no modern format | small, optimized, preloaded |
| Oversized non-LCP image | `assets/og-image.png` 1,511,969 B (only in `og:image`/`twitter:image` meta — not fetched by visiting browsers, but slows social-share unfurls) | — | <300 KB for OG images |
| Third-party scripts | Meta Pixel — loaded twice (see Findings) | Meta Pixel (single load in source) | minimize/defer |
| Cache-Control: HTML | `no-cache` | `no-cache` | short max-age or revalidate |
| Cache-Control: CSS/JS | `public, max-age=86400, stale-while-revalidate=3600`, filenames **not hashed** | same | long max-age + content hash |
| Cache-Control: fonts | `public, max-age=31536000, immutable` | same | immutable, long TTL |
| Cache-Control: images | `public, max-age=2592000, stale-while-revalidate=86400` | same | long TTL |
| Approx. homepage weight (in-page assets only, uncompressed) | ~373 KB (50.8 KB HTML + 322 KB CSS/JS/SVGs); og-image excluded (not page-loaded) | — | — |
| Approx. requests (homepage) | ~30–34 (28 local refs + Facebook pixel script + tracking pixel + favicons) | similar + hero image | fewer is better |

## Findings

### 1. [HIGH] Zero HTTP compression on all text assets
**Evidence:** `curl -H "Accept-Encoding: gzip"` and `-H "Accept-Encoding: br"` against `/`, `/css/styles.css`, `/js/main.js` all returned no `content-encoding` header and identical `content-length` (123,506 B for styles.css) regardless of the requested encoding. Same on the blog HTML.
**Impact:** CSS/JS/HTML are typically 70–85% smaller with brotli/gzip. `styles.css` at 123,506 B is likely serving what should be ~18–25 KB; `main.js` (9,349 B), `hero-preview.js` (6,963 B), and every HTML document pay the same uncompressed tax. This directly inflates TTFB-to-render time and LCP/render-delay on every page, on every visit, for every visitor — the single highest-leverage fix available.
**Fix:** Enable brotli (preferred) or gzip compression at the edge/origin (Caddy `encode` directive, or CDN-level compression if fronted by one) for `text/html`, `text/css`, `application/javascript`, `image/svg+xml`, `application/json`.

### 2. [HIGH] Full stylesheet is render-blocking; a critical-CSS build exists but was never wired in
**Evidence:** `index.html`, `blog/deploying-ai-built-sites.html`, and `blog/html-websites-are-the-future.html` all `<link rel="stylesheet">` the entire 123,506 B `css/styles.css` in `<head>` with no inlining, no `media` trick, no `preload`+swap pattern. Meanwhile `css/critical-index.css` (33,038 B) and `css/critical-sub.css` (14,544 B) sit in the repo, clearly built as above-the-fold extracts (they duplicate the `@font-face` block plus presumably hero/nav styles), but a project-wide grep for `critical-index`/`critical-sub` returns zero references in any `.html` or `.js` file — they are dead code, not deployed.
**Impact:** First paint / LCP on every page waits on parsing the full 123 KB stylesheet before any content renders, when an already-built critical-path CSS subset could cut that blocking payload by roughly 75%.
**Fix:** Inline `critical-index.css` (home) / `critical-sub.css` (blog/sub-pages) as a `<style>` block in `<head>`, then load `styles.css` non-blocking (`<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback, or a small deferred loader). Combined with fix #1, this addresses both the render-blocking and compression problems for the same file.

### 3. [HIGH — blog page only] Blog hero image is a 2.64 MB uncompressed PNG rendered above the fold (likely LCP element)
**Evidence:** `blog/deploying-ai-built-sites.html` line 95: `<img src="../assets/blog/deploying-ai-built-sites.png" width="1672" height="941" decoding="async">`, placed immediately under the `<h1>`, no lazy-loading (correctly, since it's above the fold) but also no `fetchpriority="high"` or preload. File on disk / served live: **2,772,403 B**, `PNG image data, 1672 x 941, 8-bit/color RGB`. The sibling post `html-websites-are-the-future.png` is the same problem at 2,729,333 B. Confirmed live via `curl -D -`: `content-length: 2772403`, `content-type: image/png`, no compression on top (image formats aren't touched by fix #1 anyway, but this is a source-format problem, not a transport one).
**Impact:** This is almost certainly the LCP candidate for the blog post. At 2.64 MB with no compression at the format level, it will dominate LCP timing badly on mobile/throttled connections — very likely pushing blog LCP into "Poor" (>4.0s) on real-world connections.
**Fix:** Re-export as WebP or AVIF at a sane quality setting (85–90% size reduction typical for this kind of illustration/screenshot content is realistic, targeting ~150–300 KB), serve via `<picture>` with PNG fallback, and add `fetchpriority="high"` since it's the LCP element. Apply the same fix to `html-websites-are-the-future.png` and any future blog hero images.

### 4. [MEDIUM] Meta Pixel is initialized twice on the live site (duplicate tracking + extra head script)
**Evidence:** Source `js/meta-pixel.js` (loaded `defer` at the bottom of `<body>`, comment: "loaded after page content to avoid blocking LCP") is the only pixel loader in the repo. But the **live rendered `<head>`** (`ezlaunch.app-audit/live-html/index.html`, diffed against source) contains a second, unminified, inline Meta Pixel snippet injected right before `</head>` (comment: "EZLaunch Pixels — managed at app.ezlaunch.app") that also calls `fbq('init', ...)` and `fbq('track', 'PageView')`.
**Impact:** Facebook Pixel `PageView` (and any `Lead` events via the `onclick="fbq(...)"` CTAs) fire twice per visit — this both double-counts conversion/analytics data and adds an extra synchronous inline script plus a second async fetch of `fbevents.js` executing earlier in the document (before body parse) than necessary.
**Fix:** Deduplicate — keep only the platform-injected head snippet (if that's the source of truth going forward) or only the hardcoded `js/meta-pixel.js`, not both. If the head injection is a hosting-platform feature (app.ezlaunch.app pixel management) layered on top of a site that already hardcodes its own pixel, disable one of the two.

### 5. [MEDIUM] CSS/JS cached only 1 day with no cache-busting filenames
**Evidence:** `css/styles.css` and `js/main.js` both return `cache-control: public, max-age=86400, stale-while-revalidate=3600`; filenames carry no content hash/version query string.
**Impact:** Every returning visitor re-downloads the full (uncompressed, per finding #1) CSS/JS after 24 hours even if nothing changed — a missed caching win. Conversely, since there's no hash in the filename, this 1-day TTL is actually doing useful duty as a safety net against serving stale assets after a deploy; simply extending max-age without adding hashes would risk visitors being stuck on outdated CSS/JS for longer after a release.
**Fix:** Add a content hash or build version to `styles.css`/`main.js`/`hero-preview.js` filenames (or a `?v=` query param tied to deploy), then set `Cache-Control: public, max-age=31536000, immutable` like the fonts already do.

### 6. [LOW] OG/share image oversized (not a CWV/page-load issue, but affects link previews)
**Evidence:** `assets/og-image.png` = 1,511,969 B, referenced only via `<meta property="og:image">` / `<meta name="twitter:image">` — confirmed not present in any `src=`/`href=` used by the rendered page, so it is fetched by social-platform crawlers/unfurlers, not by visiting browsers, and does not affect LCP/CLS/INP for real users.
**Impact:** Some platforms cap or slow-load OG images over ~1 MB, degrading link-preview reliability/speed when the URL is shared.
**Fix:** Recompress to WebP/optimized PNG/JPEG under ~300 KB at 1200×630.

### 7. [INFO / good practice — no action needed]
- All 37 `<img>` tags on the homepage carry explicit `width`/`height` — no CLS risk from unsized images.
- Both above-the-fold fonts are `<link rel="preload">`-ed with `crossorigin`, and all `@font-face` rules use `font-display: swap` — solid font-loading practice, minimal FOIT/CLS risk.
- Homepage in-page asset budget (excluding fonts/og-image) is lean: ~322 KB across ~28 local SVG/CSS/JS references, ~30 total requests.
- Meta Pixel's *source* implementation (`js/meta-pixel.js`) is correctly deferred to the end of `<body>` specifically to avoid blocking LCP — good intent, undermined by the duplicate head injection in finding #4.

## Priority order

1. Enable br/gzip compression site-wide (finding 1) — affects every page, every visit, no functional risk.
2. Inline critical CSS / defer full stylesheet (finding 2) — pairs with #1 for compounding LCP gains.
3. Compress the two blog hero PNGs to WebP/AVIF (finding 3) — highest-impact single fix for the blog page's LCP specifically.
4. Deduplicate the Meta Pixel (finding 4) — cheap fix, fixes data integrity plus a small head-parsing cost.
5. Add cache-busted filenames + long-lived immutable caching for CSS/JS (finding 5).
6. Shrink the OG image (finding 6) — cosmetic/share-speed, not CWV.

## Follow-up needed

Re-run `curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=...&strategy=mobile&category=PERFORMANCE"` (mobile + desktop, home + blog) once the daily PSI quota resets, or with a configured API key, to replace this evidence-based estimate with measured Lighthouse LCP/INP/CLS/TBT and, if traffic qualifies, CrUX field percentiles.
