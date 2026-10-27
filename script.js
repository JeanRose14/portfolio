/* ═══════════════════════════════════════════════
   JEAN ROSE BANAY — Portfolio JS
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Theme Toggle ─── */
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') applyTheme('dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  /* ─── Mobile Navigation ─── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── Active Nav Link on Scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ─── Clean URLs — anchor navigation without #hash in the address bar ─── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView();
    history.replaceState(null, '', location.pathname + location.search);
  });

  // Strip any #hash from the URL after the browser's initial anchor jump
  // (so shared links like /#contact still scroll correctly, but stay clean)
  if (location.hash) {
    var jumpTarget = document.getElementById(location.hash.slice(1));
    window.addEventListener('load', function () {
      if (jumpTarget) jumpTarget.scrollIntoView();
      history.replaceState(null, '', location.pathname + location.search);
    });
  }

  /* ─── Section Entrance Animation ─── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('.section').forEach(function (s) {
      s.classList.add('visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section').forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ─── Project Cards — Keyboard & Click ─── */
  document.querySelectorAll('.project-card').forEach(function (card) {
    var url = card.getAttribute('data-url');
    if (!url) return;

    card.addEventListener('click', function () {
      window.open(url, '_blank', 'noopener');
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(url, '_blank', 'noopener');
      }
    });
  });

  /* ─── Contact Form ─── */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = form.querySelector('.form-note');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      // Basic validation
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        note.textContent = 'Please fill in all fields.';
        note.className = 'form-note error';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        note.textContent = 'Please enter a valid email address.';
        note.className = 'form-note error';
        return;
      }

      // No backend — open mailto as fallback
      var subject = encodeURIComponent('Portfolio inquiry from ' + name.value.trim());
      var body = encodeURIComponent(message.value.trim() + '\n\n— ' + name.value.trim() + '\n' + email.value.trim());

      note.textContent = 'Opening your email client… If it doesn\u2019t open, please email jeanrosebanay14@gmail.com directly.';
      note.className = 'form-note success';

      window.location.href = 'mailto:jeanrosebanay14@gmail.com?subject=' + subject + '&body=' + body;

      form.reset();
    });
  }

  /* ─── Navbar shadow on scroll ─── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

})();