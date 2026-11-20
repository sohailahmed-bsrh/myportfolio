/**
 * SOHAIL AHMED PORTFOLIO - MAIN CLIENT SCRIPT v2
 * High-performance, accessible, vanilla JS + GSAP animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── GSAP setup ───────────────────────────────────────────
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // ── 1. Full-Screen Curtain Page Transitions ──────────────
  initCurtainTransition();

  // ── 2. Slide-In Side Panel (Drawer) ─────────────────────
  initNavDrawer();

  // ── 3. Lightbox Preview Modal ────────────────────────────
  initLightboxModal();

  // ── 4. Active Nav Link Detection ─────────────────────────
  initActiveLinks();

  // ── 5. Navbar Scrolled State ─────────────────────────────
  initNavbarScroll();

  // ── 6. Typewriter Effect (Hero) ──────────────────────────
  initTypewriter();

  // ── 7. Hero Visual Animations & Parallax ────────────────
  initHeroVisual();

  // ── 8. Project Filtering ─────────────────────────────────
  initProjectFilters();

  // ── 9. Contact Form AJAX Handling ────────────────────────
  initContactForm();

  // ── 10. Scroll Reveals & Back to Top ─────────────────────
  initScrollReveals();
  initBackToTop();
});

/* ============================================================
   1. CURTAIN PAGE TRANSITIONS
   ============================================================ */
function initCurtainTransition() {
  const curtain = document.getElementById('page-curtain');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On page load: reveal current page
  if (curtain && !prefersReducedMotion) {
    curtain.classList.remove('wipe-in');
    curtain.classList.add('wipe-out');
    setTimeout(() => {
      curtain.classList.remove('wipe-out');
    }, 700);
  }

  // Handle browser Back / Forward cache (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (curtain) {
      curtain.classList.remove('wipe-in');
      if (event.persisted) {
        curtain.classList.add('wipe-out');
        setTimeout(() => curtain.classList.remove('wipe-out'), 600);
      }
    }
  });

  // Intercept internal navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Filter out external, hash, protocols, PDFs, download, target="_blank"
    const isInternal = !href.startsWith('http') &&
                       !href.startsWith('#') &&
                       !href.startsWith('mailto:') &&
                       !href.startsWith('tel:') &&
                       !href.startsWith('javascript:') &&
                       !href.endsWith('.pdf') &&
                       !link.hasAttribute('download') &&
                       link.getAttribute('target') !== '_blank';

    if (isInternal) {
      link.addEventListener('click', (e) => {
        // Do not hijack Ctrl/Cmd/Shift/Alt clicks or non-primary mouse clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        // If reduced motion or no curtain element, default browser navigation
        if (prefersReducedMotion || !curtain) return;

        e.preventDefault();
        curtain.classList.remove('wipe-out');
        curtain.classList.add('wipe-in');

        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });
}

/* ============================================================
   2. SLIDE-IN SIDE PANEL (DRAWER)
   ============================================================ */
function initNavDrawer() {
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');

  if (!drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    if (toggleBtn) {
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    if (toggleBtn) {
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close when clicking any drawer link
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ============================================================
   3. LIGHTBOX PREVIEW MODAL
   ============================================================ */
function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const backdrop = modal ? modal.querySelector('.lightbox-backdrop') : null;

  if (!modal || !imgEl) return;

  window.openLightbox = function(src, caption) {
    imgEl.src = src;
    imgEl.alt = caption || 'Preview';
    if (captionEl) captionEl.textContent = caption || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  function closeLightbox() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { imgEl.src = ''; }, 300);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* ============================================================
   4. ACTIVE NAV LINK DETECTION
   ============================================================ */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const targetPage = currentPath === '' ? 'index.html' : currentPath;

  // Header desktop links
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === targetPage || (targetPage === 'index.html' && (href === '' || href === '/'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Drawer links
  document.querySelectorAll('.nav-drawer .drawer-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === targetPage || (targetPage === 'index.html' && (href === '' || href === '/'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ============================================================
   5. NAVBAR SCROLL STATE
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 35);
  }, { passive: true });
}

/* ============================================================
   6. TYPEWRITER EFFECT (HERO)
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    "AI Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "Generative AI Developer",
    "AI Agents Architect",
    "RAG Systems Builder",
    "FastAPI & MLOps Developer"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentWord.substring(0, charIndex);
      typingSpeed = 45;
    } else {
      charIndex++;
      el.textContent = currentWord.substring(0, charIndex);
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 350; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================================
   7. HERO VISUAL ANIMATIONS & PARALLAX
   ============================================================ */
function initHeroVisual() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroVisual = document.getElementById('hero-parallax-container');
  if (!heroVisual || typeof gsap === 'undefined') return;

  const layers = heroVisual.querySelectorAll('.parallax-layer');

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.03;
      gsap.to(layer, {
        x: x * speed,
        y: y * speed,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    gsap.to(layers, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
  });
}

/* ============================================================
   8. PROJECT FILTERING
   ============================================================ */
function initProjectFilters() {
  const filterBar = document.getElementById('project-filter-bar');
  const grid = document.getElementById('projects-grid');
  const emptyState = document.getElementById('projects-empty-state');

  if (!filterBar || !grid) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = grid.querySelectorAll('.proj-card');

  function filter(category) {
    let count = 0;

    cards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const catList = cats.split(' ');
      const match = category === 'all' || catList.includes(category);

      if (match) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        count++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 280);
      }
    });

    if (emptyState) {
      emptyState.style.display = count === 0 ? 'block' : 'none';
    }

    buttons.forEach(btn => {
      const btnCat = btn.getAttribute('data-filter');
      btn.classList.toggle('active', btnCat === category);
    });

    history.replaceState(null, null, category === 'all' ? window.location.pathname : `#category=${category}`);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filter(cat);
    });
  });

  // Hash check on initial load
  const hash = window.location.hash;
  if (hash.startsWith('#category=')) {
    const initialCat = hash.replace('#category=', '');
    filter(initialCat);
  } else {
    cards.forEach(card => {
      card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
    });
  }
}

/* ============================================================
   9. CONTACT FORM HANDLING (WEB3FORMS / FORMSPREE)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status') || createStatusElement(form);
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    const hp = form.querySelector('input[name="_honey"]');
    if (hp && hp.value) {
      return; // Bot detected, silently abort
    }

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]') ? form.querySelector('[name="subject"]').value.trim() : 'Portfolio Inquiry';
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph-bold ph-spinner" style="animation:spin 1s linear infinite;"></i> Sending...';

    // Access key placeholder: defaults to Web3Forms API
    const accessKey = form.getAttribute('data-access-key') || 'b9a67a03-72ce-4f76-880b-47e24bcf8198';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: name,
          email: email,
          subject: subject || 'Portfolio Message from ' + name,
          message: message,
          from_name: 'Sohail Ahmed Portfolio Contact Form'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showStatus('Thank you! Your message has been sent successfully. I will get back to you shortly.', 'success');
        form.reset();
      } else {
        // Fallback to mailto link
        const mailtoUrl = `mailto:ahmed241126@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        showStatus(`Message could not send directly. Click to <a href="${mailtoUrl}" style="color:var(--cyan);text-decoration:underline;">send directly via email</a>.`, 'error');
      }
    } catch (err) {
      const mailtoUrl = `mailto:ahmed241126@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      showStatus(`Network issue. Click to <a href="${mailtoUrl}" style="color:var(--cyan);text-decoration:underline;">send directly via email</a>.`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });

  function showStatus(msg, type) {
    statusEl.innerHTML = msg;
    statusEl.className = 'form-status ' + type;
    statusEl.style.display = 'block';
  }

  function createStatusElement(parent) {
    const div = document.createElement('div');
    div.id = 'form-status';
    div.className = 'form-status';
    parent.appendChild(div);
    return div;
  }
}

/* ============================================================
   10. SCROLL REVEALS & BACK TO TOP
   ============================================================ */
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Single element reveals
  document.querySelectorAll('.gsap-reveal').forEach(el => {
    gsap.fromTo(el,
      { y: 25, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform'
      }
    );
  });

  // Stagger groups
  document.querySelectorAll('.gsap-stagger').forEach(container => {
    gsap.fromTo(container.children,
      { y: 25, opacity: 0 },
      {
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'transform'
      }
    );
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
