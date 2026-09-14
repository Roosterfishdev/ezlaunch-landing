# EZLaunch — Full SEO Audit Report

**Site:** https://ezlaunch.app  
**Audit date:** 2026-09-13  
**Pages crawled:** 9 of 9 (entire site; sitemap and internal-link crawl are 1:1)  
**Business type:** SaaS — static hosting for AI-generated websites (Claude Code, Cursor, Bolt, Lovable, Replit, v0). Operated by Jaguar Hosting LLC (Wyoming). Not local, not e-commerce.

## Executive Summary

### SEO Health Score: 50 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 44 | 9.7 |
| Content Quality | 23% | 48 | 11.0 |
| On-Page SEO | 20% | 58 | 11.6 |
| Schema / Structured Data | 10% | 38 | 3.8 |
| Performance (CWV) | 10% | 58 (estimated) | 5.8 |
| AI Search Readiness | 10% | 54 | 5.4 |
| Images | 5% | 58 | 2.9 |
| **Total** | | | **50.2** |

Supplementary (not weighted): Sitemap 62, Search Experience (SXO) 45, Topic cluster plan delivered.

### The one-sentence diagnosis
The site is a clean, fast-to-render static build with a URL identity crisis: the sitemap, canonical tags, and the server each name a different "real" URL for every page, the homepage has no canonical and no structured data, text assets ship uncompressed, and the content that would actually win searches (per-tool deploy pages, comparisons, an About page, an un-gated prompt library) does not exist yet.

### Top 5 critical issues
1. **Sitemap is 100% redirects.** All 9 URLs use `www` + `.html`; each takes a 2-hop 301 (www→apex, .html→clean) before a 200. robots.txt points to the www sitemap. Canonical tags on the 3 pages that have them point to `.html` URLs that themselves redirect. Six pages (home, contact, privacy, prompt-library, status, terms) have no canonical at all.
2. **No structured data on the homepage** despite a 4-tier pricing table (Free, Starter $5, Pro $10, Agency $19/mo), a feature grid, and 4 social profiles. Both blog posts' Article JSON-LD is missing `publisher.logo`, `mainEntityOfPage`, `dateModified`.
3. **Zero HTTP compression** on HTML, CSS (123 KB), and JS. A critical-CSS build exists in the repo (`css/critical-index.css`, `css/critical-sub.css`) but is referenced nowhere; every page render-blocks on the full stylesheet.
4. **Prompt Library is invisible to crawlers.** The page's promised content is email-gated and injected by JS after signup; crawlable text is ~110 words of UI chrome. Same page is the most "askable" content on the site for AI engines.
5. **No page matches the site's own target queries.** Meta keywords target "Claude Code hosting" and "Cursor hosting", the logo strip names 8 tools, yet there is no `/deploy/lovable`, `/deploy/bolt`, or similar page. Competitors (Hostinger, DeployHQ, Netlify) own those SERPs with dedicated pages.

### Top 5 quick wins
1. Replace `sitemap.xml` with `sitemap-corrected.xml` (apex host, clean URLs) and update the robots.txt Sitemap line. 10 minutes.
2. Add `<link rel="canonical">` to all 9 pages using clean apex URLs, and change every `og:url` to match. 20 minutes.
3. Enable `encode zstd gzip` in Caddy. One config line, 70–85% smaller text transfers.
4. Paste the generated Organization + WebSite + SoftwareApplication JSON-LD from `findings/schema.md` into the homepage head. 15 minutes.
5. Re-export the three multi-megabyte PNGs (og-image 1.5 MB, two blog heroes 2.7 MB each) as WebP/compressed at rendered size. 30 minutes.

---

## Technical SEO — 44/100
Full detail: `findings/technical.md`, `findings/sitemap.md`

**What works:** All internal nav/footer links already use clean extensionless URLs with no 404s. Content is fully present in raw HTML (no JS rendering dependency). HTTP/2 everywhere. Viewport, `lang="en"`, favicon set, apple-touch-icon all correct. CSS/JS/font/image assets carry `cache-control: public`. robots.txt is open to all crawlers.

**Crawlability and indexability**
- Critical: three-way URL mismatch. Sitemap = `www` + `.html`; canonical tags = apex + `.html`; served 200 = apex + clean path. Google receives conflicting canonical signals on every page.
- Critical: 6 of 9 pages have no canonical tag; the 3 that do (blog index, both posts) self-reference a redirecting URL.
- High: every sitemap URL is a 2-hop redirect chain. Wasted crawl budget and diluted signals.
- Medium: robots.txt `Sitemap:` directive points to the www host.
- Medium: `og:url` on 8 of 9 pages uses `.html`; homepage `og:url` is `https://ezlaunch.app` without trailing slash.
- Low: `x-middleware-rewrite: /api/serve/custom/index.html` header leaks internal routing.
- Info: `changefreq`/`priority` in sitemap are ignored by Google; lastmod values are genuine (they match post publish dates).

**Security headers**
- High: no `Strict-Transport-Security`. HTTP→HTTPS redirect is downgrade-vulnerable.
- Medium: no `Content-Security-Policy` or `Permissions-Policy` despite third-party scripts (Meta Pixel, analytics subdomain). Present: `x-content-type-options`, `x-frame-options`, `referrer-policy`.

**Delivery**
- Critical: no `content-encoding` on any text asset (verified with `Accept-Encoding: gzip, br`).
- High: 123,506 B `styles.css` render-blocks every page; unused critical-CSS files sit in the repo.
- Medium: CSS/JS cached 24h with un-hashed filenames. HTML is `cache-control: no-cache`.
- Low: `/llms.txt` 404; no IndexNow key.

## Content Quality — 48/100
Full detail: `findings/content.md`

**What works:** The "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit" post is 2,090 words with a comparison table, lists, visible byline and publish date: exactly the shape AI engines cite. Both posts have descriptive hero alt text. Pricing is transparent on the homepage.

**E-E-A-T**
- High: no customer proof anywhere. No testimonials, logos, case studies, or usage numbers. "Join developers already hosting on EZLaunch" gives no count.
- High: no About or team page. Company identity ("Jaguar Hosting LLC, Wyoming") appears only in legal pages. No founder bio, address, or phone.
- Medium: posts have no author bio, credentials link, or "Updated" date; no `dateModified`.
- Medium: Status page hardcodes "Last updated: May 2026" while claiming real-time updates. Four months stale on the one page whose job is trust.

**Thin content**
- High: Prompt Library — 119 crawlable words; the prompts are email-gated. Title/meta promise "copy-ready AI prompts" that Google never sees.
- Medium: Blog index (173 words) and Status (103 words) are thin but functional.

**Readability and citability**
- Homepage copy is feature-card microcopy; the only full product definition lives in the meta description, not visible prose.
- No FAQ section on any page.
- Second post ("Static HTML Websites Are Not Just the Present") is 1,176 words, opinion-led, with few sourced claims.

## On-Page SEO — 58/100
Full detail: `findings/onpage.md` (includes per-page title/description/H1 table)

**What works:** Every page has a unique title, meta description, and exactly one H1. Titles follow a consistent "Page — EZLaunch" pattern. Heading hierarchy is orderly on the posts (6–8 H2s each).

- High: canonical tags missing on 6 pages (see Technical).
- High: Prompt Library title/meta vs. indexable content mismatch.
- Medium: blog index `og:title` is "EZblog — EZLaunch" while `<title>` is "Blog — EZLaunch".
- Medium: both blog post titles run 82–83 characters and will truncate in SERPs. Trim to under 60.
- Medium: blog posts are not linked from the homepage body; only the footer "Blog" link reaches them. Blog index links each post once.
- Low: homepage nav logo links to `#` rather than `/`.
- Low: `meta keywords` tag is present; harmless but ignored by Google.

## Schema & Structured Data — 38/100
Full detail: `findings/schema.md` (contains ready-to-paste JSON-LD)

**Current implementation:** Article JSON-LD on both blog posts only. Nothing on homepage, blog index, contact, status, legal pages.

- Critical: homepage has zero structured data. Generated `Organization` (logo, sameAs for X, LinkedIn, Facebook, GitHub), `WebSite`, and `SoftwareApplication` with four `Offer` entries at real prices are in the findings file.
- High: both posts' `publisher` lacks the required `logo` ImageObject.
- Medium: posts missing `mainEntityOfPage`, `dateModified`, `author.url`. Schema URLs use `.html` form; switch to clean URLs alongside the canonical fix.
- Medium: no `BreadcrumbList` anywhere (template provided). No `Blog`/`CollectionPage` on the index, no `ContactPage`.
- Info: no FAQ content exists, so no FAQPage recommended; Google has retired FAQ rich results for most sites anyway.

## Performance — 58/100 (estimated)
Full detail: `findings/performance.md`

**Data limitation:** PageSpeed Insights returned 429 (anonymous daily quota exhausted) on all three attempts, and no Chromium is installed locally. No CrUX field data is available for this domain. The score is an evidence-based estimate from headers, asset sizes, and source; re-run PSI with an API key to replace it with measured LCP/INP/CLS.

| Signal | Homepage | Blog post |
|---|---|---|
| Estimated Lighthouse (mobile) | ~58 | ~38 |
| Text compression | none | none |
| Render-blocking CSS | 123.5 KB | 123.5 KB |
| Likely LCP element | hero text/SVG (fast) | 2.6 MB PNG hero |
| CLS risk | low (all images sized) | low |
| Fonts | 2 woff2, preloaded, swap | same |

- High: no brotli/gzip. Single biggest lever.
- High: full stylesheet render-blocks; critical-CSS extract already built but never inlined.
- High (posts): 2.6–2.7 MB PNG heroes above the fold; convert to WebP/AVIF, add `fetchpriority="high"`.
- Medium: Meta Pixel fires twice per pageview (hardcoded `js/meta-pixel.js` in body plus an inline snippet in the served `<head>`). Double-counts conversions.
- Medium: 24h cache on un-hashed CSS/JS; move to hashed filenames + `immutable`.

## Images — 58/100
Full detail: `findings/images.md`

**What works:** all 37 homepage images have width/height; 32 are lazy-loaded; all UI graphics are small SVGs; blog hero alt text is descriptive.

- High: two blog hero PNGs at 2.77 MB and 2.73 MB, no `srcset`, no modern format.
- High: og-image.png is 1.5 MB; social unfurls are slow and some platforms skip images this large.
- Medium: blog index thumbnails have empty alt.
- Low: tool logos cloned 4× in the marquee (32 `<img>`); mark clones `aria-hidden`.

## AI Search Readiness (GEO) — 54/100
Full detail: `findings/geo.md` (includes llms.txt draft)

Dimension scores: Citability 55, Structure 60, Multi-modal 35, Authority/brand 40, Technical access 75.

**What works:** robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot. Responses are byte-identical across AI and browser user agents (no cloaking). Pure static HTML. The deploy post's comparison table is highly citable.

- Critical: Prompt Library is unreadable by every AI engine (email-gated, JS-injected).
- High: no Organization/Product schema; weak entity signal for AI Overviews and Bing Copilot.
- High: `/llms.txt` missing (draft provided; note Google ignores it).
- Medium: homepage lacks a self-contained "EZLaunch is…" paragraph in visible prose.
- Medium: no FAQ content. Brand mentions off-site are sparse (GitHub CLI repo, X, LinkedIn, Facebook profiles exist; no Product Hunt, G2, or directory listings found).

## Search Experience (SXO) — 45/100
Full detail: `findings/sxo.md`

SERP-backwards analysis of "static site hosting", "host AI generated website", "how to deploy a Lovable site", "deploy Bolt.new site" shows the results are dominated by per-tool guides and ranked comparison listicles. EZLaunch fields only a generic homepage. Persona scorecards (vibe-coder with a ZIP, developer with a repo, agency) all score Trust lowest (10–12/25) for lack of an About page, proof, or customer numbers.

**Pages to build, in order:** `/deploy/lovable`, `/deploy/bolt`, `/deploy/claude-code`, `/deploy/cursor`, EZLaunch vs Netlify/Vercel/GitHub Pages/Tiiny Host comparison, `/about`, un-gated prompt-library preview, `/how-it-works`.

## Topic Cluster Plan
Full detail: `findings/cluster.md`

Four hub-and-spoke clusters: (1) Static hosting alternatives and comparisons, (2) Deploy your no-code AI app (hub: expand the existing deploy post), (3) Deploy sites built by AI coding agents, (4) Static site features and prompt resources (hub: expand Prompt Library). First eight pages to write are listed in the action plan. Cluster 2 and 3 overlap in titles but not in SERPs; keep them separate and target broad vs. tool-specific keywords to avoid cannibalization.

---

## Limitations
- The claude-seo managed Python runtime could not be installed on this machine (venv creation fails on both Python 3.10 and 3.14). Rendering, screenshots, and the PDF generator were unavailable. Findings come from live HTTP fetches, the local source, and specialist analysis.
- PageSpeed Insights quota was exhausted; performance is estimated, not measured.
- No Google Search Console, GA4, Moz, Bing, or DataForSEO credentials were configured, so no indexation, traffic, ranking, or backlink data.
- WebSearch returns a curated sample per query, so SERP overlap counts in the cluster and SXO findings are directional.

## Artifacts
- `ACTION-PLAN.md` — prioritized fixes by phase
- `audit-data.json` — structured envelope for report generation
- `sitemap-corrected.xml` — drop-in replacement sitemap
- `findings/` — technical, sitemap, content, onpage, schema, performance, images, geo, sxo, cluster
- `live-html/` — snapshots of all 9 pages as served on 2026-09-13
