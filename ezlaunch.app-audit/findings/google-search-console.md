# Google Search Console — ezlaunch.app

Pulled 2026-09-14 via the Search Console API as oneezlaunch@gmail.com (property `sc-domain:ezlaunch.app`, owner). Quota project: `ezlaunch-496700` (Search Console API enabled on it today). Raw data: `gsc-inspection.json`, `gsc-totals-90d.json`, `gsc-queries-90d.json`, `gsc-pages-90d.json`.

## Sitemap
- `https://ezlaunch.app/sitemap.xml` is submitted, downloaded without errors or warnings, 9 URLs discovered, 0 reported indexed from the sitemap yet (normal within hours of a resubmission). Re-submitted 2026-09-14 after the About page was added, so the next fetch will pick up 10 URLs.
- No stale `www` sitemap was present in the property.

## Index status per page (URL Inspection API)

| URL | Coverage | Google canonical | Last crawl |
|---|---|---|---|
| / | Submitted and indexed | https://ezlaunch.app/ | 2026-09-06 |
| /blog | Submitted and indexed | https://ezlaunch.app/blog | 2026-09-06 |
| /prompt-library | Submitted and indexed | https://ezlaunch.app/prompt-library | 2026-09-10 |
| /status | Submitted and indexed | https://ezlaunch.app/status | 2026-08-23 |
| /terms | Submitted and indexed | https://ezlaunch.app/terms | 2026-09-06 |
| /blog/html-websites-are-the-future | Submitted and indexed | same | 2026-08-09 |
| /blog/deploying-ai-built-sites | **Discovered, currently not indexed** | – | never |
| /privacy | Discovered, currently not indexed | – | never |
| /about | Unknown to Google (new page) | – | never |
| /contact | Unknown to Google | – | never |

Google already treats the clean apex URLs as canonical, which confirms the Phase 1 canonical fix matched Google's own choice.

### Findings
1. **High — the best piece of content on the site is not indexed.** The 2,090-word deploy post has been discovered but never crawled. Google is deprioritizing it, most likely because it is reachable only through footer → /blog → card, with no link from the homepage body and no external links. Fix: add a "From the blog" section on the homepage linking both posts, request indexing manually in Search Console (the API cannot do this), and share the post on X/LinkedIn to create the first external links.
2. **Medium — /contact is unknown to Google** despite being in the sitemap since May and linked from every footer. Same low-priority crawl pattern. Will likely resolve after the sitemap resubmission; request indexing manually if still missing in two weeks.
3. **Info — /privacy** not indexed. Low value; fine to leave.
4. **Info — /about** is new today. Request indexing manually once.

## Search performance, last 90 days (2026-06-15 to 2026-09-11)

| Metric | Value |
|---|---|
| Clicks | 34 |
| Impressions | 161 |
| CTR | 21.1% |
| Average position | 12.6 |

**Every query with clicks is a brand query.** "ezlaunch" accounts for 16 of 34 clicks; the rest are brand misspellings with zero clicks. There are no impressions at all for "static site hosting", "deploy lovable site", "host AI generated website" or any of the target terms. This is the clearest evidence in the audit that Phase 3 content is what moves the needle: the site currently has no non-brand search footprint.

Top pages by impressions: homepage 115, docs.ezlaunch.app 57, /terms 28, /status 27, /blog 19, HTML-future post 19, /prompt-library 17. The legacy `blog.html` and `prompt-library.html` URLs still collected a few impressions; the 301s and canonicals now consolidate those.

## What was done today
- Search Console API enabled on project `ezlaunch-496700`; user credentials stored locally in gcloud application-default credentials on this Mac.
- Sitemap re-submitted.
- Full inspection and performance snapshot saved for drift comparison on the next audit.

## Manual follow-ups (no API exists for these)
- In Search Console, use URL Inspection → Request Indexing for `/blog/deploying-ai-built-sites` and `/about`.
