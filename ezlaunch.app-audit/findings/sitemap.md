# XML Sitemap Audit — ezlaunch.app

**Date:** 2026-09-13
**Sitemap URL:** https://ezlaunch.app/sitemap.xml (identical to https://www.ezlaunch.app/sitemap.xml, local copy identical to live)
**Score: 62 / 100**

## Score Rationale
- XML is well-formed (validated with `xmllint`), well under the 50,000-URL / 50MB limit (9 URLs, 1,671 bytes). +
- All 9 listed URLs are indexable (eventually return 200). +
- lastmod dates are genuine and differentiated (verified against JSON-LD `Published` dates in blog posts) rather than a single boilerplate date. +
- Major deduction: every single URL forces a 2-hop redirect chain (www→apex, then .html→clean path) before reaching the indexable 200 page — wasted crawl budget and a three-way canonical/sitemap/serving-path mismatch. Deduction: -25
- robots.txt `Sitemap:` directive points to the www host, which itself 301s — a broken/non-canonical reference. Deduction: -8
- Deprecated `priority`/`changefreq` tags present on every URL (ignored by Google, harmless but noise). Deduction: -5

## Per-URL Status (curl-verified, live)

| Sitemap URL (as listed) | Hop 1 | Hop 2 | Final URL | Final Status | Notes |
|---|---|---|---|---|---|
| https://www.ezlaunch.app/ | 301 → https://ezlaunch.app/ | 200 | https://ezlaunch.app/ | 200 | 1 redirect (www→apex only; root has no .html form) |
| https://www.ezlaunch.app/blog.html | 301 → https://ezlaunch.app/blog.html | 301 → https://ezlaunch.app/blog | https://ezlaunch.app/blog | 200 | 2 redirects |
| https://www.ezlaunch.app/blog/deploying-ai-built-sites.html | 301 → https://ezlaunch.app/blog/deploying-ai-built-sites.html | 301 → https://ezlaunch.app/blog/deploying-ai-built-sites | https://ezlaunch.app/blog/deploying-ai-built-sites | 200 | 2 redirects |
| https://www.ezlaunch.app/blog/html-websites-are-the-future.html | 301 → …/blog/html-websites-are-the-future.html | 301 → …/blog/html-websites-are-the-future | https://ezlaunch.app/blog/html-websites-are-the-future | 200 | 2 redirects |
| https://www.ezlaunch.app/prompt-library.html | 301 → https://ezlaunch.app/prompt-library.html | 301 → https://ezlaunch.app/prompt-library | https://ezlaunch.app/prompt-library | 200 | 2 redirects |
| https://www.ezlaunch.app/contact.html | 301 → https://ezlaunch.app/contact.html | 301 → https://ezlaunch.app/contact | https://ezlaunch.app/contact | 200 | 2 redirects |
| https://www.ezlaunch.app/status.html | 301 → https://ezlaunch.app/status.html | 301 → https://ezlaunch.app/status | https://ezlaunch.app/status | 200 | 2 redirects |
| https://www.ezlaunch.app/privacy.html | 301 → https://ezlaunch.app/privacy.html | 301 → https://ezlaunch.app/privacy | https://ezlaunch.app/privacy | 200 | 2 redirects |
| https://www.ezlaunch.app/terms.html | 301 → https://ezlaunch.app/terms.html | 301 → https://ezlaunch.app/terms | https://ezlaunch.app/terms | 200 | 2 redirects |

No 404s, no soft-404s, no noindex headers/meta observed on any final destination. No `Last-Modified` response header is served by the origin (Next.js custom serve via Caddy, `Cache-Control: no-cache`), so lastmod cannot be verified server-side — it was instead cross-checked against in-page JSON-LD dates (see Findings).

## Findings

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | Three-way host/path inconsistency: sitemap lists `www` + `.html`; page `<link rel="canonical">` (on blog posts) points to apex + `.html`; server actually serves apex + clean path as the 200. No single system agrees on the canonical URL. | **Critical** | `curl -sI https://www.ezlaunch.app/blog.html` → 301 to apex `.html` → 301 to apex clean `/blog` (200). Canonical tag in `blog/deploying-ai-built-sites.html` reads `https://ezlaunch.app/blog/deploying-ai-built-sites.html`. | Standardize on ONE URL everywhere: apex + clean path (e.g. `https://ezlaunch.app/blog/deploying-ai-built-sites`). Update sitemap (done, see corrected file), update all canonical tags to the clean apex URL, and confirmed the clean apex URL is what 200s (it is). |
| 2 | Every sitemap URL requires 2 redirect hops (www→apex, .html→clean) before reaching the indexable page. Google can follow redirects in sitemaps but treats it as wasted crawl budget and a demoted signal; some crawlers cap redirect-follow depth. | High | Table above — 8 of 9 URLs show 2×301. | List the final destination URL directly in the sitemap (apex, clean path) so it's a direct 200 with zero hops. Implemented in `sitemap-corrected.xml`. |
| 3 | robots.txt `Sitemap:` directive points to `https://www.ezlaunch.app/sitemap.xml`, which itself 301s to the apex sitemap. | Medium | `curl -sI https://www.ezlaunch.app/sitemap.xml` → 301 → `https://ezlaunch.app/sitemap.xml` (200, `application/xml`). | Point robots.txt directly at `https://ezlaunch.app/sitemap.xml` (see corrected robots.txt below). |
| 4 | Deprecated `<priority>` and `<changefreq>` tags present on all 9 URLs. Both are explicitly ignored by Google's indexer. | Info | Present in every `<url>` block of the live sitemap. | Remove both tags (done in `sitemap-corrected.xml`) to reduce file size/noise; harmless to leave but adds no value. |
| 5 | `changefreq` claims `weekly` for home/blog-index/prompt-library/status, but their `lastmod` (2026-05-28) is ~15 weeks stale as of 2026-09-13 — internally inconsistent metadata (moot since Google ignores changefreq, but signals unmaintained automation if reused elsewhere). | Low | lastmod 2026-05-28 vs audit date 2026-09-13, tag says weekly. | No action required beyond removing changefreq (see #4); if lastmod is regenerated dynamically, ensure it reflects actual content edits rather than a fixed/stale value. |
| 6 | lastmod values appear genuine, not boilerplate: two blog posts have distinct lastmod (2026-06-03, 2026-05-19) that exactly match the `Published` date embedded in each post's JSON-LD structured data. | Positive (no fix needed) | `grep Published` in `blog/deploying-ai-built-sites.html` → `2026-06-03`; in `blog/html-websites-are-the-future.html` → `2026-05-19`; matches sitemap lastmod exactly. | None — good practice. Consider updating to a true "last modified" date (vs. publish date) if/when posts are edited. |
| 7 | Coverage check: all 9 URLs that resolve to real, unique 200 pages on the site are present in the sitemap (home, blog index, 2 posts, prompt-library, contact, status, privacy, terms). No missing pages found in the local crawl. | Info | Directory listing of `ezlaunch-landing/` matches sitemap entries 1:1 (excluding non-page assets: `assets/`, `css/`, `js/`, icons, and the `Blogs/` folder which contains only source images/text drafts, not published routes). | None. |
| 8 | Extra/orphan pages in sitemap: none found — no 404s or redirects-to-nowhere among the 9 URLs. | Info | See status table — all 9 resolve to 200. | None. |
| 9 | Missing/incomplete canonical tags: `index.html`, `prompt-library.html`, `contact.html`, `status.html`, `privacy.html`, `terms.html` have **no** `<link rel="canonical">` tag at all (only the two blog posts and blog index do, and those point to the wrong `.html` form — see #1). | Medium | `grep -i canonical` returned no match in those 6 files/pages. | Add a canonical tag to every page pointing to its own apex + clean-path URL, matching the corrected sitemap. |
| 10 | Location-page doorway quality gates (30+/50+ threshold): not applicable — site has 9 total URLs, 0 programmatic location pages. | Info | N/A | No action. |

## Corrected robots.txt

```
User-agent: *
Allow: /

Sitemap: https://ezlaunch.app/sitemap.xml
```

(Only change from current: the `Sitemap:` line now points to the apex host so it resolves in a single 200 instead of a 301.)

## Corrected Sitemap

Written to: `/Users/juliancabada/Desktop/ezlaunch-landing/ezlaunch.app-audit/sitemap-corrected.xml`
- Host normalized to apex `https://ezlaunch.app`
- Paths normalized to clean (no `.html`) form matching the actual 200 destination
- `lastmod` values preserved from the original sitemap (verified accurate for the 2 blog posts against JSON-LD `Published` dates)
- `priority` and `changefreq` removed (deprecated/ignored by Google)
- Validated well-formed with `xmllint --noout` (pass)

## Structured Findings (for audit-data.json — Sitemap category)

```json
{
  "category": "Sitemap",
  "score": 62,
  "sitemap_url": "https://ezlaunch.app/sitemap.xml",
  "url_count": 9,
  "size_bytes": 1671,
  "limits": {"max_urls": 50000, "max_size_mb": 50, "within_limits": true},
  "xml_valid": true,
  "urls": [
    {"loc": "https://www.ezlaunch.app/", "hops": 1, "final_url": "https://ezlaunch.app/", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/blog.html", "hops": 2, "final_url": "https://ezlaunch.app/blog", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/blog/deploying-ai-built-sites.html", "hops": 2, "final_url": "https://ezlaunch.app/blog/deploying-ai-built-sites", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/blog/html-websites-are-the-future.html", "hops": 2, "final_url": "https://ezlaunch.app/blog/html-websites-are-the-future", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/prompt-library.html", "hops": 2, "final_url": "https://ezlaunch.app/prompt-library", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/contact.html", "hops": 2, "final_url": "https://ezlaunch.app/contact", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/status.html", "hops": 2, "final_url": "https://ezlaunch.app/status", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/privacy.html", "hops": 2, "final_url": "https://ezlaunch.app/privacy", "final_status": 200},
    {"loc": "https://www.ezlaunch.app/terms.html", "hops": 2, "final_url": "https://ezlaunch.app/terms", "final_status": 200}
  ],
  "findings": [
    {"id": 1, "severity": "Critical", "issue": "Three-way canonical/sitemap/serving-path mismatch (www+.html vs apex+.html vs apex-clean)", "fix": "Standardize on apex + clean path everywhere"},
    {"id": 2, "severity": "High", "issue": "Every URL is a 2-hop redirect chain", "fix": "List final destination URLs directly in sitemap"},
    {"id": 3, "severity": "Medium", "issue": "robots.txt Sitemap directive points to www host (redirects)", "fix": "Point robots.txt directly to apex sitemap URL"},
    {"id": 4, "severity": "Info", "issue": "Deprecated priority/changefreq tags on all URLs", "fix": "Remove (ignored by Google)"},
    {"id": 5, "severity": "Low", "issue": "changefreq=weekly inconsistent with 15-week-stale lastmod", "fix": "Remove changefreq; keep lastmod accurate"},
    {"id": 6, "severity": "Positive", "issue": "lastmod values verified genuine via JSON-LD Published dates", "fix": "None"},
    {"id": 7, "severity": "Info", "issue": "No missing pages: crawl vs sitemap coverage is 1:1", "fix": "None"},
    {"id": 8, "severity": "Info", "issue": "No extra/orphan/404 URLs in sitemap", "fix": "None"},
    {"id": 9, "severity": "Medium", "issue": "6 of 9 pages have no canonical tag at all", "fix": "Add self-referencing canonical tags matching corrected sitemap URLs"},
    {"id": 10, "severity": "Info", "issue": "Location-page quality gates not applicable (0 location pages)", "fix": "None"}
  ]
}
```
