# Content Quality Audit — ezlaunch.app

**Content Quality Score: 48 / 100**

Scope: 9 pages (index, blog index, 2 blog posts, prompt-library, contact, status, privacy, terms). Analyzed from local HTML snapshots in `live-html/` using `extracted_text`-equivalent (script/style stripped) word counts and stdlib readability estimation.

## E-E-A-T Breakdown

| Factor | Weight | Score /100 | Weighted |
|---|---|---|---|
| Experience | 20% | 35 | 7.0 |
| Expertise | 25% | 55 | 13.75 |
| Authoritativeness | 25% | 30 | 7.5 |
| Trustworthiness | 30% | 55 | 16.5 |
| **Total** | | | **44.75 ≈ 45** |

(Content Quality Score of 48 blends this E-E-A-T composite with word-count/thin-content and AI-citation-readiness factors below.)

---

## Findings

### 1. No customer proof anywhere on the site (Experience / Authoritativeness)
- **Severity:** High
- **Evidence:** `index.html` has zero testimonials, customer logos, case studies, or usage stats. Hero copy only says "Join developers already hosting on EZLaunch" — no names, logos, or numbers. `grep -il 'testimonial|customer|case study|trusted by' index.html` returns nothing.
- **Fix:** Add at least a customer-logo strip, a numeric proof point ("X sites deployed"), or 2–3 short testimonials with attributable names/handles. This is the single highest-leverage E-E-A-T fix for a SaaS homepage.

### 2. No About/company page or team information (Authoritativeness)
- **Severity:** High
- **Evidence:** No `about.html` exists; nav and footer never link to a company/team page. The only entity disclosure is a one-line mention buried in `privacy.html`/`terms.html`: *"operated by Jaguar Hosting LLC, a company registered in Wyoming, USA."* No founder names, no team, no company story, no physical address, no phone number.
- **Fix:** Publish a short About/Company page — who built EZLaunch, why, founder bio/LinkedIn — and link it from the footer. Add a mailing address (Wyoming registered-agent address is acceptable) to satisfy trust-page expectations.

### 3. Status page shows stale, hard-coded data contradicting its own "real-time" claim (Trustworthiness)
- **Severity:** Medium
- **Evidence:** `status.html` reads "All systems operational … No incidents reported in the last 90 days … For real-time updates, follow @ezlaunch on X … Last updated: May 2026." Today is 2026-09-13 — the page is ~4 months stale despite implying live status.
- **Fix:** Wire the status page to a real monitoring feed (e.g., a hosted status-page tool) or remove the "real-time" framing and clearly label it as a manually-updated page with an honest last-checked date.

### 4. Blog has only 2 posts, most recent ~3.5 months old, and no visible update/freshness signal beyond original publish date
- **Severity:** Medium
- **Evidence:** `blog_deploying-ai-built-sites.html` datePublished 2026-06-03; `blog_html-websites-are-the-future.html` datePublished 2026-05-19. Neither JSON-LD `Article` block nor visible byline includes a `dateModified`/"updated" date. Blog index (`blog.html`) is only 173 words of template chrome, no other content.
- **Fix:** Add a publishing cadence (aim for monthly+), include `dateModified` in schema when posts are revised, and consider adding a "last reviewed" line for evergreen technical claims (hosting comparisons age quickly).

### 5. "Static HTML Websites Are the Future" post has zero outbound citations for its claims (Expertise/Authoritativeness)
- **Severity:** Medium
- **Evidence:** Link extraction of the article body found only one link (the internal CTA to `/signup`). Claims like "no SQL injection… no server-side code… attack surface is dramatically smaller" are asserted without a linked source (e.g., OWASP, CVE data, a security report).
- **Fix:** Add 2–4 outbound citations to authoritative sources (security reports, Core Web Vitals data, HTTP Archive stats) to substantiate technical claims — this is a direct, low-effort authoritativeness lift and improves AI-citation trust (LLMs weight sourced claims higher).

### 6. Prompt Library promises content the crawler can never see (thin/cloaking-adjacent content)
- **Severity:** High
- **Evidence:** `prompt-library.html` title/meta promise "Copy-ready AI prompts for landing pages, deploy, SEO, forms, and static sites," but the extracted text is only ~110 words of UI chrome ("Enter your email to view prompts… Unlock library…"). The actual prompts are gated behind an email-capture form and are not present in the static HTML at all — Google (and any LLM crawler) indexes a page whose visible/crawlable content does not match its promoted topic.
- **Fix:** Render at least a representative sample of prompts (3–5 full prompts) server-side/statically so crawlers can index real content, and gate only the *full* library behind email capture. This also fixes the page's thin-content problem (currently ~110 words vs. no stated minimum for this resource-page type, but well below what the title promises).

### 7. Blog index, Status, Contact, and Prompt Library pages are thin
- **Severity:** Medium
- **Evidence:** Word counts (extracted text): blog index 173, prompt-library 119 (110 measured), status 103 (94 measured), contact 219. None of these meet typical topical-coverage floors for their page type (this skill's guideline uses word count only as a floor signal, not a target).
- **Fix:** These are largely utility pages, so word count alone isn't the fix — but each is missing content that would legitimately add depth: Contact could add an FAQ ("How fast is support?", "Do you offer phone support?"); Status could add an uptime history table/SLA statement; Blog index could add short topic-cluster descriptions instead of just teaser cards.

### 8. Two long-form blog posts pass E-E-A-T basics reasonably well
- **Severity:** Info (positive finding)
- **Evidence:** Both posts have a visible byline ("Julian Cabada"), a visible publish date, `Article` JSON-LD with `author`/`datePublished`/`publisher`, a descriptive alt-texted hero image, and (for the deploying-sites post) 15+ outbound links to real named competitor tools (Netlify, Vercel, Cloudflare Pages, GitHub Pages, Replit, Lovable, Bolt) — showing genuine comparative research rather than generic AI filler.
- **No fix needed** — use this as the template for future posts; extend the citation pattern from Finding 5 to the second post.

### 9. Readability is appropriate for the audience
- **Severity:** Info
- **Evidence:** Stdlib Flesch Reading Ease estimate: "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit" ≈ 63.3 (avg 16.6 words/sentence); "Static HTML Websites Are Not Just the Present" ≈ 64.0 (avg 11.6 words/sentence). Both land in the "Plain English / Standard" band (60–70), appropriate for a developer/technical-marketing audience — not overly simplified (a common AI-slop tell) nor needlessly dense.
- **No fix needed.**

### 10. AI citation readiness is weak — no FAQ, no pricing/product structured data
- **Severity:** Medium
- **Evidence:** `grep -il 'faq|frequently asked' *.html` returns nothing across all 9 pages. The pricing section on the homepage (4 tiers, clear feature rows) is marked up as plain `<div>`s with no `Product`/`Offer`/`priceSpecification` schema, and no `Organization`/`SoftwareApplication` JSON-LD exists anywhere on the site (only the two blog posts have `Article` schema). This makes it harder for AI answer engines to confidently extract and cite "EZLaunch Pro is $10/month" or answer "What is EZLaunch?" verbatim.
- **Fix:** Add `Organization` schema (site-wide) and `Product`/`Offer` schema for the four pricing tiers; add a short FAQ block (3–5 Q&As: "What is EZLaunch?", "Can I use my own domain?", "Does it work with Claude Code/Cursor/Bolt output?") with `FAQPage` schema on the homepage.

### 11. AI-generated-content quality check: no red flags found
- **Severity:** Info
- **Evidence:** Copy is specific to the product (real feature names: "data-ezlaunch form attribute," "CLI," actual CLI commands shown), not generic filler. No repetitive templated paragraphs across pages beyond expected legal/nav boilerplate. No detected factual inaccuracies in the reviewed technical claims.
- **No fix needed**, but the lack of citations (Finding 5) and lack of first-hand proof (Finding 1) are the deeper substance behind why this content doesn't yet reach "genuine E-E-A-T" despite being competently written.

---

## Word Counts vs. Page-Type Floors (informational — floors are topical-coverage signals, not targets)

| Page | Words | Page Type | Typical Floor | Status |
|---|---|---|---|---|
| Homepage | 668 | Homepage | 500 | Meets floor |
| Blog index | 173 | Index/hub | n/a | Thin (template-only) |
| Prompt Library | 119 | Resource/product-adjacent | 300+ | Below floor, and gated |
| Status | 103 | Utility | n/a | Thin |
| Contact | 219 | Utility | n/a | Adequate for intent |
| Deploying AI-built sites (post) | 2,090 | Blog post | 1,500 | Exceeds floor |
| HTML websites are the future (post) | 1,176 | Blog post | 1,500 | Below floor |
| Privacy | 702 | Legal | n/a | Adequate |
| Terms | 810 | Legal | n/a | Adequate |
