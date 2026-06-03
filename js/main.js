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

      /* ─── Hero badge: rotating audience label ─── */
      const badgeRotate = document.getElementById('hero-badge-rotate');
      if (badgeRotate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const BADGE_PHRASES = ['AI Builders', 'Vibe Coders', 'Developers', 'Owners', 'Designers'];
        const BADGE_INTERVAL_MS = 2800;
        const BADGE_FADE_MS = 400;
        let badgeIndex = 0;

        const probe = document.createElement('span');
        probe.className = badgeRotate.className;
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;';
        document.body.appendChild(probe);
        let badgeMaxWidth = 0;
        BADGE_PHRASES.forEach((phrase) => {
          probe.textContent = phrase;
          badgeMaxWidth = Math.max(badgeMaxWidth, probe.offsetWidth);
        });
        probe.remove();
        badgeRotate.style.minWidth = `${badgeMaxWidth}px`;

        const cycleBadgePhrase = () => {
          badgeRotate.classList.add('is-out');
          window.setTimeout(() => {
            badgeIndex = (badgeIndex + 1) % BADGE_PHRASES.length;
            badgeRotate.textContent = BADGE_PHRASES[badgeIndex];
            badgeRotate.classList.remove('is-out');
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

      /* ─── ZIP mockup animation (loops) ─── */
      const ZIP_DEPLOY_MS = 1200;
      const ZIP_STEP_GAP_MS = 290;
      const ZIP_DEPLOY_FINISH_MS = ZIP_DEPLOY_MS + ZIP_STEP_GAP_MS * 4 + 420;
      const ZIP_LIVE_MS = ZIP_DEPLOY_FINISH_MS + 320;
      const ZIP_PREVIEW_MS = ZIP_LIVE_MS + 920;
      const ZIP_PREVIEW_HOLD_MS = 6200;

      const panelZip = document.getElementById('flow-zip');
      if (!panelZip) return;

      let cycleTimer = null;
      let stepTimers = [];

      function clearTimers() {
        stepTimers.forEach(id => {
          clearTimeout(id);
          clearInterval(id);
        });
        stepTimers = [];
        if (cycleTimer) clearTimeout(cycleTimer);
        cycleTimer = null;
      }

      function schedule(fn, ms) {
        const id = setTimeout(fn, ms);
        stepTimers.push(id);
        return id;
      }

      function resetDeploySteps() {
        for (let i = 1; i <= 4; i++) {
          const el = document.getElementById('zip-step-' + i);
          el.classList.remove('deploy-step--active', 'deploy-step--done', 'deploy-step--muted');
          el.classList.add('deploy-step--pending');
        }
      }

      function setDeployActive(activeIx) {
        for (let i = 1; i <= 4; i++) {
          const el = document.getElementById('zip-step-' + i);
          el.classList.remove('deploy-step--pending', 'deploy-step--active', 'deploy-step--done', 'deploy-step--muted');
          if (i < activeIx) el.classList.add('deploy-step--done');
          else if (i === activeIx) el.classList.add('deploy-step--active');
          else el.classList.add('deploy-step--pending');
        }
      }

      function setAllDeployDone() {
        for (let i = 1; i <= 4; i++) {
          const el = document.getElementById('zip-step-' + i);
          el.classList.remove('deploy-step--pending', 'deploy-step--active');
          el.classList.add('deploy-step--done');
          if (i === 4) el.classList.add('deploy-step--muted');
        }
      }

      function resetZipFlow() {
        panelZip.classList.add('resetting');
        panelZip.dataset.stage = 'idle';

        const dropZone = document.getElementById('zip-drop');
        dropZone.classList.remove('dimmed', 'is-landing');

        const zipBrowser = document.getElementById('zip-browser');
        zipBrowser.classList.remove('visible');

        resetDeploySteps();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => panelZip.classList.remove('resetting'));
        });
      }

      function runZipAnimation() {
        resetZipFlow();

        const dropZone = document.getElementById('zip-drop');

        schedule(() => {
          panelZip.dataset.stage = 'drop';
          dropZone.classList.add('is-landing');
          schedule(() => dropZone.classList.remove('is-landing'), 920);
        }, 300);

        schedule(() => {
          panelZip.dataset.stage = 'deploy';
          setDeployActive(1);
        }, ZIP_DEPLOY_MS);

        schedule(() => setDeployActive(2), ZIP_DEPLOY_MS + ZIP_STEP_GAP_MS);
        schedule(() => setDeployActive(3), ZIP_DEPLOY_MS + ZIP_STEP_GAP_MS * 2);
        schedule(() => setDeployActive(4), ZIP_DEPLOY_MS + ZIP_STEP_GAP_MS * 3);
        schedule(() => setAllDeployDone(), ZIP_DEPLOY_FINISH_MS);

        schedule(() => {
          panelZip.dataset.stage = 'live';
        }, ZIP_LIVE_MS);

        schedule(() => {
          panelZip.dataset.stage = 'preview';
          document.getElementById('zip-browser').classList.add('visible');
        }, ZIP_PREVIEW_MS);
      }

      function runZipDemoLoop() {
        clearTimers();
        runZipAnimation();

        cycleTimer = setTimeout(runZipDemoLoop, ZIP_PREVIEW_MS + ZIP_PREVIEW_HOLD_MS);
      }

      runZipDemoLoop();
    })();
