/* ================================================================
   PRESS COMP INTERNATIONAL — MAIN JS
   Developed by SoftSite Solutions | softsitesolution.in
   ================================================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '919876543210';
  const SOFTSITESOLUTIONS_URL = 'https://softsitesolution.in';
  const CS_REDIRECT_DELAY = 4000; // ms before auto-redirect

  /* ─── Demo Banner ─── */
  function initDemoBanner() {
    const banner = document.getElementById('demo-banner');
    const close = document.getElementById('db-close');
    const navbar = document.getElementById('navbar');

    function adjustNavTop() {
      if (banner && navbar) {
        const bh = banner.offsetHeight;
        navbar.style.top = bh + 'px';
      }
    }

    adjustNavTop();
    window.addEventListener('resize', adjustNavTop);

    close?.addEventListener('click', () => {
      if (banner) {
        banner.style.transition = 'all .3s ease';
        banner.style.height = banner.offsetHeight + 'px';
        requestAnimationFrame(() => {
          banner.style.height = '0';
          banner.style.overflow = 'hidden';
          banner.style.padding = '0';
        });
        setTimeout(() => {
          banner.style.display = 'none';
          if (navbar) navbar.style.top = '0';
        }, 320);
      }
    });
  }

  /* ─── Sticky Navbar ─── */
  function initNavbar() {
    const navMain = document.querySelector('.nav-main');
    window.addEventListener('scroll', () => {
      navMain?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Active link highlighting for both direct links and dropdown parents
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      const isActive = href === page || (page.includes('products') && href?.includes('products')) || (page.includes('industries') && href?.includes('industries'));
      a.classList.toggle('active', isActive);
      
      // Highlight parent span in desktop dropdown if a sublink is active
      if (isActive && a.classList.contains('dropdown-link')) {
        a.closest('.nav-item')?.querySelector('span')?.classList.add('active');
      }
    });

    // Handle direct link active state for top-level nav items that are spans
    document.querySelectorAll('.nav-item').forEach(item => {
      const span = item.querySelector('span');
      if (span) {
        const text = span.textContent.toLowerCase();
        if ((page.includes('products') && text.includes('product')) || (page.includes('industries') && text.includes('industries'))) {
          span.classList.add('active');
        }
      }
    });
  }

  /* ─── Mobile Menu ─── */
  function initMobileMenu() {
    const ham      = document.getElementById('hamburger');
    const menu     = document.getElementById('mobileMenu');
    const close    = document.getElementById('mobileClose');
    const backdrop = document.getElementById('mmBackdrop');

    if (!menu) return;

    // Highlight active page link
    const page = location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('.mm-nav a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });

    function openMenu() {
      menu.classList.add('open');
      backdrop.classList.add('show');
      ham?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      menu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      menu.classList.remove('open');
      backdrop.classList.remove('show');
      ham?.classList.remove('is-open');
      document.body.style.overflow = '';
      menu.setAttribute('aria-hidden', 'true');
    }

    ham?.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
    close?.addEventListener('click', closeMenu);
    backdrop?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    // Accordion Logic
    const dropdowns = menu.querySelectorAll('.mm-dropdown');
    dropdowns.forEach(dd => {
      const btn = dd.querySelector('.mm-drop-btn');
      btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        
        // Close others
        dropdowns.forEach(other => {
          other.querySelector('.mm-drop-btn')?.setAttribute('aria-expanded', 'false');
        });

        btn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    });

    // Close when a nav link is clicked
    menu.querySelectorAll('.mm-nav a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ─── Scroll Reveal ─── */
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ─── Counter Animate ─── */
  function animateCounter(el, target, duration, suffix) {
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = '1';
          animateCounter(e.target, +e.target.dataset.target, 2000, e.target.dataset.suffix || '');
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
  }

  /* ─── Tab Filter (Products / Gallery) ─── */
  function initTabs() {
    document.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.tab-row, .tab-section, section, div')
          ?.querySelectorAll('.tab-btn[data-filter]')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('[data-category]').forEach(card => {
          const match = f === 'all' || card.dataset.category === f;
          card.style.display = match ? '' : 'none';
          if (match) card.style.animation = 'fadeIn .35s ease both';
        });
      });
    });

    // Gallery tabs
    document.querySelectorAll('[data-gfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('div')?.querySelectorAll('[data-gfilter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.gfilter;
        document.querySelectorAll('[data-gcategory]').forEach(item => {
          item.style.display = (f === 'all' || item.dataset.gcategory === f) ? '' : 'none';
        });
      });
    });
  }

  /* ─── Hero Particles ─── */
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        width:${1 + Math.random() * 3}px;height:${1 + Math.random() * 3}px;
        --d:${6 + Math.random() * 10}s;
        animation-delay:${-Math.random() * 12}s;
        opacity:${.15 + Math.random() * .4};
      `;
      container.appendChild(p);
    }
  }

  /* ─── Gallery Lightbox ─── */
  function initLightbox() {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      display:none;position:fixed;inset:0;background:rgba(0,0,0,.94);
      z-index:9990;align-items:center;justify-content:center;cursor:zoom-out;
    `;
    lb.innerHTML = `
      <button id="closeLb" style="position:absolute;top:18px;right:22px;color:#fff;font-size:2.4rem;background:none;border:none;cursor:pointer;z-index:10;">×</button>
      <img id="lbImg" style="max-width:90vw;max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.9);" alt="Gallery image"/>
    `;
    document.body.appendChild(lb);

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const s = item.querySelector('img')?.src;
        if (!s) return;
        lb.querySelector('#lbImg').src = s;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const close = () => { lb.style.display = 'none'; document.body.style.overflow = ''; };
    lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'closeLb') close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ─── Scroll-to-Top Button ─── */
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('vis', scrollY > 400), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── COMING SOON — Inquiry Form ─── */
  function initComingSoon() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showComingSoon();
    });
  }

  function showComingSoon() {
    // Create overlay if not already in DOM
    let overlay = document.getElementById('csOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'csOverlay';
      overlay.className = 'cs-overlay';

      overlay.innerHTML = `
        <div class="cs-box">
          <div class="cs-icon">📬</div>
          <h2 class="cs-title">Email Feature Coming Soon!</h2>
          <p class="cs-text">Our automated enquiry system is currently being set up. In the meantime, please reach out to us directly via WhatsApp or phone — we respond within 2 hours!</p>
          <div class="cs-timer" id="csCountdown">Redirecting in 4 seconds…</div>
          <div class="cs-btns">
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Press%20Comp%20International%2C%20I%20would%20like%20to%20request%20a%20quote." class="cs-link" target="_blank" rel="noopener">💬 Chat on WhatsApp Instead</a>
            <a href="${SOFTSITESOLUTIONS_URL}" class="cs-link" target="_blank" rel="noopener" style="background:linear-gradient(135deg,#7c3aed,#a855f7);">🌐 Visit SoftSite Solutions</a>
            <button class="cs-cancel" id="csCancelBtn">← Go Back to Form</button>
          </div>
          <div class="cs-brand">Demo Website Developed by <a href="${SOFTSITESOLUTIONS_URL}" target="_blank">SoftSite Solutions</a></div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.getElementById('csCancelBtn')?.addEventListener('click', () => {
        clearInterval(window._csTimer);
        overlay.classList.remove('show');
      });
    }

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Countdown
    let secs = CS_REDIRECT_DELAY / 1000;
    const countdown = overlay.querySelector('#csCountdown');
    clearInterval(window._csTimer);
    window._csTimer = setInterval(() => {
      secs--;
      if (countdown) countdown.textContent = `Redirecting in ${secs} second${secs !== 1 ? 's' : ''}…`;
      if (secs <= 0) {
        clearInterval(window._csTimer);
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        window.open(SOFTSITESOLUTIONS_URL, '_blank');
      }
    }, 1000);

    // Allow close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        clearInterval(window._csTimer);
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Init All ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initDemoBanner();
    initNavbar();
    initMobileMenu();
    initReveal();
    initCounters();
    initTabs();
    initParticles();
    initLightbox();
    initScrollTop();
    initComingSoon();
  });

})();
