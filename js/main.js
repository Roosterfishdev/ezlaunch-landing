(function () {
      'use strict';

      /* ─── Sticky nav glass effect ─── */
      const nav = document.getElementById('nav');
      if (nav) {
        const onScroll = () => {
          nav.classList.toggle('scrolled', window.scrollY > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }

      /* ─── Mobile nav ─── */
      const navOverlay = document.getElementById('nav-overlay');
      const navBurger = document.getElementById('nav-burger');
      const navDrawer = document.getElementById('nav-drawer');
      const navRoot = document.getElementById('nav');

      function setNavOpen(open) {
        navRoot.classList.toggle('nav--open', open);
        navOverlay.classList.toggle('is-visible', open);
        navOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
        navDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
      }

      if (navBurger && navOverlay && navDrawer && navRoot) {
        navBurger.addEventListener('click', () => setNavOpen(!navRoot.classList.contains('nav--open')));
        navOverlay.addEventListener('click', () => setNavOpen(false));
        navDrawer.querySelectorAll('a').forEach((a) => {
          a.addEventListener('click', () => setNavOpen(false));
        });
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') setNavOpen(false);
        });

        window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
          if (e.matches) setNavOpen(false);
        });
      }

      /* ─── Hero: how it works button ─── */
      const heroHowBtn = document.getElementById('hero-how-it-works-btn');
      const howSection = document.getElementById('how-it-works');
      if (heroHowBtn && howSection) {
        heroHowBtn.addEventListener('click', () => {
          howSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      /* ─── Hero badge: rotating audience label ─── */
      const badgeRotate = document.getElementById('hero-badge-rotate');
      const badgeInner = badgeRotate && badgeRotate.closest('.hero__badge-inner');
      if (badgeRotate && badgeInner && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const BADGE_PHRASES = ['AI Builders', 'Vibe Coders', 'Developers', 'Owners', 'Designers'];
        const BADGE_INTERVAL_MS = 2800;
        const BADGE_FADE_MS = 400;
        let badgeIndex = 0;

        function syncBadgeWidth() {
          const currentWidth = badgeInner.offsetWidth;
          badgeInner.style.width = `${currentWidth}px`;
          badgeInner.style.width = 'auto';
          const nextWidth = badgeInner.offsetWidth;
          badgeInner.style.width = `${currentWidth}px`;
          requestAnimationFrame(() => {
            badgeInner.style.width = `${nextWidth}px`;
          });
        }

        badgeInner.style.width = `${badgeInner.offsetWidth}px`;

        const cycleBadgePhrase = () => {
          badgeRotate.classList.add('is-out');
          window.setTimeout(() => {
            badgeIndex = (badgeIndex + 1) % BADGE_PHRASES.length;
            badgeRotate.textContent = BADGE_PHRASES[badgeIndex];
            badgeRotate.classList.remove('is-out');
            syncBadgeWidth();
          }, BADGE_FADE_MS);
        };

        window.setInterval(cycleBadgePhrase, BADGE_INTERVAL_MS);
      }

      /* ─── Pricing billing toggle ─── */
      const PRICE_GRID = {
        monthly: {
          free: { main: '$0', sub: '' },
          starter: { main: '$5', sub: '/mo' },
          pro: { main: '$10', sub: '/mo' },
          agency: { main: '$19', sub: '/mo' },
        },
        yearly: {
          free: { main: '—', sub: '' },
          starter: { main: '$40', sub: '/yr' },
          pro: { main: '$100', sub: '/yr' },
          agency: { main: '$190', sub: '/yr' },
        },
      };

      function applyBilling(mode) {
        document.querySelectorAll('.pricing-card').forEach((card) => {
          const plan = card.dataset.plan;
          const elMain = card.querySelector('.js-price-main');
          const elSub = card.querySelector('.js-price-sub');
          const d = PRICE_GRID[mode][plan];
          if (elMain && d) elMain.textContent = d.main;
          if (elSub && d) elSub.textContent = d.sub;
        });
      }

      const monthlyBtn = document.getElementById('billing-monthly');
      const yearlyBtn = document.getElementById('billing-yearly');
      if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener('click', () => {
          monthlyBtn.classList.add('is-active');
          yearlyBtn.classList.remove('is-active');
          applyBilling('monthly');
        });
        yearlyBtn.addEventListener('click', () => {
          yearlyBtn.classList.add('is-active');
          monthlyBtn.classList.remove('is-active');
          applyBilling('yearly');
        });
      }

      /* ─── How it works: deploy tab demo ─── */
      const deployDemo = document.getElementById('how-deploy-demo');
      if (deployDemo) {
        const deployTabs = deployDemo.querySelectorAll('.how-deploy__tab');
        let activeDeployTab = 'zip';

        function setDeployTab(tab) {
          activeDeployTab = tab;
          deployDemo.dataset.activeTab = tab;
          deployTabs.forEach((btn) => {
            const isActive = btn.dataset.tab === tab;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
          const zipPanel = deployDemo.querySelector('.how-deploy__panel--zip');
          const ghPanel = deployDemo.querySelector('.how-deploy__panel--github');
          if (zipPanel) zipPanel.hidden = tab !== 'zip';
          if (ghPanel) ghPanel.hidden = tab !== 'github';
        }

        deployTabs.forEach((btn) => {
          btn.addEventListener('click', () => setDeployTab(btn.dataset.tab));
        });

        setDeployTab('zip');

        setInterval(() => {
          setDeployTab(activeDeployTab === 'zip' ? 'github' : 'zip');
        }, 4000);
      }

      /* ─── How it works: terminal typewriter + copy ─── */
      const CLI_COPY_COMMANDS = [
        'npm install -g ezlaunch',
        'ezlaunch login',
        'ezlaunch deploy',
      ].join('\n');

      const terminal = document.getElementById('how-terminal');
      const copyBtn = document.getElementById('cli-copy-btn');

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(CLI_COPY_COMMANDS);
            const prev = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = prev;
            }, 2000);
          } catch (_) {
            /* Clipboard unavailable */
          }
        });
      }

      if (terminal && 'IntersectionObserver' in window) {
        const termObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                terminal.classList.add('is-visible');
                termObserver.disconnect();
              }
            });
          },
          { threshold: 0.35 }
        );
        termObserver.observe(terminal);
      } else if (terminal) {
        terminal.classList.add('is-visible');
      }
    })();
