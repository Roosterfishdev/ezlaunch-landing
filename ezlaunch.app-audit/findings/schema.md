# Structured Data Audit — ezlaunch.app

**Score: 38 / 100**

Pages audited (live HTML, local copies): `index.html`, `blog.html`, `blog_deploying-ai-built-sites.html`, `blog_html-websites-are-the-future.html`, `contact.html`, `status.html`, `prompt-library.html`, `privacy.html`, `terms.html`.

## What Works

- Both blog posts ship valid, parseable `Article` JSON-LD (`@context: https://schema.org`, no deprecated types).
- Image URLs in the existing JSON-LD are absolute, host-correct (`https://ezlaunch.app`, no `www`), and use clean paths (no `.html`).
- `datePublished` is present and ISO 8601 formatted on both posts.
- `author` and `publisher` objects exist with correct `@type`s (Person / Organization).
- Homepage has clear, real content to model schema from: pricing tiers, a features grid, and consistent internal linking using clean URLs (`/blog`, `/contact`, `/status`, etc.), plus four social profile links (Facebook, LinkedIn, X, GitHub) usable as `sameAs`.
- Correct absolute logo asset exists at `https://ezlaunch.app/assets/logo-ezlaunch.svg`.
- No FAQ section exists anywhere on the site, so there is no stale/deprecated FAQPage markup to clean up, and no risk of over-recommending it.

## Findings

### 1. Homepage has zero structured data — Critical
**Evidence:** `index.html` contains no `<script type="application/ld+json">` block at all, despite having a full pricing table (4 tiers), a 9-item feature list, and brand/social identity elements.
**Fix:** Add `Organization`, `WebSite`, and `SoftwareApplication` JSON-LD (generated below). This is the single largest opportunity on the site.

### 2. Article JSON-LD missing `publisher.logo` — High
**Evidence:** Both posts' `publisher` object is `{"@type":"Organization","name":"EZLaunch","url":"https://ezlaunch.app"}` — no `logo`.
**Fix:** Add `"logo": {"@type":"ImageObject","url":"https://ezlaunch.app/assets/logo-ezlaunch.svg"}` to the publisher object on both posts.

### 3. Article JSON-LD missing `mainEntityOfPage` and `dateModified` — Medium
**Evidence:** Neither post's JSON-LD includes `mainEntityOfPage`; no `dateModified` is present, and no `<time>`/updated-at element exists in the visible HTML to source one from.
**Fix:** Add `"mainEntityOfPage": {"@type":"WebPage","@id":"<clean-post-url>"}` to both posts. Add `dateModified` only when there's a real edit to reflect (do not duplicate `datePublished` as a placeholder) — until then, its absence is a minor recommended-property gap, not a validation failure.

### 4. Article JSON-LD missing `author.url` — Low
**Evidence:** `author` is `{"@type":"Person","name":"Julian Cabada"}` with no `url` (no author bio/profile page linked).
**Fix:** Add an `author.url` if/when an author page exists; otherwise acceptable to leave as-is (not a required property).

### 5. Canonical/`og:url` tags use `.html` paths while internal nav links use clean URLs — Medium (site-wide, feeds into schema)
**Evidence:** `blog.html`, `blog_deploying-ai-built-sites.html`, `blog_html-websites-are-the-future.html`, `contact.html`, `privacy.html`, `prompt-library.html`, `status.html`, `terms.html` all declare `<link rel="canonical">` and `og:url` with `.html` suffixes (e.g. `https://ezlaunch.app/blog/deploying-ai-built-sites.html`), but every in-page nav link uses the clean form (`/blog`, `/contact`, etc.) and the homepage's own `og:url` is clean (`https://ezlaunch.app`).
**Fix:** Standardize on the clean-URL form site-wide (fix the canonical/og:url meta tags to drop `.html`), and use that same clean form consistently in any `@id`, `url`, `mainEntityOfPage`, and `BreadcrumbList` `item` values in schema — otherwise new JSON-LD will disagree with the page's own canonical tag, which is a classic self-inflicted duplicate-content/ambiguous-URL signal.

### 6. No BreadcrumbList anywhere on the site — Medium
**Evidence:** No breadcrumb markup (visual or JSON-LD) found on either blog post or the blog index.
**Fix:** Add `BreadcrumbList` to both posts (template below) and to the blog index (Home → Blog).

### 7. No Blog/CollectionPage or ContactPage markup — Low/Medium
**Evidence:** `blog.html` (lists 2 posts) and `contact.html` (has an `<h1>Get in touch</h1>` and a contact form) carry no page-type schema.
**Fix:** Add `CollectionPage`/`Blog` to the blog index and `ContactPage` to the contact page (snippets below).

### 8. No FAQPage present — Info (no action needed)
**Evidence:** No FAQ/Q&A section found in `index.html` or elsewhere.
**Fix:** None required. Per current guidance, FAQPage no longer produces any Google SERP rich result (retired May 7 2026) — do not add it speculatively. If genuine user Q&A content is added later, prefer `QAPage`, not `FAQPage`.

### 9. Pricing tiers only fully verifiable for monthly billing — Info
**Evidence:** The visible/static HTML exposes monthly prices (Free $0, Starter $5/mo, Pro $10/mo, Agency $19/mo). The "Yearly (2 months free)" toggle's actual yearly prices are computed client-side by JS and are not present as static values in the HTML, so they can't be safely hard-coded into `Offer.price` without risking drift from the live JS calculation.
**Fix:** Model `Offer`s off the verified monthly prices (below). If yearly pricing should also be represented, source the exact per-year figures from the JS/config rather than inferring them.

---

## Generated JSON-LD — Homepage (`index.html`)

Paste all three blocks into `index.html`, ideally as separate `<script type="application/ld+json">` tags in `<head>` or before `</body>`.

### Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EZLaunch",
  "url": "https://ezlaunch.app",
  "logo": "https://ezlaunch.app/assets/logo-ezlaunch.svg",
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61590129630123",
    "https://www.linkedin.com/company/ezlaunchapp/",
    "https://x.com/EZlaunchapp",
    "https://github.com/Roosterfishdev/ezlaunch-cli"
  ]
}
```

### WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "EZLaunch",
  "url": "https://ezlaunch.app",
  "publisher": {
    "@type": "Organization",
    "name": "EZLaunch",
    "url": "https://ezlaunch.app",
    "logo": "https://ezlaunch.app/assets/logo-ezlaunch.svg"
  }
}
```

### SoftwareApplication (with real pricing tiers)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EZLaunch",
  "url": "https://ezlaunch.app",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "description": "Static hosting for AI-generated websites. Drop a ZIP or connect GitHub. SSL, analytics, and forms included.",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "url": "https://ezlaunch.app/#pricing"
    },
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "5",
      "priceCurrency": "USD",
      "url": "https://ezlaunch.app/#pricing"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "10",
      "priceCurrency": "USD",
      "url": "https://ezlaunch.app/#pricing"
    },
    {
      "@type": "Offer",
      "name": "Agency",
      "price": "19",
      "priceCurrency": "USD",
      "url": "https://ezlaunch.app/#pricing"
    }
  ]
}
```

---

## Generated JSON-LD — Blog Index (`blog.html`)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "EZLaunch Blog",
  "url": "https://ezlaunch.app/blog",
  "isPartOf": {
    "@type": "WebSite",
    "name": "EZLaunch",
    "url": "https://ezlaunch.app"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ezlaunch.app" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ezlaunch.app/blog" }
    ]
  }
}
```

## Generated JSON-LD — Contact Page (`contact.html`)

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact EZLaunch",
  "url": "https://ezlaunch.app/contact",
  "isPartOf": {
    "@type": "WebSite",
    "name": "EZLaunch",
    "url": "https://ezlaunch.app"
  }
}
```

## BreadcrumbList Template — Blog Posts

Use on both `blog_deploying-ai-built-sites.html` and `blog_html-websites-are-the-future.html`; fill in the placeholders with each post's real title and clean-URL slug.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ezlaunch.app" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ezlaunch.app/blog" },
    { "@type": "ListItem", "position": 3, "name": "{{POST_TITLE}}", "item": "https://ezlaunch.app/blog/{{post-slug}}" }
  ]
}
```

Concrete values for the two existing posts:
- `{{POST_TITLE}}` = "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit", `{{post-slug}}` = `deploying-ai-built-sites`
- `{{POST_TITLE}}` = "Static HTML Websites Are Not Just the Present — They're the Future", `{{post-slug}}` = `html-websites-are-the-future`

---

## Patch — Add Missing Properties to Existing Article JSON-LD

Example for `blog_deploying-ai-built-sites.html` (apply the equivalent change to the other post):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Deploying Sites Built by ChatGPT, Claude, Bolt, Lovable, and Replit",
  "description": "A practical, honest guide to deploying AI-generated websites: how output differs by tool, your hosting options compared, and how to pick the right one.",
  "image": "https://ezlaunch.app/assets/blog/deploying-ai-built-sites.png",
  "datePublished": "2026-06-03",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ezlaunch.app/blog/deploying-ai-built-sites"
  },
  "author": {
    "@type": "Person",
    "name": "Julian Cabada"
  },
  "publisher": {
    "@type": "Organization",
    "name": "EZLaunch",
    "url": "https://ezlaunch.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ezlaunch.app/assets/logo-ezlaunch.svg"
    }
  }
}
```
