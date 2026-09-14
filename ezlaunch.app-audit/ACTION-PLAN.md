# EZLaunch — SEO Action Plan

Site: https://ezlaunch.app · Audit date: 2026-09-13 · Health score: 50/100

Priorities: **Critical** = blocks indexing or sends conflicting canonical signals, fix now. **High** = significant ranking impact, within 1 week. **Medium** = within 1 month. **Low** = backlog.

## Phase 1 — Critical fixes (Week 1)

| # | Fix | Where | Effort |
|---|---|---|---|
| 1.1 | Replace `sitemap.xml` with `ezlaunch.app-audit/sitemap-corrected.xml` (apex host, clean URLs, no changefreq/priority) | `sitemap.xml` | 10 min |
| 1.2 | Change robots.txt Sitemap line to `https://ezlaunch.app/sitemap.xml` | `robots.txt` | 2 min |
| 1.3 | Add `<link rel="canonical" href="https://ezlaunch.app/...">` to all 9 pages using clean URLs (`/`, `/blog`, `/blog/deploying-ai-built-sites`, `/blog/html-websites-are-the-future`, `/prompt-library`, `/contact`, `/status`, `/privacy`, `/terms`). Fix the 3 existing `.html` canonicals. | every `.html` head | 20 min |
| 1.4 | Set every `og:url` to the same clean canonical URL (homepage: `https://ezlaunch.app/` with trailing slash) | every `.html` head | 10 min |
| 1.5 | Enable compression in Caddy: `encode zstd gzip` | Caddyfile | 5 min |
| 1.6 | Paste the Organization + WebSite + SoftwareApplication JSON-LD from `findings/schema.md` into the homepage head | `index.html` | 15 min |
| 1.7 | Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` | Caddyfile | 5 min |
| 1.8 | Resubmit the sitemap in Google Search Console and request re-indexing of the homepage | GSC | 5 min |

## Phase 2 — High-impact improvements (Weeks 2–3)

| # | Fix | Where | Effort |
|---|---|---|---|
| 2.1 | Inline `css/critical-index.css` (home) and `css/critical-sub.css` (subpages) in `<head>`, load `styles.css` with `media="print" onload="this.media='all'"` or `rel=preload` swap | all pages | 1 h |
| 2.2 | Re-export blog hero PNGs as WebP/AVIF at rendered width (target < 150 KB), add `<picture>` fallback, `srcset`, and `fetchpriority="high"` on post pages | `assets/blog/`, both posts, `blog.html` | 1 h |
| 2.3 | Re-export `og-image.png` at 1200×630 under 300 KB | `assets/og-image.png` | 15 min |
| 2.4 | Fix blog post Article JSON-LD: add `publisher.logo` ImageObject, `mainEntityOfPage`, `dateModified`, `author.url`; switch URLs to clean form. Add `BreadcrumbList` (template in `findings/schema.md`) | both posts | 30 min |
| 2.5 | Remove the duplicate Meta Pixel: keep one loader (either `js/meta-pixel.js` or the inline head snippet), not both | all pages / server template | 20 min |
| 2.6 | Make Prompt Library crawlable: render at least 3–5 full prompts and every prompt title/summary in the HTML; gate only the download or the long tail | `prompt-library.html`, `js/prompt-library.js` | 2 h |
| 2.7 | Add an `/about` page: who runs EZLaunch (Jaguar Hosting LLC, Wyoming), founder, mission, contact channels; link from footer | new page | 2 h |
| 2.8 | Add social proof to the homepage: real site count or customer logos, 2–3 testimonials | `index.html` | 2 h |
| 2.9 | Fix Status page: remove hardcoded "Last updated: May 2026" or wire it to live data | `status.html` | 30 min |
| 2.10 | Shorten both blog post titles to under 60 characters; align blog index `og:title` with its `<title>` | posts, `blog.html` | 15 min |
| 2.11 | Add CSP and Permissions-Policy headers (allow-list Meta Pixel and analytics hosts) | Caddyfile | 1 h |
| 2.12 | Add a visible "What is EZLaunch" paragraph (2–3 sentences, entity-first) near the top of the homepage | `index.html` | 20 min |

## Phase 3 — Content & authority (Month 2)

Build in this order (from `findings/sxo.md` and `findings/cluster.md`):

1. Expand `/blog/deploying-ai-built-sites` into the "Deploy your no-code AI app" pillar
2. `/deploy/lovable` (or `/guides/deploy-lovable-app`) — step-by-step with screenshots, custom domain, forms
3. `/deploy/bolt`
4. Expand `/prompt-library` into a real resource hub (ungated index, per-prompt pages)
5. `/compare/netlify-alternatives` — EZLaunch vs Netlify, Vercel, GitHub Pages, Tiiny Host with a feature/price table
6. `/compare/github-pages-alternatives`
7. `/guides/add-contact-form-to-static-site`
8. `/deploy/v0`
9. Then: `/deploy/claude-code`, `/deploy/cursor`, `/deploy/replit`, `/how-it-works`, `/guides/custom-domain-ssl-static-site`, `/guides/static-site-analytics`

For each: clean URL, canonical, BreadcrumbList, Article or HowTo schema, an answer-first opening paragraph, an FAQ block, and internal links to the hub and sibling spokes per the link matrix in `findings/cluster.md`. Link every new page from the homepage tool strip (each logo becomes a link to its deploy page).

Also:
- Add `/llms.txt` (draft in `findings/geo.md`)
- Add author bios and "Updated" dates to posts
- Get listed: Product Hunt, G2/Capterra, AlternativeTo, awesome-lists on GitHub for static hosting; these are the brand-mention signals AI engines use

## Phase 4 — Monitoring & iteration (Ongoing)

- Connect Google Search Console and GA4, then re-run this audit with credentials for indexation, CrUX, and traffic data
- Run PageSpeed Insights with an API key on home and one post monthly; target LCP < 2.5 s mobile
- Move CSS/JS to hashed filenames with `cache-control: immutable, max-age=31536000`
- Set an IndexNow key and ping Bing on publish
- Capture a drift baseline after Phase 1 so regressions (lost canonicals, redirect chains) are caught automatically
- Re-check SERP position for "deploy lovable site", "deploy bolt site", "static site hosting free" every 2 weeks after Phase 3 pages go live

## Low priority / backlog
- Strip the `x-middleware-rewrite` response header
- Remove the `meta keywords` tag
- Point the nav logo at `/` instead of `#`
- Reduce marquee logo clones from 4 to 2 and mark clones `aria-hidden="true"`
- Give blog index thumbnails descriptive alt text
