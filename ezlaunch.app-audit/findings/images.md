# Images — ezlaunch.app

**Score: 58/100**

Method: inventory of every `<img>` on all 9 live pages (curl, 2026-09-13) plus HEAD requests for asset sizes. No Chromium available, so no rendered-size checks.

## What works
- Every `<img>` has explicit `width`/`height` (37/37 on the homepage), which prevents layout shift.
- 32 of 37 homepage images use `loading="lazy"`.
- All UI graphics are SVG (tool logos, hero illustration, EZLaunch logo, 1.7–3 KB each).
- Both blog post hero images carry descriptive alt text.
- Assets are served with `cache-control: public` and correct MIME types.

## Findings

### 1. Blog hero PNGs are 2.7 MB each — High
| File | Size |
|---|---|
| /assets/blog/deploying-ai-built-sites.png | 2,772,403 B |
| /assets/blog/html-websites-are-the-future.png | 2,729,333 B |

Both load on the blog index (lazy) and eagerly on each post page above the fold, so they are the likely LCP element on the posts. No `srcset`, no WebP/AVIF alternative, no compression.
**Fix:** export at the rendered width (likely ≤1200px) as WebP or AVIF, target under 150 KB, keep a PNG/JPEG fallback via `<picture>`, add `srcset`/`sizes`, and add `fetchpriority="high"` on the post page hero.

### 2. Open Graph image is 1.5 MB — High
`/assets/og-image.png` is 1,511,969 B. Social crawlers (Facebook, LinkedIn, X, Slack) impose limits (X and LinkedIn commonly fail or skip images over ~1–5 MB) and every share fetches it.
**Fix:** re-export at 1200×630 as JPEG or PNG-8, target under 300 KB. Also serve it from the canonical host (`https://ezlaunch.app/...`, currently referenced without `www`, which is fine, but keep consistent with the canonical fix).

### 3. Blog index thumbnails have empty alt — Medium
On `/blog`, both post thumbnails are `alt=""`. They sit inside card links, so screen readers and image search get no text for the image. Because the card contains the post title, an empty alt is acceptable for accessibility but wastes image-search relevance.
**Fix:** reuse the post's hero alt text, or leave `alt=""` if the title link text is adjacent and add the alt on the post page only. Prefer the descriptive alt.

### 4. Tool logos are decorative with empty alt but duplicated 4× — Low
Eight AI tool logos (Claude, Cursor, Bolt, Lovable, Replit, v0, Windsurf, Kimi) each appear 4 times in the homepage marquee (32 `<img>` tags) with `alt=""`. Correct for a decorative marquee, but the surrounding text should name the tools once for SEO. Check that a visible or visually-hidden sentence lists "Claude Code, Cursor, Bolt, Lovable, Replit, v0, Windsurf" (the homepage copy does mention several).
**Fix:** none required for alt. Consider `aria-hidden="true"` on the cloned marquee copies and reduce clones to 2.

### 5. Meta pixel noscript image on every page — Info
`https://www.facebook.com/tr?id=...&noscript=1` appears on all 9 pages including privacy/terms. Expected for the Pixel; ensure the privacy policy discloses it and consider consent gating for EU visitors.

### 6. No image sitemap / no OG image on blog posts checked — Low
Verify each blog post sets `og:image` to its own hero rather than the generic og-image (see on-page findings).

## Score rationale
Dimensions, lazy loading and SVG use are strong (+). Three multi-megabyte PNGs, no modern formats and no responsive `srcset` anywhere (−).
