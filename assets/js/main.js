/**
 * SOHAIL AHMED PORTFOLIO - MAIN CLIENT SCRIPT v3
 * High-performance, accessible, vanilla JS + View Transitions.
 * No curtains, no overlays, instant transitions, zero console errors.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Instant Link Prefetching for seamless navigation
  initLinkPrefetch();

  // 2. Slide-In Side Panel (Drawer)
  initNavDrawer();

  // 3. Lightbox Preview Modal
  initLightboxModal();

  // 4. Active Nav Link Detection
  initActiveLinks();

  // 5. Header Scrolled State
  initHeaderScroll();

  // 6. Hero Typewriter Effect (Distinct Specialties Only)
  initTypewriter();

  // 7. Stat Count-Up Animation
  initStatCountUp();

  // 8. Hero Visual Tilt Parallax
  initHeroVisual();

  // 9. Project Category Filtering
  initProjectFilters();

  // 10. Contact Form AJAX Handling
  initContactForm();

  // 11. Scroll Reveals & Back to Top
  initScrollReveals();
  initBackToTop();
});

/* ============================================================
   1. INSTANT LINK PREFETCHING (SEAMLESS VIEW TRANSITIONS)
   ============================================================ */
function initLinkPrefetch() {
  const prefetched = new Set();

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Only internal html pages
    const isInternalPage = !href.startsWith('http') &&
                           !href.startsWith('#') &&
                           !href.startsWith('mailto:') &&
                           !href.startsWith('tel:') &&
                           !href.endsWith('.pdf') &&
                           !link.hasAttribute('download') &&
                           link.getAttribute('target') !== '_blank';

    if (!isInternalPage) return;

    const prefetch = () => {
      const cleanHref = href.split('?')[0].split('#')[0];
      if (prefetched.has(cleanHref)) return;
      prefetched.add(cleanHref);

      const linkElem = document.createElement('link');
      linkElem.rel = 'prefetch';
      linkElem.href = cleanHref;
      document.head.appendChild(linkElem);
    };

    link.addEventListener('mouseenter', prefetch, { passive: true });
    link.addEventListener('touchstart', prefetch, { passive: true });
  });
}

/* ============================================================
   2. SLIDE-IN SIDE PANEL (DRAWER)
   ============================================================ */
function initNavDrawer() {
  const toggleBtn = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });

  // Close when clicking any nav link inside drawer
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ============================================================
   3. LIGHTBOX PREVIEW MODAL
   ============================================================ */
function initLightboxModal() {
  let modal = document.getElementById('lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'lightbox-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Image preview');
    modal.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close preview">&times;</button>
        <img class="lightbox-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E" alt="Preview">
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');
  const backdrop = modal.querySelector('.lightbox-backdrop');

  window.openLightbox = openLightbox;
  function openLightbox(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || 'Preview';
    modalCaption.textContent = alt || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1\' height=\'1\'%3E%3C/svg%3E';
      modalCaption.textContent = '';
    }, 200);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach lightbox trigger to project thumbnail frames and certificate images
  document.querySelectorAll('.lightbox-trigger, .project-img-frame, .proj-img-frame').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't trigger if clicking an external link inside
      if (e.target.closest('a')) return;
      const img = el.querySelector('img.project-img-contain, img.proj-img-main, img.cert-img-contain, img');
      if (img && img.src) {
        openLightbox(img.src, img.alt);
      }
    });
  });
}

/* ============================================================
   4. ACTIVE NAV LINK DETECTION
   ============================================================ */
function initActiveLinks() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('?')[0].split('#')[0];

    if (linkPage === page || (page === '' && linkPage === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* ============================================================
   5. HEADER SCROLLED STATE
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function update() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   6. HERO TYPEWRITER (DISTINCT SPECIALTIES ONLY)
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById('hero-typewriter') || document.getElementById('typewriter');
  if (!el) return;

  // Distinct specialties only - NEVER repeat static title "AI Engineer & Data Scientist"
  const specialties = [
    "Generative AI & LLMs",
    "Machine Learning & MLOps",
    "Autonomous AI Agents & RAG",
    "Computer Vision & YOLO",
    "Deep Neural Architectures"
  ];

  let specIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function tick() {
    const current = specialties[specIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      typeSpeed = 40;
    } else {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      typeSpeed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typeSpeed = 2000; // Pause when word complete
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      specIdx = (specIdx + 1) % specialties.length;
      typeSpeed = 350; // Pause before typing next
    }

    setTimeout(tick, typeSpeed);
  }

  tick();
}

/* ============================================================
   7. STAT COUNT-UP ANIMATION
   ============================================================ */
function initStatCountUp() {
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1200;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ============================================================
   8. HERO VISUAL TILT PARALLAX
   ============================================================ */
function initHeroVisual() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const visual = document.querySelector('.hero-visual');
  const frame = document.querySelector('.profile-frame');
  const badge = document.querySelector('.glass-info-card');

  if (!visual || !frame) return;

  visual.addEventListener('mousemove', (e) => {
    const rect = visual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * -12;
    const tiltY = (x / rect.width) * 12;

    frame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    if (badge) {
      badge.style.transform = `translate3d(${x * 0.05}px, ${y * 0.05}px, 20px)`;
    }
  });

  visual.addEventListener('mouseleave', () => {
    frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (badge) {
      badge.style.transform = 'translate3d(0, 0, 0)';
    }
  });
}

/* ============================================================
   9. PROJECT CATEGORY FILTERING
   ============================================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.proj-card, .project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const matches = filterValue === 'all' || category.toLowerCase().includes(filterValue.toLowerCase());

        if (matches) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ============================================================
   10. CONTACT FORM AJAX HANDLING
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusMsg = document.getElementById('form-status') || (() => {
    const el = document.createElement('div');
    el.id = 'form-status';
    el.className = 'form-status';
    form.appendChild(el);
    return el;
  })();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot for spam bots
    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value) {
      statusMsg.className = 'form-status success';
      statusMsg.textContent = 'Message sent successfully!';
      form.reset();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    statusMsg.className = 'form-status';
    statusMsg.textContent = '';

    const formData = new FormData(form);
    const action = form.getAttribute('action');

    try {
      if (action && action.startsWith('http')) {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          statusMsg.className = 'form-status success';
          statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
          form.reset();
        } else {
          throw new Error('Server response not OK');
        }
      } else {
        // Fallback simulation / mailto
        statusMsg.className = 'form-status success';
        statusMsg.textContent = 'Thank you! Your message has been received.';
        form.reset();
      }
    } catch (err) {
      statusMsg.className = 'form-status error';
      statusMsg.textContent = 'Oops! There was a problem submitting your message. Please reach out directly to sohailahmed241126@gmail.com';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

/* ============================================================
   11. SCROLL REVEALS & BACK TO TOP
   ============================================================ */
function initScrollReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const reveals = document.querySelectorAll('.gsap-reveal, .reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
