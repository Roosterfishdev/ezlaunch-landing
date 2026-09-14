# Technical SEO Audit — ezlaunch.app

Date: 2026-09-13
Scope: 9 pages (/, /blog, /blog/deploying-ai-built-sites, /blog/html-websites-are-the-future, /contact, /privacy, /prompt-library, /status, /terms), served by Next.js behind Caddy (`x-middleware-rewrite` shows static HTML served via `/api/serve/custom/*` rewrite).

## Technical Score: 44 / 100

Basics (HTTPS, HTTP/2, clean internal nav links, mobile viewport, static/crawlable content) are solid, but the sitemap/canonical layer is fundamentally broken (0% of sitemap URLs resolve directly), and there is zero HTTP compression on any text asset plus no HSTS/CSP. These are high-blast-radius issues for an otherwise small, healthy 9-page site.

---

## What Works

- All 9 pages return clean 200s at the correct canonical (apex, extensionless) URL: `/`, `/blog`, `/contact`, `/privacy`, `/prompt-library`, `/status`, `/terms`, `/blog/deploying-ai-built-sites`, `/blog/html-websites-are-the-future`.
- Internal navigation/footer links across all pages consistently use clean, extensionless, apex-relative URLs (`/blog`, `/contact`, `/privacy`, `/prompt-library`, `/status`, `/terms`, `/#features` etc.) — **no internal `<a>` navigation link points to a `.html` or `www` URL**; the only `.html`/`www` references found anywhere are in `<link rel="canonical">` / `og:url` meta tags on 3 pages (see Critical #2).
- No broken internal links or 404s found among checked hrefs/srcs (nav, footer, assets, fonts, icons, JS, third-party embeds all return 200).
- HTTP/2 confirmed on every request (apex, www, assets, third-party subdomains). HTTP/3 advertised via `alt-svc: h3=":443"`.
- `robots.txt` uses a simple `Allow: /` with no accidental disallows; no `noindex` meta tags found on any of the 9 pages.
- Mobile viewport meta (`width=device-width, initial-scale=1.0`) present and correct on all 9 pages; `lang="en"` set on `<html>` for all pages.
- Content is fully static/server-rendered HTML — no client-side-rendering dependency; all page copy is present in raw HTML (confirmed via curl, no headless rendering needed).
- Favicon set is thorough: `favicon.ico`, `favicon.svg`, PNG favicon, and `apple-touch-icon.png`, all served with 200 and long cache lifetimes.
- Images/icons in the hero use explicit `width`/`height` attributes (e.g., nav logo, drop-zone icon) — reduces CLS risk for those elements.
- Fonts are preloaded correctly (`<link rel="preload" as="font" crossorigin>`) and served with `cache-control: public, max-age=31536000, immutable`.
- Article structured data (`schema.org/Article`) present on both blog posts with headline, description, image, datePublished, author, publisher.
- Baseline security headers present on HTML responses: `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, `referrer-policy: strict-origin-when-cross-origin`.
- Third-party scripts (Meta Pixel loader in `<head>`, `analytics.ezlaunch.app/script.js`, `js/meta-pixel.js`, `js/hero-preview.js`) all load with `async` and return 200; Meta Pixel init snippet is non-blocking.

---

## Findings

### CRITICAL

**C1. 100% of sitemap.xml URLs are non-canonical and redirect (2-hop chains); Bing/Yandex/other non-Google crawlers may not follow-and-consolidate these correctly, and crawl budget/signal is wasted on every crawl.**
- Evidence: `sitemap.xml` lists 9 URLs, all `https://www.ezlaunch.app/...html`. Every one produces a 2-hop 301 chain:
  - `https://www.ezlaunch.app/blog.html` → `301` → `https://ezlaunch.app/blog.html` → `301` → `/blog` (200)
  - `https://www.ezlaunch.app/blog/deploying-ai-built-sites.html` → `301` → `https://ezlaunch.app/blog/deploying-ai-built-sites.html` → `301` → `/blog/deploying-ai-built-sites` (200)
  - Same pattern confirmed for `/`, `/contact.html`, `/privacy.html`, `/prompt-library.html`, `/status.html`, `/terms.html`.
- `robots.txt` itself compounds this: `Sitemap: https://www.ezlaunch.app/sitemap.xml` — the sitemap declaration points at the `www` host, which is itself a 301 redirect to apex, before a crawler even reaches the sitemap file.
- Fix: Regenerate `sitemap.xml` with the final, canonical apex + extensionless URLs (e.g., `https://ezlaunch.app/blog`, `https://ezlaunch.app/blog/deploying-ai-built-sites`), and update `robots.txt`'s `Sitemap:` directive to the apex host. Sitemap URLs should always be the literal 200-status destination, never a redirect source.

**C2. Canonical tags are missing on 6 of 9 pages, and the 3 that exist point to a URL that itself 301-redirects (self-referencing canonical is broken).**
- Evidence: Checked all 9 live HTML files for `<link rel="canonical">`:
  - **Missing entirely**: `/` (index.html), `/contact`, `/privacy`, `/prompt-library`, `/status`, `/terms` — 6 pages, zero canonical tag.
  - **Present but wrong**: `/blog` → canonical = `https://ezlaunch.app/blog.html` (301s to `/blog`); `/blog/deploying-ai-built-sites` → canonical = `https://ezlaunch.app/blog/deploying-ai-built-sites.html` (301s to clean URL); `/blog/html-websites-are-the-future` → same pattern. `og:url` on these 3 pages also points to the same broken `.html` URL.
  - This supersedes/corrects earlier evidence that "homepage has no canonical, subpages have canonicals pointing to .html" — in fact only the blog index + 2 blog posts have any canonical tag at all; the other 5 non-blog pages have none.
- Impact: A canonical tag pointing at a URL that redirects is functionally equivalent to having no canonical for consolidation purposes in most search engines' handling, and signals confusion. Combined with 6 pages having no canonical at all, duplicate-content/URL-variant risk (www vs apex, `.html` vs clean) is unmanaged sitewide.
- Fix: Add a self-referencing `<link rel="canonical">` to every page pointing at its own final apex + extensionless URL (e.g., index.html → `https://ezlaunch.app/`, `/contact` → `https://ezlaunch.app/contact`), and correct the 3 existing canonical/og:url tags to drop `.html`.

**C3. No HTTP compression on any text-based asset (HTML, CSS, JS) despite the client requesting gzip/br.**
- Evidence: `curl -sI -H "Accept-Encoding: gzip, br"` against `/`, `/css/styles.css`, `/js/main.js` all return `HTTP/2 200` with **no `content-encoding` header**. `styles.css` is served at its full uncompressed size of **123,506 bytes**; `js/main.js` at 9,349 bytes uncompressed.
- Impact: Direct CWV/LCP hit — the render-blocking stylesheet is transferring ~4-6x more bytes than a gzip/brotli-compressed equivalent would (typical CSS compresses 70-85%). On slower mobile connections this materially delays First Contentful Paint / LCP on every page load.
- Fix: Enable gzip/brotli compression at the Caddy layer (Caddy supports `encode gzip zstd` natively) for `text/html`, `text/css`, `application/javascript`, `image/svg+xml`. This is a low-effort, high-impact fix.

**C4. Missing HSTS (Strict-Transport-Security) header; no CSP or Permissions-Policy anywhere on the site.**
- Evidence: Full header dump on `https://ezlaunch.app/` shows `referrer-policy`, `x-content-type-options`, `x-frame-options` present, but no `strict-transport-security`, `content-security-policy`, or `permissions-policy` header on HTML or asset responses.
- Impact: Without HSTS, a user's first request to `http://ezlaunch.app` (or a stale bookmark/link) is vulnerable to SSL-stripping/downgrade MITM before the 301-to-HTTPS is even received. Absence of CSP is a hardening gap, particularly notable given the site loads third-party scripts (Meta Pixel, custom analytics subdomain).
- Fix: Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` at the Caddy layer. Add a baseline CSP (even a report-only policy to start) scoped to allow `self`, `connect.facebook.net`, `analytics.ezlaunch.app`, and `app.ezlaunch.app`/`docs.ezlaunch.app` as needed.

**C5. Full 123KB uncompressed CSS is render-blocking on every page — and the site already has unused critical-CSS files that were never wired in.**
- Evidence: `<link rel="stylesheet" href="css/styles.css">` loads synchronously in `<head>` on every page (123,506 bytes, uncompressed per C3). The local repo (`/Users/juliancabada/Desktop/ezlaunch-landing/css/`) also contains `critical-index.css` (33,038 bytes) and `critical-sub.css` (14,544 bytes) — clearly authored as above-the-fold/critical-path CSS splits — but `grep` across every page's HTML shows **zero references** to either file; they are dead code, not inlined or loaded anywhere.
- Impact: Combined with C3, this is the most direct Core-Web-Vitals/LCP risk on the site: every page blocks first paint on a ~123KB uncompressed stylesheet fetch+parse instead of an inlined ~15-33KB critical subset with the rest deferred.
- Fix: Inline `critical-index.css` (homepage) / `critical-sub.css` (subpages) directly in `<head>` via `<style>`, and load the remainder of `styles.css` asynchronously (`<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback), or split further with per-route CSS if the Next.js build supports it.

### HIGH

**H1. No structured data (JSON-LD) on the homepage or any non-blog page.**
- Evidence: `application/ld+json` count is 0 on `/`, `/contact`, `/privacy`, `/prompt-library`, `/status`, `/terms`, `/blog` (index). Only the 2 blog post pages have Article schema.
- Impact: Missed opportunity for a SaaS product to mark up `Organization`/`SoftwareApplication`/`Product` schema (pricing, ratings, sameAs social links are all present in the HTML already — `facebook.com`, `linkedin.com`, `x.com` — but not connected via structured data), reducing eligibility for enhanced SERP features (sitelinks search box, knowledge panel signals).
- Fix: Add `Organization` schema (with `sameAs` pointing to the 3 social profiles already linked in the footer) to a shared layout/template, and consider `SoftwareApplication` schema on the homepage with pricing tiers already displayed in HTML.

**H2. Article schema on blog posts is incomplete for rich-result eligibility.**
- Evidence: Both blog posts' JSON-LD have `headline`, `description`, `image`, `datePublished`, `author`, `publisher.name`, `publisher.url` — but **no `publisher.logo`** (required by Google's Article rich-result guidelines) and no `mainEntityOfPage`.
- Fix: Add `"publisher": {"logo": {"@type": "ImageObject", "url": "https://ezlaunch.app/assets/..."}}` and `"mainEntityOfPage": {"@type": "WebPage", "@id": "<canonical URL>"}`.

### MEDIUM

**M1. `llms.txt` returns 404.**
- Evidence: `curl -o /dev/null -w "%{http_code}"` → `404`.
- Context: Not a ranking factor and not yet a formal standard, but for an AI-website-hosting SaaS product specifically marketing to "AI Builders" (per on-page copy), publishing an `llms.txt` is a low-cost, on-brand signal for AI crawlers/agents. Optional/Medium priority rather than a compliance gap.
- Fix: Add a minimal `llms.txt` at the root summarizing product, key pages, and API/docs links.

**M2. No IndexNow key file / IndexNow not implemented.**
- Evidence: No `<hash>.txt` IndexNow key file found at root (checked common pattern, 404).
- Impact: Bing/Yandex/Naver won't receive push notifications on the (currently low-frequency) content updates; they'll rely on normal crawl schedules. Low urgency given only 9 pages and a `weekly`/`monthly` changefreq, but worth doing once the sitemap (C1) is fixed, since IndexNow submissions should use the same canonical URLs.
- Fix: Generate an IndexNow key, host the key file at root, and submit on publish/update of any of the 9 URLs (especially new blog posts).

**M3. No web app manifest (`site.webmanifest`/`manifest.json`).**
- Evidence: Both return 404.
- Impact: Minor — affects "Add to Home Screen" branding/PWA install metadata on mobile, not a core SEO ranking issue, but relevant to the mobile-experience assessment given favicons/apple-touch-icon are otherwise fully built out.
- Fix: Add a basic manifest referencing existing icon assets if home-screen install is desired; otherwise low priority.

### LOW

**L1. `x-middleware-rewrite` response header leaks internal routing implementation.**
- Evidence: Every HTML response includes `x-middleware-rewrite: /api/serve/custom/<path>`, exposing the internal Next.js/Caddy rewrite target (e.g., `/api/serve/custom/index.html`, `/api/serve/custom/blog`).
- Impact: Minor information disclosure (reveals backend routing structure), not itself an SEO issue, but worth flagging to engineering — Next.js normally strips this in production; it may indicate a middleware/dev-header leak.
- Fix: Confirm this header is intentionally exposed; if not, strip `x-middleware-rewrite` from external responses (Caddy `header -x-middleware-rewrite` or Next.js middleware config).

**L2. `cache-control: no-cache` on all HTML responses.**
- Evidence: Every page (`/`, `/blog`, assets excluded) returns `cache-control: no-cache`.
- Impact: Reasonable for a small SaaS marketing site where content can change (forces revalidation rather than blocking caching outright — `no-cache` still permits conditional GETs), so this is informational rather than a defect, but confirm this is intentional vs. a default Next.js dev setting; a short `max-age` with `stale-while-revalidate` (as already used on CSS/JS/image assets) would reduce origin load with no freshness cost.

**L3. `og:url` format inconsistency on the homepage.**
- Evidence: Homepage `og:url` = `https://ezlaunch.app` (no trailing slash, no canonical tag to anchor it — see C2), while the actual/canonical resource is `https://ezlaunch.app/`.
- Fix: Once C2 is resolved (self-referencing canonical added), align `og:url` to match the canonical exactly, including trailing slash.

---

## Category Pass/Fail Summary

| Category | Status | Notes |
|---|---|---|
| Crawlability (robots.txt, sitemap, noindex) | **FAIL** | robots.txt valid, no noindex tags, but sitemap 100% redirects (C1) |
| Indexability (canonicals, duplicates) | **FAIL** | 6/9 pages missing canonical, 3/9 canonicals broken (C2) |
| Security (HTTPS, headers) | **PARTIAL** | HTTPS/redirect-to-apex fine; missing HSTS/CSP/Permissions-Policy (C4) |
| URL Structure / Redirects | **PARTIAL** | Clean extensionless URLs used site-wide in nav; sitemap URLs all redirect 2 hops (C1) |
| Mobile | **PASS** | Correct viewport, lang attr, favicon/apple-touch-icon set, no obvious touch-target CSS found |
| Core Web Vitals (source inspection) | **FAIL** | No compression (C3) + 123KB render-blocking CSS with unused critical-CSS split (C5) |
| Structured Data | **PARTIAL** | Article schema on 2 blog posts (minor gaps, H2); none on homepage/other 7 pages (H1) |
| JavaScript Rendering | **PASS** | Fully static/SSR HTML; all copy present in raw source; async third-party scripts |
| IndexNow | **FAIL** | Not implemented, no key file (M2) |

---

## Files Referenced
- Live HTML snapshots: `/Users/juliancabada/Desktop/ezlaunch-landing/ezlaunch.app-audit/live-html/*.html`
- Local site source: `/Users/juliancabada/Desktop/ezlaunch-landing/{index,blog,contact,privacy,prompt-library,status,terms}.html`, `/Users/juliancabada/Desktop/ezlaunch-landing/robots.txt`, `/Users/juliancabada/Desktop/ezlaunch-landing/sitemap.xml`
- CSS split (critical CSS unused): `/Users/juliancabada/Desktop/ezlaunch-landing/css/critical-index.css`, `/Users/juliancabada/Desktop/ezlaunch-landing/css/critical-sub.css`, `/Users/juliancabada/Desktop/ezlaunch-landing/css/styles.css`
