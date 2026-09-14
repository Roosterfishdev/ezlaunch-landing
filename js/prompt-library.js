(function () {
  'use strict';

  const STORAGE_KEY = 'ezlaunch-prompt-library-access';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const PROMPTS = [
    {
      category: 'Landing',
      title: 'SaaS landing page from scratch',
      description: 'Full marketing page with hero, features, pricing, and FAQ — static HTML/CSS only.',
      prompt:
        'Build a complete SaaS landing page using only HTML, CSS, and vanilla JavaScript. Include: sticky nav with logo and CTA, hero with headline + subhead + two buttons, logo strip, 6-feature grid with icons, 3-step "how it works", 3-tier pricing table, FAQ accordion, footer with links. Use a modern indigo/violet palette, Urbanist-style headings, generous whitespace, and mobile-first responsive layout. No frameworks. Output separate index.html and styles.css files.',
    },
    {
      category: 'Landing',
      title: 'Hero section that converts',
      description: 'Above-the-fold block tuned for AI-built static sites.',
      prompt:
        'Write the HTML and CSS for a hero section for a static hosting product aimed at vibe coders. Headline should promise speed ("Ship your AI site in minutes"). Include a pill badge, primary CTA "Get started free", secondary "See how it works", and a subtle product mockup card showing a URL bar with https://mysite.ezlaunch.app. Use CSS only for layout; no images required except optional SVG. Fully responsive.',
    },
    {
      category: 'Deploy',
      title: 'Prepare project for EZLaunch ZIP',
      description: 'Flatten structure and ignore dev files before upload.',
      prompt:
        'Audit my static site folder for deployment to EZLaunch (ZIP upload). Ensure index.html is at the root, not inside a subfolder. List files to exclude (node_modules, .env, .git, build caches). Generate a .ezlaunchignore file. Summarize the final folder tree I should zip.',
    },
    {
      category: 'Deploy',
      title: 'CLI deploy checklist',
      description: 'Step-by-step terminal workflow.',
      prompt:
        'Give me a minimal terminal checklist to deploy a static site with the EZLaunch CLI: npm install -g ezlaunch, ezlaunch login, cd into project, ezlaunch deploy. Include troubleshooting for common errors (not logged in, wrong directory, missing index.html). Format as copy-paste commands with one-line comments.',
    },
    {
      category: 'SEO',
      title: 'Meta tags and Open Graph pass',
      description: 'Search and social preview optimization for a single HTML file.',
      prompt:
        'Review this HTML file and add or improve: unique <title>, meta description (150–160 chars), canonical link, og:title, og:description, og:url, og:type, twitter:card, viewport, and lang on <html>. Use placeholder URLs for my domain. Return only the <head> block I should paste in.',
    },
    {
      category: 'SEO',
      title: 'Semantic heading structure',
      description: 'Fix outline for accessibility and rankings.',
      prompt:
        'Analyze the heading structure (h1–h6) in my landing page HTML. Ensure exactly one h1, logical section order, and no skipped levels. Suggest rewrites for any heading text that is vague. Return a before/after outline and the updated HTML fragments.',
    },
    {
      category: 'Forms',
      title: 'Contact form with EZLaunch backend',
      description: 'Wire data-ezlaunch without breaking static hosting.',
      prompt:
        'Create a contact form using only HTML: fields for name, email, subject, message, and submit button. Add data-ezlaunch and name="contact" on the form. Style it to match a clean SaaS UI (labels, focus rings, error states). Include a hidden success message section toggled by JavaScript listening for form success events. No backend code.',
    },
    {
      category: 'Forms',
      title: 'Newsletter signup strip',
      description: 'Footer email capture with honeypot-safe markup.',
      prompt:
        'Build a compact newsletter signup strip for the footer: email input, submit button, short privacy line. Use <form data-ezlaunch name="newsletter"> with a single email field. Mobile-friendly flex layout. CSS only, matching indigo accent colors.',
    },
    {
      category: 'Design',
      title: 'Feature card grid (6 cards)',
      description: 'Bento-style features section for hosting product.',
      prompt:
        'Design a 6-card feature grid for a static hosting platform: Custom domains, Built-in analytics, Form backend, One-click deploy, Free SSL, Code editor. Each card has an icon area (CSS or inline SVG), title, and 2-line description. Use CSS grid: 3 columns desktop, 2 tablet, 1 mobile. Subtle hover lift and border glow on indigo theme.',
    },
    {
      category: 'Design',
      title: 'Pricing table (4 tiers)',
      description: 'Free, Starter, Pro, Agency comparison.',
      prompt:
        'Create an accessible pricing comparison with 4 tiers: Free ($0), Starter ($5/mo), Pro ($10/mo), Agency ($19/mo). Highlight Pro as "Most popular". Each card lists 6–8 features with checkmarks. CTA buttons link to /signup with plan query params. Responsive: horizontal scroll on small screens or stacked cards. HTML + CSS only.',
    },
    {
      category: 'Content',
      title: 'Blog post layout (static)',
      description: 'Article template matching marketing site.',
      prompt:
        'Create a blog article page template: centered max-width column, hero image placeholder, h1 title, meta line (date · read time), prose styles for h2/h3/p/blockquote/code, inline CTA box mid-article, and related posts footer. Match a modern SaaS blog aesthetic. Single HTML file with embedded critical CSS or linked stylesheet.',
    },
    {
      category: 'Content',
      title: 'Why static HTML — thought leadership',
      description: 'Long-form post angle for AI builders.',
      prompt:
        'Write an 800-word blog post titled "Static HTML Websites Are the Future for AI-Built Sites." Audience: developers using Claude, Cursor, and Bolt. Cover: speed, security, no server bills, EZ to host, AI generates HTML well, when SPAs are overkill. Conversational tone, short paragraphs, one CTA to try static hosting. Include suggested h2 subheads.',
    },
    {
      category: 'Refactor',
      title: 'React build → static export',
      description: 'Strip runtime for EZLaunch-compatible output.',
      prompt:
        'I have a React/Vite project. Explain how to produce a static folder I can deploy to EZLaunch: build command, output directory (dist), moving index.html to root if needed, replacing client-side routing with separate HTML files or hash routes. List what will NOT work (API routes, SSR).',
    },
    {
      category: 'Refactor',
      title: 'Split one-page into multi-page site',
      description: 'Contact, privacy, blog without a framework.',
      prompt:
        'I have a single index.html with all sections. Split it into a multi-page static site: index.html (marketing), contact.html, privacy.html, terms.html. Extract shared nav and footer into consistent markup across files. Update internal links. Keep one shared styles.css. Provide a migration checklist.',
    },
    {
      category: 'Analytics',
      title: 'Privacy-friendly analytics copy',
      description: 'Explain Umami-style tracking to users.',
      prompt:
        'Write 3 short paragraphs for a "Analytics" feature card and a FAQ answer explaining that pageviews are tracked without cookies, no personal data sold, GDPR-friendly. Audience is non-technical founders. Mention subdomain and custom domain tracking. Tone: clear and reassuring.',
    },
  ];

  const gate = document.getElementById('prompt-gate');
  const gateForm = document.getElementById('prompt-gate-form');
  const emailInput = document.getElementById('prompt-gate-email');
  const library = document.getElementById('prompt-library');
  const grid = document.getElementById('prompt-grid');
  const filters = document.getElementById('prompt-filters');
  const welcome = document.getElementById('prompt-welcome-email');

  if (!gate || !gateForm || !library || !grid) return;

  const gateText = document.querySelector('.prompt-gate__text');
  if (gateText) {
    gateText.textContent = gateText.textContent.replace('{{count}}', String(PROMPTS.length));
  }

  let activeCategory = 'All';

  function getStoredAccess() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data?.email && EMAIL_RE.test(data.email)) return data.email;
    } catch {
      /* ignore */
    }
    return null;
  }

  function storeAccess(email) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, unlockedAt: Date.now() }));
  }

  function unlock(email) {
    storeAccess(email);
    document.body.classList.add('page-prompts--unlocked');
    gate.hidden = true;
    const preview = document.getElementById('prompt-preview');
    if (preview) preview.hidden = true;
    gate.setAttribute('aria-hidden', 'true');
    library.hidden = false;
    library.removeAttribute('aria-hidden');
    if (welcome && email) {
      welcome.textContent = email;
      welcome.closest('.prompt-welcome')?.removeAttribute('hidden');
    }
    renderPrompts();
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }
  }

  function getCategories() {
    const cats = new Set(PROMPTS.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }

  function renderFilters() {
    if (!filters) return;
    filters.innerHTML = '';
    getCategories().forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'prompt-filter' + (cat === activeCategory ? ' prompt-filter--active' : '');
      btn.textContent = cat;
      btn.dataset.category = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        filters.querySelectorAll('.prompt-filter').forEach((el) => {
          el.classList.toggle('prompt-filter--active', el.dataset.category === cat);
        });
        renderPrompts();
      });
      filters.appendChild(btn);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPrompts() {
    const list =
      activeCategory === 'All'
        ? PROMPTS
        : PROMPTS.filter((p) => p.category === activeCategory);

    grid.innerHTML = list
      .map(
        (p, i) => `
      <article class="prompt-card" data-prompt-id="${i}">
        <div class="prompt-card__top">
          <span class="prompt-card__category">${escapeHtml(p.category)}</span>
          <button type="button" class="prompt-card__copy" data-copy aria-label="Copy prompt">
            <span class="prompt-card__copy-label">Copy</span>
          </button>
        </div>
        <h2 class="prompt-card__title">${escapeHtml(p.title)}</h2>
        <p class="prompt-card__desc">${escapeHtml(p.description)}</p>
        <div class="prompt-card__body">
          <pre class="prompt-card__text">${escapeHtml(p.prompt)}</pre>
        </div>
      </article>`
      )
      .join('');

    grid.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('.prompt-card');
        const pre = card?.querySelector('.prompt-card__text');
        const text = pre?.textContent;
        if (!text) return;

        try {
          await navigator.clipboard.writeText(text);
          const label = btn.querySelector('.prompt-card__copy-label');
          if (label) {
            const prev = label.textContent;
            label.textContent = 'Copied!';
            btn.classList.add('prompt-card__copy--done');
            setTimeout(() => {
              label.textContent = prev;
              btn.classList.remove('prompt-card__copy--done');
            }, 2000);
          }
        } catch {
          /* fallback ignored */
        }
      });
    });
  }

  gateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput?.value?.trim() || '';
    if (!EMAIL_RE.test(email)) {
      emailInput?.setCustomValidity('Enter a valid email address');
      emailInput?.reportValidity();
      return;
    }
    emailInput?.setCustomValidity('');
    unlock(email);
  });

  emailInput?.addEventListener('input', () => emailInput.setCustomValidity(''));

  renderFilters();

  const saved = getStoredAccess();
  if (saved) {
    unlock(saved);
  }
})();
