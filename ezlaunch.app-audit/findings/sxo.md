# SXO (Search Experience Optimization) Audit — ezlaunch.app

**SXO Gap Score: 45 / 100** (separate from SEO Health Score — measures how well the page(s) deliver on searcher intent and journey, not crawlability/technical SEO)

Method note: `claude-seo run` managed runtime was unavailable in this environment. Pages were
read directly from local rendered HTML at
`/Users/juliancabada/Desktop/ezlaunch-landing/ezlaunch.app-audit/live-html/` (index, two blog
posts, prompt-library, contact, status, privacy, terms), plus `python3` stdlib for word counts.
SERP analysis used WebSearch (not a full top-10 SERP scraper — see Limitations).

---

## Lead Finding: Page-Type / Query-Intent Mismatch — CRITICAL

EZLaunch's own meta keywords explicitly target **"Claude Code hosting"** and **"Cursor hosting"**
as exact phrases, and the homepage logo marquee visually name-checks Claude Code, Cursor, Bolt, v0,
Windsurf, Kimi, Replit, and Lovable. But **zero pages on the site have a URL, `<title>`, or `<h1>`
built around any single one of these tool names.** Meanwhile, the actual SERPs for these exact
tool+hosting queries are dominated by competitors that *do* have dedicated pages:

- "Claude Code hosting deploy site" → Hostinger `/web-apps-hosting/claude-code-hosting`, xCloud
  `/claude-code-hosting/`, websitesetup.org tutorial, Wix blog post, Medium tutorial
- "deploy Bolt.new site free hosting" → DeployHQ `/guides/bolt`, Hostinger `/bolt-hosting`,
  HTMLPub blog, VibeNest `/bolt-hosting`, livemy.app blog
- "how to deploy a Lovable site" → Netlify's own `/guides/deploy-lovable-site-to-netlify`,
  Lovable's own docs `/features/publish`, DeployHQ `/guides/lovable`, Supadrop blog, OVHcloud docs

100% of the results for these three queries are dedicated single-tool landing/tutorial pages —
not homepages, not generic feature pages. EZLaunch's homepage (a general product landing page) is
the wrong page type to compete for this traffic, and there is currently **no other page on the
domain** that could. This is the single biggest missed-traffic opportunity on the site, because
these are the exact users EZLaunch is built for (someone who just finished a Claude Code / Bolt /
Lovable build and is looking for where to host it).

---

## SERP Intent Table

| # | Query | Dominant SERP page type(s) | Notable competitors seen | EZLaunch page that could compete | Mismatch severity |
|---|---|---|---|---|---|
| 1 | static site hosting | Comparison/listicle (~45%), product landing pages (~40%), review sites | Tiiny Host, static.app, Crystallize (roundup), GrayGrids (roundup), Sevalla | Homepage (product LP) — type matches for the product-page share only, no listicle asset | MEDIUM |
| 2 | host AI generated website | How-to guide/tutorial (~50%), niche product "use-case" pages (~40%) | BugSmash, GeminiLaunch (direct competitor, "compared" post), Linkyhost (direct competitor use-case page), Base44, InMotion Hosting tutorial | Homepage — pitches the product but has no comparison/guide depth to match the format | HIGH |
| 3 | deploy html website free | Product landing pages (~55%), listicles (~30%), YouTube tutorial | Netlify, Vercel, Cloudflare Pages, GitHub Pages, Tiiny Host, static.app, Linkyhost | Homepage — type matches (product LP) but thin vs. named competitors, no comparison table | MEDIUM |
| 4 | how to deploy a Lovable site | Dedicated per-tool tutorial/guide pages (100%) | Netlify (own Lovable guide), Lovable docs, DeployHQ `/guides/lovable`, Supadrop blog, OVHcloud docs | **None** — no EZLaunch page exists for this query | CRITICAL |
| 5 | deploy Bolt.new site free hosting | Dedicated per-tool tutorial/guide pages (100%) | DeployHQ `/guides/bolt`, Hostinger `/bolt-hosting`, HTMLPub, VibeNest, livemy.app | **None** | CRITICAL |
| 6 | Claude Code hosting deploy site | Dedicated per-tool tutorial/product pages (100%) | Hostinger `/claude-code-hosting`, xCloud, websitesetup.org, Wix blog, Medium | **None** — despite this exact phrase being in EZLaunch's own meta keywords | CRITICAL |

**SERP consensus:** For EZLaunch's core "AI-generated website hosting" niche (queries 2, 4, 5, 6),
the dominant, winning page type is a **narrow, single-tool (or single-comparison) landing/tutorial
page**, not a broad multi-tool homepage. EZLaunch's content strategy is currently pillar-only (one
homepage + one multi-tool blog post) where the SERP rewards a pillar-and-spokes model.

---

## Target Page Classification

- **Homepage (`index.html`):** Product/SaaS landing page. Correctly typed for branded and
  bottom-funnel "deploy html website free" traffic; incorrectly typed (i.e., non-existent) for
  per-tool and comparison traffic.
- **Blog posts:** Long-form tutorial/comparison articles (`Article` schema present). The
  "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit" post (2,018 words) is
  EZLaunch's best-matched asset for queries 2/4/5/6's *format*, but its H1/title/URL target the
  broad multi-tool phrase, not any single tool — so it can't compete head-on for "Claude Code
  hosting" or "deploy a Lovable site" against pages built specifically around those phrases.
- **Prompt Library:** Resource/lead-magnet page, but functionally an email gate (110 words of
  static, crawlable content; actual prompts render client-side only after email submission) —
  behaves like a login wall to both Google and users, not a content page.
- **Contact / Status / Privacy / Terms:** Correctly typed utility pages.

---

## User Stories (derived from SERP signals)

1. **Awareness — "I just exported my site, where do I put it?"** A non-technical builder who
   finished a site in Lovable searches "how to deploy a Lovable site" and finds step-by-step
   guides from Netlify, DeployHQ, and Supadrop — never EZLaunch — because 100% of that SERP is
   dedicated tool-specific tutorial pages EZLaunch doesn't have. *(Signal: Query 4 SERP
   composition.)*

2. **Consideration — "Which host is actually worth it?"** A comparison shopper searches "host AI
   generated website" and lands on roundup posts like "Best free hosting for AI-generated websites
   in 2026 (compared)" and "4 Real Options Compared" — they want a vendor-authored comparison
   table (EZLaunch vs. Netlify/Vercel/GitHub Pages/Tiiny Host on price, custom domain, forms,
   analytics) before committing, and no such page exists on ezlaunch.app. *(Signal: Query 2 SERP
   composition — ~40% niche "use-case"/comparison pages.)*

3. **Decision — "I want the Claude Code page, specifically."** A developer who just built a site
   with Claude Code searches "Claude Code hosting deploy site" expecting a page titled around that
   exact phrase (like Hostinger's `/claude-code-hosting` or xCloud's `/claude-code-hosting/`) with
   a copy-paste deploy command — EZLaunch's own meta keywords target this exact phrase, but no
   matching page exists to land the click. *(Signal: Query 6 SERP + EZLaunch's own `<meta
   name="keywords">`.)*

4. **Trust (pre-decision) — "Who runs this, and is anyone else using it?"** A first-time visitor
   checks the footer for Status/Privacy/Terms (all present) but finds no About/team page, no
   customer count, no testimonials, and a vague proof line ("Join developers already hosting on
   EZLaunch" with no number) before being asked to drop their ZIP file. *(Signal: absence of
   Organization/about content — cross-referenced in `schema.md` Finding #1; confirmed by direct
   inspection: no `about.html` in site inventory, no testimonial markup in `index.html`.)*

5. **Consideration — "Show me the comparison, don't make me trust a roundup site."** An agency
   evaluator searches "static site hosting" and mostly finds third-party ranked listicles
   ("10+ Platforms...", "10 Best Static Website Hosting Providers... Ranked and Compared") rather
   than vendor sites — they'd rather get pricing/feature comparison straight from EZLaunch than
   trust an affiliate roundup. *(Signal: Query 1 SERP — ~45% third-party comparison content.)*

---

## Gap Analysis (7 dimensions, 100 pts total)

| Dimension | Score | Evidence |
|---|---|---|
| Page Type (0-15) | **6/15** | Homepage type is correct for brand/bottom-funnel traffic, but 3 of 6 queries analyzed (Lovable, Bolt, Claude Code) have **zero** matching EZLaunch page type at all — this is the largest single deduction. |
| Content Depth (0-15) | **7/15** | Homepage = 646 words (thin vs. 1,000-2,000+ word competitor comparison/tutorial content). Blog posts are strong (2,018 / 1,100 words) but underleveraged — not split into per-tool spokes. |
| UX Signals (0-15) | **9/15** | Strong: live drag-drop hero demo, mobile nav drawer, pricing toggle, repeated CTAs (nav/hero/pricing/final). Weak: no visible customer count/testimonials near CTAs to reduce last-mile hesitation. |
| Schema (0-15) | **4/15** | Homepage has **zero** JSON-LD despite a 4-tier pricing table and 9-feature grid (confirmed — no `application/ld+json` in `index.html`). Blog posts have `Article` schema but are missing `publisher.logo`, `mainEntityOfPage`, `BreadcrumbList` (see `schema.md`, score 38/100). |
| Media (0-15) | **8/15** | Custom hand-built SVG/CSS product demos (drop zone, SSL lock, analytics chart, forms inbox, terminal, SEO score ring, image gallery, code editor) are a genuine differentiator vs. stock-photo competitors. Gap: no real screenshots/video of the actual dashboard, no customer-site showcase. |
| Authority (0-15) | **6/15** | Positive: public GitHub CLI repo linked (real dev-trust signal), live Status page, Privacy/Terms present. Negative: no About/team page anywhere in the site inventory, no testimonials, no customer logos, no case studies, no third-party review badges (G2/Capterra). |
| Freshness (0-10) | **5/10** | Blog posts dated June 2026 (reasonably fresh). But `status.html` — the one page whose entire purpose is to look current — hardcodes **"Last updated: May 2026"**, four months stale relative to today (Sept 2026), undermining the exact trust signal it exists to provide. |
| **Total** | **45/100** | |

---

## Persona Scorecards (weakest first)

Scoring: Relevance / Clarity / Trust / Action, 25 pts each, 100 pts per persona.

### Persona D — Comparison shopper ("static site hosting" / "netlify alternative" searcher) — 44/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 10/25 | Homepage never mentions Netlify, Vercel, GitHub Pages, or Cloudflare Pages by name or offers a migration angle — doesn't speak to how this persona is framing the decision. |
| Clarity | 12/25 | No comparison table vs. named competitors anywhere on the domain; "Built for AI Builders" framing may read as niche/not-for-me to a generic static-site shopper. |
| Trust | 10/25 | No G2/Capterra badges, no third-party comparison content to be found citing EZLaunch. |
| Action | 12/25 | CTA itself is fine, but this persona is likely to bounce to a third-party roundup instead of converting. |
| **Fix priority** | | Publish an "EZLaunch vs. Netlify vs. Vercel vs. GitHub Pages vs. Tiiny Host" comparison page (see prioritized list). |

### Persona E — Tool-specific searcher ("Claude Code hosting" / "deploy Bolt site") — 48/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 8/25 | No page exists at the URL/title level to even be found for this intent — today this persona effectively never lands on ezlaunch.app organically for their exact query. |
| Clarity | 16/25 | If they do arrive (e.g., via brand search), the logo strip confirms tool compatibility quickly. |
| Trust | 10/25 | No tool-specific proof ("here's exactly how a Claude Code user deploys in 3 commands"). |
| Action | 14/25 | CTA works once landed, but arrival is the actual bottleneck. |
| **Fix priority** | | Build the 3 per-tool landing pages (Claude Code, Bolt, Lovable) — highest ROI item on this audit. |

### Persona F — Security/privacy-conscious evaluator (checks Status/Privacy before signup) — 60/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 18/25 | Footer surfaces Status, Privacy, Terms directly — this persona's checklist is addressed structurally. |
| Clarity | 20/25 | Status page itself is clean and legible: "All systems operational," per-service rows, incident history. |
| Trust | 10/25 | "Last updated: May 2026" (4 months stale vs. today) on the one page meant to prove real-time reliability is a self-inflicted trust wound. |
| Action | 12/25 | No subscribe-to-updates / RSS / uptime % or SLA number offered. |
| **Fix priority** | | Auto-generate the status timestamp; add an uptime percentage or subscribe option. |

### Persona B — Developer with an existing GitHub repo (git-push workflow) — 67/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 20/25 | GitHub tab in the deploy demo, dedicated CLI band, public CLI repo linked. |
| Clarity | 14/25 | Unclear from the homepage whether connecting GitHub triggers auto-redeploy on new commits (competitors like Netlify lead with this); no branch-preview mention. |
| Trust | 16/25 | Open-source CLI repo is a real signal; no docs deep-link for GitHub Actions/CI setup from the homepage itself. |
| Action | 17/25 | CLI install commands are copy-button ready; footer links to `docs.ezlaunch.app`. |
| **Fix priority** | | Add one sentence to the GitHub tab confirming auto-redeploy-on-push behavior; link docs directly from that card. |

### Persona C — Agency/freelancer shipping many client landing pages — 69/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 22/25 | Agency plan is named directly, with unlimited sites/custom domains. |
| Clarity | 20/25 | Pricing table clearly differentiates plan tiers by sites/domains/support level. |
| Trust | 12/25 | Agency tier CTA is "Contact us" (not self-serve) at only $19/mo, which reads oddly high-friction for the price point, and no agency case studies exist. |
| Action | 15/25 | No dedicated agency/white-label landing page to answer multi-client-specific questions (white-labeling, client handoff, billing per client). |
| **Fix priority** | | Consider self-serve checkout for Agency tier, or explain briefly why it's "Contact us" (e.g., custom invoicing). |

### Persona A — Non-technical vibe-coder with a ZIP from Lovable/Bolt — 71/100
| Metric | Score | Why |
|---|---|---|
| Relevance | 20/25 | Hero literally offers a drag-and-drop `.zip` dropzone — directly matches this persona's exact next action. |
| Clarity | 18/25 | Headline + subhead answer "what is this" in 5 seconds; badge rotates "Built for AI Builders." |
| Trust | 12/25 | No testimonials/customer count anywhere before the drop action is requested. |
| Action | 21/25 | "Get started free" CTA repeated 4x (nav, hero, pricing, final section); "No credit card required" stated once at the bottom. |
| **Fix priority** | | Add a customer/site count or 1-2 short testimonials directly under the hero proof line. |

---

## Prioritized List of Pages to Create

1. **`/deploy/claude-code`** (or `/claude-code-hosting`) — CRITICAL. H1 "Deploy your Claude Code
   site to EZLaunch." Matches EZLaunch's own meta-keyword target and a 100%-tutorial-page-type
   SERP with zero EZLaunch presence today.
2. **`/deploy/lovable`** — CRITICAL. Matches the exact "how to deploy a Lovable site" query
   analyzed; 100% of that SERP is dedicated tool pages.
3. **`/deploy/bolt`** — CRITICAL. Same pattern as above for Bolt.new.
4. **`/deploy/cursor`** — HIGH. Meta keywords already target "Cursor hosting" with no matching page.
5. **`/compare/ezlaunch-vs-netlify-vercel-github-pages`** (or a single `/alternatives` hub
   covering Netlify, Vercel, GitHub Pages, Tiiny Host, Cloudflare Pages) — HIGH. Directly answers
   the ~40-45% comparison/listicle share of queries 1 and 2, and Persona D's #1 complaint.
6. **`/about`** — MEDIUM. No such page exists in the site inventory; needed to close the Trust gap
   for Personas D, E, F and to give schema an `Organization`/founder entity to model (cross-ref
   `schema.md`).
7. **Un-gate `/prompt-library`** — MEDIUM. Convert from a 110-word email wall into a page with
   5-10 real, crawlable sample prompts above the fold, keeping the email gate only for the "view
   all" long-tail behind it.
8. **`/how-it-works`** (standalone, expanding the current `#how-it-works` homepage anchor) —
   MEDIUM. Gives the "host AI generated website" tutorial-intent share of Query 2 a page type
   that can compete with BugSmash/InMotion-style guides without diluting the homepage's
   product-page framing.

---

## Cross-Skill References

- Schema gaps (zero JSON-LD on homepage, missing `Article` properties) → see
  `/Users/juliancabada/Desktop/ezlaunch-landing/ezlaunch.app-audit/findings/schema.md` (score
  38/100) and run `/seo schema` for ready-to-paste generated blocks.
- Keyword/cluster overlap for the per-tool "vendor-fixer" queries and pillar-vs-spoke
  cannibalization risk → see
  `/Users/juliancabada/Desktop/ezlaunch-landing/ezlaunch.app-audit/findings/cluster.md`.
- Trust/E-E-A-T gaps (no About page, no testimonials, no author bio page) → recommend `/seo
  content` for a deeper E-E-A-T pass.
- Thin/gated prompt-library page → recommend `/seo page` for a page-level audit of that URL
  specifically.

---

## Limitations

- WebSearch returns a curated set of ~7-9 links per query, not a verified top-10 organic SERP
  scrape with position numbers, SERP features (PAA, featured snippet, AI Overview), or ads — all
  page-type classifications above are directional based on that sample, not a guaranteed rank-1-10
  breakdown.
- The `claude-seo run render_page.py` / `parse_html.py` managed runtime was unavailable per task
  constraints; the live site was not fetched directly. All target-page analysis uses the local
  rendered HTML snapshots in `live-html/`, which are treated as an accurate stand-in for the live
  page but were not re-verified against the current production DOM at analysis time.
- No analytics, Search Console, or conversion data was available — persona/UX scoring is based on
  static HTML/CSS inspection only, not real user behavior, session recordings, or actual bounce
  rates.
- Mobile rendering was assessed from HTML/CSS structure (responsive nav drawer, viewport meta)
  only, not from an actual rendered mobile screenshot/device lab.
- Yearly pricing values are computed client-side by JS and were not statically verifiable (noted
  also in `schema.md`).

---

```json
{
  "category": "search_experience",
  "sxo_gap_score": 45,
  "primary_finding": {
    "type": "page_type_mismatch",
    "severity": "CRITICAL",
    "summary": "Meta keywords target 'Claude Code hosting' and 'Cursor hosting' verbatim, and the homepage logo strip name-checks 8 AI coding tools, but zero dedicated per-tool pages exist. SERPs for 'how to deploy a Lovable site', 'deploy Bolt.new site free hosting', and 'Claude Code hosting deploy site' are 100% dominated by competitor dedicated per-tool landing/tutorial pages (Hostinger, DeployHQ, Netlify, xCloud, Wix, Supadrop)."
  },
  "gap_dimensions": {
    "page_type": 6,
    "content_depth": 7,
    "ux_signals": 9,
    "schema": 4,
    "media": 8,
    "authority": 6,
    "freshness": 5,
    "total": 45
  },
  "weakest_personas": ["comparison_shopper", "tool_specific_searcher", "privacy_conscious_evaluator"],
  "prioritized_pages_to_create": [
    "/deploy/claude-code",
    "/deploy/lovable",
    "/deploy/bolt",
    "/deploy/cursor",
    "/compare/ezlaunch-vs-netlify-vercel-github-pages",
    "/about",
    "prompt-library (ungate preview content)",
    "/how-it-works (standalone)"
  ]
}
```
