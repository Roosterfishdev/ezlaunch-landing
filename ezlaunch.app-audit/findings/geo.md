# GEO / AI Search Readiness Audit — ezlaunch.app

Audited: 2026-09-13 · Live domain: https://ezlaunch.app (canonical apex; www.ezlaunch.app 301s to apex)

## Score

| | Score |
|---|---|
| **AI Search Readiness (overall, weighted)** | **54 / 100** |
| Citability | 55 / 100 (weight 25%) |
| Structural Readability | 60 / 100 (weight 20%) |
| Multi-Modal Content | 35 / 100 (weight 15%) |
| Authority & Brand Signals | 40 / 100 (weight 20%) |
| Technical Accessibility | 75 / 100 (weight 20%) |

Weighted calc: 0.25(55) + 0.20(60) + 0.15(35) + 0.20(40) + 0.20(75) = **54**

### Platform-specific estimate

| Platform | Est. score | Why |
|---|---|---|
| Google AI Overviews | ~45/100 | Crawlable and fast, but no Organization/FAQ/Product schema and no About/entity page — Google leans hard on structured entity data and Knowledge Graph presence, both weak here. llms.txt is irrelevant to Google. |
| ChatGPT (browsing + training corpus) | ~60/100 | Fully open to GPTBot/OAI-SearchBot, static HTML (no JS gate), and the comparison table + named-competitor pricing in the "Deploying Sites…" post is exactly the kind of structured, quotable fact-block ChatGPT favors. |
| Perplexity | ~58/100 | PerplexityBot unblocked, byte-identical response verified. Benefits from the same table/list content and outbound citations to Netlify/Vercel/Cloudflare/GitHub Pages, which reads as corroborated rather than self-promotional. |
| Bing Copilot | ~50/100 | Depends on Bing indexation of a low-authority domain; same schema gaps as Google hurt entity-card eligibility, but static HTML and open robots.txt help baseline indexing. |

## AI Crawler Access Status

Verified live with UA-spoofed curl requests against `https://ezlaunch.app/`:

| Crawler | HTTP status | Notes |
|---|---|---|
| GPTBot | 200 | Allowed, byte-identical (51,441 bytes) to browser UA — no cloaking |
| ClaudeBot | 200 | Allowed, byte-identical |
| PerplexityBot | 200 | Allowed, byte-identical |
| Googlebot / Google-Extended | 200 | Allowed |
| Bytespider | 200 | Allowed |
| CCBot | 200 | Allowed (site does not opt out of the "optional block" list) |
| Plain browser UA | 200 | Baseline for comparison |

`robots.txt` (both apex and www):
```
User-agent: *
Allow: /

Sitemap: https://www.ezlaunch.app/sitemap.xml
```
No AI-specific `User-agent` blocks, no `Crawl-delay`. Fully open — this is correct for GEO visibility, but it also means CCBot/anthropic-ai/cohere-ai (training-only crawlers many sites choose to block) are currently allowed by default; that's a deliberate-or-not choice worth confirming with the team.

Site is **static HTML served with no JS dependency** for content — confirmed by comparing raw `curl` output across all bot UAs (identical byte counts) and by inspecting source: all copy, pricing, and blog text is present in the initial HTML response. Response headers (`vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch`, `x-middleware-rewrite: /api/serve/custom/index.html`, `via: 1.1 Caddy`) indicate the custom domain is served through a Next.js middleware rewrite behind Caddy, but the actual output delivered to any client, bot or human, is plain static HTML. No SSR/CSR risk for AI crawlers.

## llms.txt Status

**Missing (404)** on both `https://ezlaunch.app/llms.txt` and `https://www.ezlaunch.app/llms.txt` (the www request 301s to apex first, then 404s). No RSL 1.0 licensing file found either. Draft provided below (optional — Google does not use llms.txt; it primarily helps LLM-agent browsing/citation tools and some ChatGPT/Perplexity crawlers that check for it).

## Citability Analysis (passage-level)

Checked homepage + both blog posts against the 134–167 word optimal-citation window, answer-first structure, lists/tables, and self-containment.

- **Homepage (`/`)**: Essentially **zero long-form prose**. A regex scan of all `<p>` content found no paragraph over ~15 words outside the hero subheadline. Content is feature-card microcopy (10–20 word fragments: "Upload a ZIP or push to GitHub. Your site is live before you finish your coffee.") — good for human scanning, but there is no self-contained "What is EZLaunch" definitional paragraph an AI engine could lift as a direct answer to "What is EZLaunch?" The only place that sentence exists is the `<meta name="description">` tag, which AI crawlers can use but which is not a citable on-page passage.
- **Blog: "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit"** — the strongest citability asset on the site: 25 substantive paragraphs, one full comparison **table** (GitHub Pages / Cloudflare Pages / Netlify / Vercel / EZLaunch by price and features), two **bulleted lists** (caveats, decision path), specific dollar figures ($5/mo, $9/mo, $20/mo, $19/mo), and named entities (Netlify, Vercel, Cloudflare, GitHub Pages, Next.js, Supabase). This is exactly the shape of content Perplexity/ChatGPT lift into comparison answers. Only 1 of 25 paragraphs falls in the 134–167 word "optimal" band (most run 30–80 words — punchy but sub-optimal for single-passage extraction).
- **Blog: "Static HTML Websites Are Not Just the Present — They're the Future"** — good H2 structure (5 numbered arguments + conclusion), one library-name list (Three.js, GSAP, D3.js, etc.), but shorter paragraphs (median ~40 words) and 0 of 20 paragraphs in the optimal band. No stats cited with sources (claims like "static HTML sites are more secure" and "you can get a solid hosting plan for $3–5/month" are asserted without attribution).
- **No FAQ blocks, no question-phrased H2/H3 headings anywhere on the site.** Headings are declarative ("Cost and best use at a glance," "How the output differs by tool") rather than matching natural chat queries ("What's the cheapest way to host an AI-generated website?").
- **Prompt Library (`/prompt-library`) is 100% content-gated.** The raw HTML served to every crawler (verified via curl with GPTBot/ClaudeBot/PerplexityBot UAs) contains only an email-capture form; the actual prompt content lives in a `<section ... hidden aria-hidden="true">` populated client-side only after email submission. This is a real page of exactly the kind of content ("give me a prompt to build X") that ChatGPT/Perplexity users query for, and it is completely invisible to every AI crawler.

**Citability score: 55/100** — the two blog posts are genuinely strong (table + lists + named facts), dragged down by a homepage with no citable prose and a prompt library page with zero indexable content.

## Authority & Brand Signals

**On-page entity clarity:**
- What EZLaunch is: reasonably clear from H1/subheadline/meta description ("Host your static HTML website in seconds... SSL, analytics, SEO optimization and forms included"), footer tagline ("Static hosting for AI-generated websites"), and repeated across blog posts — but never as one dedicated, quotable "About" statement.
- Who makes it: only signal is `<meta name="author" content="Julian Cabada">` and blog byline "Julian Cabada" — no About/Team page, no company legal name beyond "EZLaunch," no founding date beyond copyright "© 2026."
- Where it's based: **not stated anywhere** on the site (no address, no jurisdiction — relevant for trust signals and Perplexity's location-aware answers).
- Pricing: clearly stated in plain HTML text (Free $0, Starter $5/mo, Pro $10/mo, Agency $19/mo, with feature rows) — good, this is citable, but not marked up as `Product`/`Offer` schema.

**Structured data:** Only the two blog posts carry `Article` JSON-LD (headline, description, image, datePublished, author, publisher). **No Organization, WebSite, Product/Offer, BreadcrumbList, or FAQPage schema anywhere** — homepage, blog index, contact, status, prompt-library, privacy, and terms all have zero JSON-LD.

**Off-site brand mentions** (checked via WebFetch against GitHub, Product Hunt, Bing, DuckDuckGo, X; general web search engines largely blocked automated fetch with CAPTCHA/bot walls, so these results should be treated as directional, not exhaustive):
- **GitHub**: `github.com/Roosterfishdev/ezlaunch-cli` exists, MIT-licensed, minimal README ("Deploy static sites to EZLaunch from your terminal"), 0 stars — a real but very weak signal.
- **Product Hunt**: No listing found ("No products found for 'ezlaunch'").
- **X/Twitter**: `@EZlaunchapp` is linked consistently from 9 of 9 pages' footers, but `status.html` additionally contains a stray, inconsistent reference to `https://x.com/ezlaunch` (different handle) in its "follow for updates" callout — a small but real entity-inconsistency signal. Could not verify live profile content (fetch blocked, HTTP 402).
- **LinkedIn**: Company page `linkedin.com/company/ezlaunchapp/` linked in footer; content unverifiable via automated fetch.
- **Facebook**: Page linked in footer; unverified.
- **Reddit**: No mentions found within tooling limits (search engines blocked automated queries); no evidence either way.
- **YouTube**: **No channel or video linked anywhere on the site.** Per the brand-correlation data in this framework, YouTube presence is the single strongest correlate with AI citation (~0.737) — its total absence here is notable.
- **Wikipedia**: None (expected for an early-stage SaaS; not itself a penalty, but means AI engines have no independent entity corroboration).

**Authority & Brand score: 40/100** — real author identity and a genuine (if tiny) GitHub/social footprint, but no structured entity data, no About/location info, no FAQ, no YouTube, no Product Hunt, and one inconsistent social handle.

## Findings (severity / evidence / fix)

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| 1 | **Critical** | Prompt Library page has zero crawlable content — entirely email-gated | `prompt-library.html` raw HTML: gate form only; `<section id="prompt-library" ... hidden aria-hidden="true">` with empty `#prompt-grid` populated by JS after email submit. Confirmed identical for GPTBot/ClaudeBot/PerplexityBot UAs. | Server-render at least a public subset of prompts (10–15) as static text/HTML; keep email-gate only for bulk export or "copy all" convenience. This page is high-intent content for exactly the queries AI assistants get asked. |
| 2 | **High** | No structured data (JSON-LD) for Organization, WebSite, Product/Offer, or FAQ anywhere except two blog Article schemas | `grep` for `application/ld+json` across all 9 live pages returns hits only in the two blog post files. | Add sitewide `Organization` schema (name, url, logo, `sameAs`: X, LinkedIn, Facebook, GitHub) plus `Product`/`Offer` schema for the 4 pricing tiers on the homepage. |
| 3 | **High** | `/llms.txt` missing (404) | `curl -o /dev/null -w "%{http_code}" https://ezlaunch.app/llms.txt` → 404 | Publish `/llms.txt` at the apex (draft below). Optional/low-cost; note it has no effect on Google. |
| 4 | **Medium** | Homepage has no self-contained "What is EZLaunch" answer paragraph | Regex scan of all `<p>` text in `index.html` found no paragraph over ~15 words; product definition only lives in `<meta name="description">`. | Add one visible 120–150 word paragraph near the hero or in an "About" strip stating what EZLaunch is, who it's for, and what's included — written as a single self-contained, quotable block. |
| 5 | **Medium** | No FAQ content or FAQPage schema anywhere on the site | Sitewide grep for "FAQ"/"Frequently" returns no matches. | Add a 6–8 question FAQ section to the homepage (pricing, custom domains, framework support, AI editor, SEO tool) with FAQPage JSON-LD — one of the highest-leverage, lowest-effort GEO changes available. |
| 6 | **Medium** | Sitemap + canonical tags create a double-redirect chain instead of pointing at final canonical URLs | `sitemap.xml` lists `https://www.ezlaunch.app/blog/deploying-ai-built-sites.html`; `curl -sIL` on that URL shows www→apex `.html` (301) → apex clean path (301) → 200. On-page `<link rel="canonical">` itself points at the apex `.html` URL, which still 301s once more. | Regenerate `sitemap.xml` with final clean-path apex URLs (`https://ezlaunch.app/blog/deploying-ai-built-sites`, no `www`, no `.html`) and update all `canonical` tags to match exactly the URL that returns 200. |
| 7 | **Low** | Blog paragraphs skew well below the 134–167 word optimal-citation length | Word-count scan: "Deploying Sites…" post has 1/25 paragraphs in the 134–167 range (median ~50 words); "HTML Websites…" has 0/20 (median ~42 words). | For the opening definition and "bottom line" section of each post, expand to one dense, self-contained 130–160 word paragraph that fully answers the heading without requiring surrounding context. |
| 8 | **Low** | H2/H3 headings are declarative, not phrased as questions | E.g. "Cost and best use at a glance," "How the output differs by tool" vs. a phrasing like "What's the cheapest way to host an AI-generated site?" | Rewrite 3–4 key H2s per post as natural-language questions matching likely chat/search queries; keep one direct-answer sentence immediately under each. |
| 9 | **Low** | Inconsistent brand handle: one page links a different/wrong X account | `status.html` line ~118 links `https://x.com/ezlaunch`; every other page (8/9) links `https://x.com/EZlaunchapp`. | Fix the stray link in `status.html` to `https://x.com/EZlaunchapp`. |
| 10 | **Low** | No video/YouTube presence anywhere on the site | Sitewide grep for youtube/video embeds returns nothing; footer social links are X, Facebook, LinkedIn only. | Publish a short (60–120s) product demo/tutorial to YouTube and link/embed it on the homepage and in the "Deploying Sites…" post — YouTube mentions correlate most strongly (~0.737) with AI citation per available benchmark data. |

### What's already working well

- robots.txt fully open to GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers, with no crawl-delay and no cloaking (byte-identical responses verified across all UAs).
- 100% static HTML delivery — no JavaScript dependency for content, which removes the single biggest technical-accessibility risk for AI crawlers that don't render JS.
- Both blog posts have real authorship (`Julian Cabada`), publish dates, canonical tags, Open Graph/Twitter cards, and `Article` JSON-LD with `author`/`publisher`.
- The "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit" post has an excellent comparison table and decision-path lists — genuinely strong, citation-ready structured content.
- Pricing is plain, crawlable HTML text (not an image or JS widget), so AI engines can already read and quote it today.
- Consistent social presence linked from every page footer (X, Facebook, LinkedIn) and a real, MIT-licensed GitHub CLI repo.

## Recommended `/llms.txt` draft

Note: Google does not use `llms.txt` for AI Overviews or Search; this primarily helps ChatGPT/Perplexity-style agentic browsing and any tooling that checks for it. Low effort, no downside — safe to ship.

```markdown
# EZLaunch

> Static hosting for AI-generated websites. Drop a ZIP or connect GitHub and get
> a live site in seconds, with free SSL, built-in analytics, working forms, an
> AI SEO optimizer, and an AI-powered in-browser editor. Works with sites built
> by Claude Code, Cursor, Bolt, Lovable, Replit, v0, ChatGPT, and Windsurf.
> Free to start; paid plans from $5/month.

## Product
- [Homepage](https://ezlaunch.app/): Features, how it works, and pricing (Free $0,
  Starter $5/mo, Pro $10/mo, Agency $19/mo).
- [Prompt Library](https://ezlaunch.app/prompt-library): Copy-ready AI prompts for
  landing pages, deploys, SEO, and forms, for Claude Code, Cursor, Bolt, and v0.
- [Status](https://ezlaunch.app/status): Live operational status for hosting/CDN,
  dashboard, form submissions, analytics, API, and CLI.
- [Contact](https://ezlaunch.app/contact): Support contact form, typical
  response time 24 hours.

## Blog
- [Blog index](https://ezlaunch.app/blog)
- [Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit](https://ezlaunch.app/blog/deploying-ai-built-sites):
  How to deploy an AI-generated website depending on what the tool actually
  output, and how EZLaunch compares to Netlify, Vercel, Cloudflare Pages, and
  GitHub Pages on price and included features.
- [Static HTML Websites Are Not Just the Present — They're the Future](https://ezlaunch.app/blog/html-websites-are-the-future):
  Why plain static HTML sites are cheap, fast, secure, and design-unlimited,
  especially now that AI tools write the code.

## Optional
- [Docs](https://docs.ezlaunch.app)
- [CLI on GitHub](https://github.com/Roosterfishdev/ezlaunch-cli)
- [Terms](https://ezlaunch.app/terms)
- [Privacy](https://ezlaunch.app/privacy)
```

---

## Structured findings (for audit-data.json — AI Search Readiness category)

```json
{
  "category": "AI Search Readiness",
  "overall_score": 54,
  "dimensions": {
    "citability": 55,
    "structural_readability": 60,
    "multi_modal_content": 35,
    "authority_brand_signals": 40,
    "technical_accessibility": 75
  },
  "ai_crawler_access": {
    "GPTBot": "allowed_200",
    "ClaudeBot": "allowed_200",
    "PerplexityBot": "allowed_200",
    "Googlebot": "allowed_200",
    "Bytespider": "allowed_200",
    "CCBot": "allowed_200",
    "cloaking_detected": false
  },
  "llms_txt_status": "missing_404",
  "rsl_licensing_status": "missing",
  "findings": [
    {"id": 1, "severity": "critical", "title": "Prompt Library page fully email-gated, zero crawlable content", "url": "https://ezlaunch.app/prompt-library"},
    {"id": 2, "severity": "high", "title": "No Organization/WebSite/Product/FAQ schema sitewide", "url": "https://ezlaunch.app/"},
    {"id": 3, "severity": "high", "title": "/llms.txt missing (404)", "url": "https://ezlaunch.app/llms.txt"},
    {"id": 4, "severity": "medium", "title": "Homepage lacks a self-contained definitional 'what is EZLaunch' paragraph", "url": "https://ezlaunch.app/"},
    {"id": 5, "severity": "medium", "title": "No FAQ section or FAQPage schema anywhere on the site", "url": "https://ezlaunch.app/"},
    {"id": 6, "severity": "medium", "title": "Sitemap and canonical tags create a double-redirect chain instead of final URLs", "url": "https://ezlaunch.app/sitemap.xml"},
    {"id": 7, "severity": "low", "title": "Blog paragraphs mostly shorter than the 134-167 word optimal AI-citation length", "url": "https://ezlaunch.app/blog/deploying-ai-built-sites"},
    {"id": 8, "severity": "low", "title": "H2/H3 headings are declarative rather than question-phrased", "url": "https://ezlaunch.app/blog"},
    {"id": 9, "severity": "low", "title": "Inconsistent X/Twitter handle linked on status page", "url": "https://ezlaunch.app/status"},
    {"id": 10, "severity": "low", "title": "No YouTube/video presence anywhere on site or off-site", "url": "https://ezlaunch.app/"}
  ],
  "brand_mentions": {
    "github": {"found": true, "url": "https://github.com/Roosterfishdev/ezlaunch-cli", "strength": "weak"},
    "product_hunt": {"found": false},
    "x_twitter": {"found": true, "handle": "@EZlaunchapp", "verified_content": false},
    "linkedin": {"found": true, "url": "https://www.linkedin.com/company/ezlaunchapp/", "verified_content": false},
    "facebook": {"found": true, "verified_content": false},
    "reddit": {"found": false, "confidence": "low - search tooling blocked"},
    "youtube": {"found": false},
    "wikipedia": {"found": false}
  }
}
```
