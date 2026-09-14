# On-Page SEO Audit — ezlaunch.app

**On-Page SEO Score: 58 / 100**

## Per-Page Title / Description / H1

| Page | Title (chars) | Meta Description (chars) | H1 |
|---|---|---|---|
| index.html | "EZLaunch — Static Hosting for AI-Generated Websites" (51) | "Host your AI-generated website in seconds. Drop a ZIP or connect GitHub. SSL, analytics, and forms included. Free to start." (123) | "Host your static HTML website in seconds." |
| blog.html | "Blog — EZLaunch" (15) | "Insights on static hosting, AI-built websites, and shipping faster with HTML, CSS, and JavaScript." (98) | "Ideas for builders shipping on the web" |
| blog/deploying-ai-built-sites.html | "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit — EZLaunch Blog" (83) | "A practical, honest guide to deploying AI-generated websites: how output differs by tool, your hosting options compared, and how to pick the right one." (151) | "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit" |
| blog/html-websites-are-the-future.html | "Static HTML Websites Are Not Just the Present — They're the Future — EZLaunch Blog" (82) | "Why plain HTML websites are cheap, fast, secure, and unlimited in design — and why AI makes them the smartest way to build most sites today." (140) | "Static HTML Websites Are Not Just the Present — They're the Future" |
| prompt-library.html | "Prompt Library — EZLaunch" (25) | "Copy-ready AI prompts for landing pages, deploy, SEO, forms, and static sites — free prompt library for EZLaunch builders." (122) | "Prompt Library" |
| contact.html | "Contact — EZLaunch" (18) | "Contact EZLaunch support — we typically respond within 24 hours." (64) | "Get in touch" |
| status.html | "Status — EZLaunch" (17) | "EZLaunch system status — current operational status of all services." (68) | "System Status" |
| privacy.html | "Privacy Policy — EZLaunch" (25) | "EZLaunch Privacy Policy — how we collect, use, and protect your data." (69) | "Privacy Policy" |
| terms.html | "Terms of Service — EZLaunch" (27) | "EZLaunch Terms of Service — rules for using our static hosting platform." (72) | "Terms of Service" |

All titles and descriptions are unique across the 9 pages (no duplication). All pages have exactly one H1, and heading hierarchy (H2→H3) is sequential with no skipped levels on every page checked (index.html: H1→H2→H3 pattern throughout; legal pages use H1→H2 only).

---

## Findings

### 1. Canonical tags missing on 6 of 9 pages, including the homepage
- **Severity:** High
- **Evidence:** `grep -c 'rel="canonical"'` returns 0 for `index.html`, `contact.html`, `privacy.html`, `prompt-library.html`, `status.html`, and `terms.html`. Only the blog index and the two blog posts have a canonical link.
- **Fix:** Add a self-referencing `<link rel="canonical">` to every page, especially the homepage, to prevent duplicate-content ambiguity from trailing-slash, `www`, or query-parameter variants.

### 2. Blog index has mismatched og:title vs. `<title>`
- **Severity:** Medium
- **Evidence:** `blog.html` `<title>` is "Blog — EZLaunch" while its `og:title` is "EZblog — EZLaunch" — inconsistent branding token ("EZblog" vs "Blog") between what search engines show in SERPs and what social platforms show when the page is shared.
- **Fix:** Align `og:title` with `<title>` (either both "Blog — EZLaunch" or both "EZblog — EZLaunch"); pick one brand treatment for the blog section and use it consistently in `<title>`, `og:title`, `twitter:title`, and the visible H1/eyebrow.

### 3. Two blog post titles exceed safe SERP display length
- **Severity:** Medium
- **Evidence:** "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit — EZLaunch Blog" is 83 characters; "Static HTML Websites Are Not Just the Present — They're the Future — EZLaunch Blog" is 82 characters. Both will likely truncate in Google's ~580px SERP title display (roughly 60 char budget).
- **Fix:** Shorten to primary keyword-bearing phrase and drop the "— EZLaunch Blog" suffix or move brand to the end only when space allows, e.g. "Deploying AI-Built Sites: ChatGPT, Claude, Bolt & Replit Compared — EZLaunch".

### 4. Prompt Library page's promoted content is invisible to crawlers
- **Severity:** High
- **Evidence:** Title/meta promise "Copy-ready AI prompts for landing pages, deploy, SEO, forms, and static sites," but the actual prompts are gated behind an email-capture form and are not present anywhere in the static HTML (extracted text ≈110–119 words of UI chrome only: "Enter your email to view prompts… Unlock library…"). Search engines cannot index the content the page is optimized to rank for.
- **Fix:** Render a representative sample of prompts (3–5 full examples) statically/server-side so the promoted keyword content is actually crawlable; keep the full library gated if desired.

### 5. Target keywords from `<meta name="keywords">` don't appear in visible homepage copy
- **Severity:** Low
- **Evidence:** The (SEO-irrelevant but revealing) `<meta name="keywords">` on `index.html` lists "AI website hosting, Claude Code hosting, Cursor hosting, deploy HTML" — none of these exact phrases occur anywhere in the visible body text (checked via word-count grep); the page instead naturally uses "static HTML website," "AI-generated website," and lists tool logos (Claude, Cursor, Bolt, v0, Windsurf, Kimi, Replit, Lovable) with empty `alt=""` attributes, so the tool names exist only as image `title` attributes, not indexable text.
- **Fix:** Add a sentence near the logos strip that names the supported tools in text (e.g., "Works with Claude Code, Cursor, Bolt, v0, Windsurf, Replit, Lovable, and Kimi") and/or give the logo images descriptive `alt` text instead of `alt=""`, so the keyword intent implied by the meta-keywords tag is actually backed by crawlable, natural on-page copy.

### 6. No structured data for Organization, Product/pricing, or FAQ
- **Severity:** Medium
- **Evidence:** JSON-LD (`application/ld+json`) exists only on the two blog posts (`Article` schema). The homepage's 4-tier pricing table and value proposition have no `Organization`, `SoftwareApplication`, `Product`/`Offer`, or `FAQPage` schema.
- **Fix:** Add site-wide `Organization` schema plus `Offer` schema for each pricing tier, and add a short FAQ block with `FAQPage` schema to the homepage to improve rich-result and AI-citation eligibility.

### 7. Internal linking: blog posts and Prompt Library reachable only via footer, not top nav
- **Severity:** Low
- **Evidence:** Main nav (`nav__links`) on every page only contains Features / How it works / Pricing — Blog and Prompt Library are footer-only links (`href="/blog"`, `href="/prompt-library"`). Not orphaned (both are linked from the homepage footer and from `blog.html`), but they receive weaker internal PageRank/anchor signal than a primary-nav placement would provide.
- **Fix:** Consider adding "Blog" to primary nav if content marketing is a growth channel, or accept the current footer-only placement if blog is a secondary priority — no orphan-page issue exists today.

### 8. Positive: title/description are unique per page, single H1 per page, clean heading order
- **Severity:** Info
- **Evidence:** No duplicate `<title>` or meta description values found across the 9-page set; every page has exactly one `<h1>`; H2→H3 nesting on index.html and both blog posts follows correct sequential order with no skipped levels.
- **No fix needed.**
