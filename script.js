/* ===== ORIGIN GLOBAL SCRIPT ===== */

(function () {
  'use strict';

  /* ── Page Load Fade-In ── */
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });
  });

  /* ── Active Nav Link ── */
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  setActiveNav();

  /* ── Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Smooth Page-Leave Fade ── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href && !href.startsWith('#') && !href.startsWith('http') &&
      href.endsWith('.html') && !link.hasAttribute('target')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.25s ease';
        setTimeout(() => { window.location.href = href; }, 260);
      });
    }
  });

  /* ── Intersection Observer (Scroll Reveal) ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Mouse-Follow Glow on Cards ── */
  function initCardGlow() {
    document.querySelectorAll('.glass-card').forEach(card => {
      // Inject glow element if not already present
      if (!card.querySelector('.card-glow')) {
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        card.insertBefore(glow, card.firstChild);
      }

      const glow = card.querySelector('.card-glow');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(92, 115, 182, 0.08) 0%, transparent 70%)`;
      });

      card.addEventListener('mouseleave', () => {
        glow.style.background = 'none';
      });
    });
  }

  initCardGlow();

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Legal Tabs ── */
  document.querySelectorAll('.legal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      document.querySelectorAll('.legal-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.legal-doc').forEach(d => d.classList.remove('active'));

      tab.classList.add('active');
      const doc = document.getElementById(target);
      if (doc) doc.classList.add('active');
    });
  });

})();
