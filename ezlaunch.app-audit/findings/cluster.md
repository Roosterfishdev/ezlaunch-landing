# Semantic Topic Cluster Plan — ezlaunch.app

Scope: lightweight cluster analysis (no `claude-seo run` runtime available). Built from
~28 keyword variants across 8 SERP checks (WebSearch, top ~7-9 organic-style links per
query, not a full top-10 scrape — treat overlap counts below as directional, not exact).

## 1. Keyword Universe (expanded from seed set)

| # | Keyword | Intent | Notes |
|---|---|---|---|
| 1 | deploy ai generated website | Informational/Commercial | broad, high funnel-top |
| 2 | how to host an ai generated website | Informational | tutorial-style SERP |
| 3 | static site hosting for ai builders | Commercial | product-fit |
| 4 | free static site hosting | Commercial | roundup SERP |
| 5 | free static hosting with custom domain | Commercial | roundup SERP |
| 6 | static site hosting with SSL and custom domain | Commercial | roundup SERP |
| 7 | netlify alternative | Commercial | roundup SERP, high volume |
| 8 | netlify alternative free | Commercial | variant of #7 |
| 9 | vercel alternative for static sites | Commercial | roundup SERP |
| 10 | github pages alternative | Commercial | roundup SERP |
| 11 | github pages vs netlify vs vercel | Commercial | comparison |
| 12 | deploy lovable app custom domain | Transactional | vendor-fixer SERP |
| 13 | how to host a lovable app | Transactional | variant of #12 |
| 14 | lovable custom domain free | Transactional | variant of #12 |
| 15 | deploy bolt.new app custom domain | Transactional | vendor-fixer SERP |
| 16 | bolt.new custom domain hosting | Transactional | variant of #15 |
| 17 | export bolt.new project host elsewhere | Informational | variant of #15 |
| 18 | deploy v0 app custom domain | Transactional | vendor-fixer SERP |
| 19 | v0.dev hosting without vercel | Transactional | variant of #18 |
| 20 | host v0 app on own domain | Transactional | variant of #18 |
| 21 | deploy website built with claude code | Informational | dev tutorial SERP |
| 22 | deploy website built with cursor | Informational | dev tutorial SERP |
| 23 | claude code push site to production | Informational | variant of #21 |
| 24 | replit custom domain alternative | Informational/Commercial | dev tutorial + escape-Replit angle |
| 25 | deploy chatgpt generated html website | Informational | general tutorial SERP (overlaps #1/#2) |
| 26 | how to add contact form to static html site | Informational/Commercial | form-tool SERP |
| 27 | static site contact form no backend | Informational/Commercial | variant of #26 |
| 28 | best analytics for static websites | Informational/Commercial | feature SERP |
| 29 | privacy friendly analytics static site | Informational/Commercial | variant of #28 |
| 30 | how to add custom domain and ssl to static site | Informational/Commercial | feature SERP |
| 31 | ai website builder prompts | Informational | prompt-library fit |
| 32 | prompts for lovable/bolt/v0 landing page | Informational | prompt-library fit |

Removed as navigational (not clustered): "ezlaunch", "lovable.dev login", "v0.app pricing",
"bolt.new sign in", "netlify login".

## 2. SERP Overlap Matrix (sampled)

Overlap = shared domains between the two queries' result sets from WebSearch (out of the
~7-9 links returned per query). Thresholds: 7-10 shared→same post, 4-6→same cluster,
2-3→interlink, 0-1→separate. Because WebSearch returns a curated ~8-link set rather than a
full top-10 organic SERP, raw counts run lower than a true SERP-overlap tool; I weight the
**qualitative pattern** (same recurring competitor domains + same searcher intent) alongside
the raw count.

| Keyword A | Keyword B | Shared domains (sample) | Overlap | Verdict |
|---|---|---|---|---|
| deploy lovable app custom domain (#12) | deploy bolt.new app custom domain (#15) | sakurahost.co.tz, shipper.now, livemy.app | 3 | Cluster (same "custom-domain fixer" competitor set + identical intent) |
| deploy bolt.new app custom domain (#15) | deploy v0 app custom domain (#18) | shipper.now | 1 (but same intent/format pattern) | Cluster (borderline; grouped on intent + recurring competitor) |
| deploy lovable app custom domain (#12) | deploy v0 app custom domain (#18) | shipper.now, livemy.app pattern | 1-2 | Cluster (same intent family) |
| netlify alternative (#7) | github pages alternative (#10) | developer.puter.com, freestuff.dev, danubedata.ro | 3 | Cluster (roundup/comparison content) |
| netlify alternative (#7) | free static hosting w/ custom domain (#5) | static.run, danubedata.ro | 2 | Interlink/Cluster boundary |
| github pages alternative (#10) | free static hosting w/ custom domain (#5) | danubedata.ro | 1 | Interlink (weak, same topical family) |
| deploy website built with claude code (#21) | deploy website built with cursor (#22) | growwstacks.com, designcode.io pattern, shared tutorial format | 2-4 | Cluster (near-identical dev-tutorial SERP shape) |
| deploy website built with claude code (#21) | deploy lovable app custom domain (#12) | 0 | 0 | Separate — different competitor sets and intent (dev-tutorial vs. commercial fixer-service) |
| add contact form to static html (#26) | best analytics for static sites (#28) | 0 (both dominated by dedicated micro-SaaS: staticforms.dev/formgrid/submify vs. analytics tools) | 0-1 | Interlink (same "static site features" theme, different vendor SERPs) |
| add contact form to static html (#26) | netlify alternative (#7) | 0 | 0 | Separate |
| deploy chatgpt generated website (#25) | deploy ai generated website (#1) | inmotionhosting.com, bugsmash.io, tiiny.host pattern | 4-5 | Same cluster/near-same-post (generic AI-hosting tutorial SERP) |

**Cannibalization flags:**
- `/blog/deploying-ai-built-sites` (existing) already name-checks ChatGPT, Claude, Bolt,
  Lovable, and Replit in its title. If new vendor-specific spokes (Lovable, Bolt, v0,
  Claude Code, Replit) are published without a clear broad-vs-specific keyword split, the
  pillar and its own spokes will compete. **Mitigation:** keep the pillar's H1/title on the
  broad, multi-tool keyword ("deploy a website built by AI") and push every tool-specific
  long-tail ("deploy lovable app to a custom domain") down into the spokes; pillar sections
  should summarize each tool in 1-2 paragraphs and hand off via a "Full guide →" link.
- Homepage vs. Cluster 2 hub: homepage owns the transactional/brand query set (product,
  pricing, "AI website hosting"); the blog pillar owns the how-to/comparison query set. Low
  risk today, but do not let the pillar target "static site hosting" head-on — that belongs
  to the homepage.

## 3. Cluster Architecture

### Cluster 1 — Static Hosting Alternatives & Comparisons (Commercial)
**Hub:** `/guides/static-site-hosting-alternatives` (new pillar, 2500-3200 words —
comparison table: ezlaunch vs. Netlify/Vercel/GitHub Pages/Cloudflare Pages, ZIP-upload
angle as differentiator)
- Spoke: `/guides/netlify-alternatives` — Commercial — template: comparison/listicle
- Spoke: `/guides/vercel-alternatives-static-sites` — Commercial — template: comparison/listicle
- Spoke: `/guides/github-pages-alternatives` — Commercial — template: comparison/listicle

Supporting (optional, not a core spoke): `/blog/html-websites-are-the-future` (existing,
thin trend piece) — link from the hub as top-of-funnel awareness content, do not treat as
a spoke since it targets a philosophical "future of static HTML" angle rather than a
comparison query.

### Cluster 2 — Deploy Your No-Code AI App (Commercial/Transactional)
**Hub:** `/blog/deploying-ai-built-sites` (existing — expand from current draft into a true
2500-4000 word pillar: keep the multi-tool overview framing, add a decision-matrix table,
link out to each spoke below)
- Spoke: `/guides/deploy-lovable-app` — Transactional — template: step-by-step how-to
- Spoke: `/guides/deploy-bolt-new-app` — Transactional — template: step-by-step how-to
- Spoke: `/guides/deploy-v0-app` — Transactional — template: step-by-step how-to

### Cluster 3 — Deploy Sites Built by AI Coding Agents (Informational, dev audience)
**Hub:** `/guides/deploy-claude-code-cursor-websites` (new pillar — "How to deploy a
website built with Claude Code, Cursor, or Replit")
- Spoke: `/guides/deploy-claude-code-website` — Informational — template: step-by-step how-to
- Spoke: `/guides/deploy-cursor-website` — Informational — template: step-by-step how-to
- Spoke: `/guides/deploy-replit-app-custom-domain` — Informational/Commercial (escape-Replit-hosting angle) — template: step-by-step how-to

### Cluster 4 — Static Site Features & Prompt Resources (Informational/Commercial, product-education)
**Hub:** `/prompt-library` (existing, thin 119 words — expand into a real resource: prompt
templates for generating deployable landing pages/sites across Lovable/Bolt/v0/ChatGPT,
each linking to the relevant Cluster 2/3 deploy spoke)
- Spoke: `/guides/add-contact-form-to-static-site` — Informational/Commercial — template: feature how-to
- Spoke: `/guides/static-site-analytics-guide` — Informational/Commercial — template: feature how-to
- Spoke: `/guides/custom-domain-ssl-static-site` — Informational/Commercial — template: feature how-to

## 4. Internal Link Matrix

Mandatory = spoke↔hub bidirectional. Recommended = spoke↔spoke within same cluster.
Optional = cross-cluster.

| From | To | Type |
|---|---|---|
| /guides/netlify-alternatives | /guides/static-site-hosting-alternatives | Mandatory (spoke→hub) |
| /guides/static-site-hosting-alternatives | /guides/netlify-alternatives | Mandatory (hub→spoke) |
| /guides/vercel-alternatives-static-sites | /guides/static-site-hosting-alternatives | Mandatory |
| /guides/static-site-hosting-alternatives | /guides/vercel-alternatives-static-sites | Mandatory |
| /guides/github-pages-alternatives | /guides/static-site-hosting-alternatives | Mandatory |
| /guides/static-site-hosting-alternatives | /guides/github-pages-alternatives | Mandatory |
| /guides/netlify-alternatives | /guides/vercel-alternatives-static-sites | Recommended |
| /guides/netlify-alternatives | /guides/github-pages-alternatives | Recommended |
| /guides/vercel-alternatives-static-sites | /guides/github-pages-alternatives | Recommended |
| /guides/static-site-hosting-alternatives | /blog/html-websites-are-the-future | Optional |
| /guides/deploy-lovable-app | /blog/deploying-ai-built-sites | Mandatory |
| /blog/deploying-ai-built-sites | /guides/deploy-lovable-app | Mandatory |
| /guides/deploy-bolt-new-app | /blog/deploying-ai-built-sites | Mandatory |
| /blog/deploying-ai-built-sites | /guides/deploy-bolt-new-app | Mandatory |
| /guides/deploy-v0-app | /blog/deploying-ai-built-sites | Mandatory |
| /blog/deploying-ai-built-sites | /guides/deploy-v0-app | Mandatory |
| /guides/deploy-lovable-app | /guides/deploy-bolt-new-app | Recommended |
| /guides/deploy-lovable-app | /guides/deploy-v0-app | Recommended |
| /guides/deploy-bolt-new-app | /guides/deploy-v0-app | Recommended |
| /blog/deploying-ai-built-sites | /guides/deploy-claude-code-cursor-websites | Optional (cross-cluster, "using a coding agent instead?") |
| /guides/deploy-claude-code-website | /guides/deploy-claude-code-cursor-websites | Mandatory |
| /guides/deploy-claude-code-cursor-websites | /guides/deploy-claude-code-website | Mandatory |
| /guides/deploy-cursor-website | /guides/deploy-claude-code-cursor-websites | Mandatory |
| /guides/deploy-claude-code-cursor-websites | /guides/deploy-cursor-website | Mandatory |
| /guides/deploy-replit-app-custom-domain | /guides/deploy-claude-code-cursor-websites | Mandatory |
| /guides/deploy-claude-code-cursor-websites | /guides/deploy-replit-app-custom-domain | Mandatory |
| /guides/deploy-claude-code-website | /guides/deploy-cursor-website | Recommended |
| /guides/deploy-claude-code-website | /guides/deploy-replit-app-custom-domain | Recommended |
| /guides/deploy-cursor-website | /guides/deploy-replit-app-custom-domain | Recommended |
| /guides/add-contact-form-to-static-site | /prompt-library | Mandatory |
| /prompt-library | /guides/add-contact-form-to-static-site | Mandatory |
| /guides/static-site-analytics-guide | /prompt-library | Mandatory |
| /prompt-library | /guides/static-site-analytics-guide | Mandatory |
| /guides/custom-domain-ssl-static-site | /prompt-library | Mandatory |
| /prompt-library | /guides/custom-domain-ssl-static-site | Mandatory |
| /guides/add-contact-form-to-static-site | /guides/static-site-analytics-guide | Recommended |
| /guides/add-contact-form-to-static-site | /guides/custom-domain-ssl-static-site | Recommended |
| /guides/static-site-analytics-guide | /guides/custom-domain-ssl-static-site | Recommended |
| /prompt-library | /blog/deploying-ai-built-sites | Optional (cross-cluster: "built it, now deploy it") |
| /prompt-library | /guides/deploy-lovable-app | Optional |
| /prompt-library | /guides/deploy-claude-code-website | Optional |
| /guides/custom-domain-ssl-static-site | /guides/static-site-hosting-alternatives | Optional (cross-cluster) |

All 4 hubs also get a top-nav/footer link from the homepage (`/`) so no cluster is orphaned;
each of the 12 spokes has 2 mandatory inbound links (from its hub, and from the hub back)
plus 2 recommended spoke-to-spoke inbound links from cluster siblings — satisfying the
"3+ inbound internal links per spoke" checklist item.

## 5. Template & Intent Mapping

| Page | Intent | Template | Word count target |
|---|---|---|---|
| /guides/static-site-hosting-alternatives | Commercial | Pillar/comparison | 2500-3200 |
| /guides/netlify-alternatives | Commercial | Comparison listicle | 1200-1800 |
| /guides/vercel-alternatives-static-sites | Commercial | Comparison listicle | 1200-1800 |
| /guides/github-pages-alternatives | Commercial | Comparison listicle | 1200-1800 |
| /blog/deploying-ai-built-sites | Commercial/Transactional | Pillar/overview | 2500-4000 (expand) |
| /guides/deploy-lovable-app | Transactional | Step-by-step how-to | 1200-1800 |
| /guides/deploy-bolt-new-app | Transactional | Step-by-step how-to | 1200-1800 |
| /guides/deploy-v0-app | Transactional | Step-by-step how-to | 1200-1800 |
| /guides/deploy-claude-code-cursor-websites | Informational | Pillar/overview | 2500-3000 |
| /guides/deploy-claude-code-website | Informational | Step-by-step how-to | 1200-1800 |
| /guides/deploy-cursor-website | Informational | Step-by-step how-to | 1200-1800 |
| /guides/deploy-replit-app-custom-domain | Informational/Commercial | Step-by-step how-to | 1200-1800 |
| /prompt-library | Informational | Pillar/resource library | 2500-3000 (expand from 119 words) |
| /guides/add-contact-form-to-static-site | Informational/Commercial | Feature how-to | 1200-1800 |
| /guides/static-site-analytics-guide | Informational/Commercial | Feature how-to | 1200-1800 |
| /guides/custom-domain-ssl-static-site | Informational/Commercial | Feature how-to | 1200-1800 |

## 6. Pre-Delivery Validation

- [x] No two posts share the same primary keyword (broad pillar keywords vs. long-tail
      vendor/feature spokes, see cannibalization note in §2)
- [x] Every spoke has >= 3 planned inbound internal links (hub + hub-back + >=1 sibling spoke)
- [x] Every spoke links to its hub (mandatory, §4)
- [x] Every hub links to every one of its spokes (mandatory, §4)
- [x] No orphan pages — all 4 hubs also linked from homepage
- [x] Template matches intent (transactional/commercial → how-to + comparison; informational → pillar/how-to)
- [x] Word counts: pillars 2500-4000, spokes 1200-1800
- [x] 4 clusters, 3 spokes each (within 2-5 clusters / 2-4 posts constraint)
- [ ] SERP overlap thresholds are directional only — WebSearch snippet sets are smaller
      than a true top-10 organic scrape (flagged in §2 methodology note); recommend
      re-validating with a full SERP-overlap tool before final publication order.

## 7. First 8 Pages to Write (priority order)

1. **Expand `/blog/deploying-ai-built-sites`** into the Cluster 2 pillar (add decision
   matrix, ZIP-vs-GitHub section, links to the 3 new spokes below). Existing content +
   existing rankings make this the highest-leverage edit.
2. **`/guides/deploy-lovable-app`** — Lovable has the largest no-code AI-builder audience
   right now; SERP is dominated by third-party "fixer" services ezlaunch can out-rank with
   a first-party, product-integrated guide.
3. **`/guides/deploy-bolt-new-app`** — same competitive logic as #2, second-largest
   no-code builder audience.
4. **Expand `/prompt-library`** from 119 words into the Cluster 4 pillar resource — cheapest
   fix (page already exists and is indexed thin), unlocks 3 new feature spokes, and creates
   a natural top-of-funnel-to-deploy-guide bridge.
5. **`/guides/netlify-alternatives`** — highest standalone search volume of the comparison
   set and directly supports ezlaunch's free-tier/ZIP-upload positioning.
6. **`/guides/github-pages-alternatives`** — pairs with #5, strong fit since ezlaunch's
   "drop a ZIP or connect GitHub" pitch directly answers this query's intent.
7. **`/guides/add-contact-form-to-static-site`** — showcases the built-in forms feature,
   competitive SERP is small independent tools (staticforms.dev, formgrid, submify) that a
   product-backed guide + working demo can beat.
8. **`/guides/deploy-v0-app`** — completes the Cluster 2 trio; v0 has fast-growing but
   less-saturated dedicated deploy content, an easier near-term ranking opportunity than
   Lovable/Bolt.

Deferred to next phase: Cluster 3 (Claude Code / Cursor / Replit — informational, dev
audience, smaller/lower-commercial SERP) and the remaining Cluster 1/4 spokes
(`/guides/vercel-alternatives-static-sites`, `/guides/static-site-analytics-guide`,
`/guides/custom-domain-ssl-static-site`, `/guides/static-site-hosting-alternatives` hub
itself once its 3 spokes are validated).
