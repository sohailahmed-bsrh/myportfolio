/* ============================================================
   SOHAIL AHMED - CLIENT INTERACTION ENGINE (v2026.9)
   - High-Performance Event Architecture
   - Zero-Flicker Light & Dark Theme Persistence
   - Typewriter, Single Navigation Scroll-Spy, Lightbox, Dynamic Filters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initSidebar();
  initScrollSpy();
  initProjectFilters();
  initLightbox();
  initSmoothScroll();
  initContactForm();
});

// 1. Theme Toggle System (Dark / Light)
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Get initial theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 
                       localStorage.getItem('devsil-theme') || 
                       'dark';
                       
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('devsil-theme', nextTheme);
    });
  });
}

// 2. Hero Dynamic Typewriter
function initTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const roles = [
    'Building Autonomous Agentic AI Systems & Multi-Agent Workflows',
    'Developing Real-Time Computer Vision & Edge AI Architectures',
    'Fine-Tuning Domain LLMs & Grounded Clinical RAG Pipelines',
    'Architecting High-Throughput FastAPI REST Microservices',
    'Engineering Scalable Production Machine Learning & MLOps Pipelines'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let waitTicks = 0;

  function tick() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        waitTicks = 32; // pause at end
      }
    } else {
      if (waitTicks > 0) {
        waitTicks--;
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
    }
    setTimeout(tick, isDeleting ? 25 : 55);
  }

  tick();
}

// 3. Sidebar Navigation Drawer (Mobile)
function initSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  const backdrop = document.getElementById('sidebar-backdrop');
  const btnHeader = document.getElementById('btn-header-sidebar');
  const btnClose = document.getElementById('btn-close-sidebar');

  function openSidebar() {
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnHeader) btnHeader.addEventListener('click', openSidebar);
  if (btnClose) btnClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });
}

// 4. Single Navigation Scroll-Spy
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });

        drawerLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -55% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

// 5. Smooth Anchor Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 6. Project Filter Tabs
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-btn, .filter-tab');
  const cards = document.querySelectorAll('.project-card, .portfolio-project-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.toLowerCase().includes(filter.toLowerCase())) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 7. Lightbox Modal
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const overlay = document.getElementById('lightbox-overlay');
  const dismissBtn = document.getElementById('lightbox-dismiss-btn');

  if (!modal) return;

  // Delegate click for project thumbnails
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.project-thumb-frame, .card-img-box');
    if (trigger) {
      e.preventDefault();
      const src = trigger.getAttribute('data-src');
      const title = trigger.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc');
      const gh = trigger.getAttribute('data-github');
      window.openLightbox(src, title, desc, gh);
    }
  });

  const closeActions = [closeBtn, overlay, dismissBtn];
  closeActions.forEach(el => {
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.closeLightbox();
      });
    }
  });
}

window.openLightbox = function(src, title, desc, gh) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const codeBtn = document.getElementById('lightbox-code-btn');

  if (!modal || !img) return;

  img.src = src || '';
  img.alt = title || 'Project Preview';
  if (titleEl) titleEl.textContent = title || 'Project Preview';
  if (descEl) descEl.textContent = desc || '';
  if (codeBtn && gh) {
    codeBtn.href = gh;
    codeBtn.style.display = 'inline-flex';
  } else if (codeBtn) {
    codeBtn.style.display = 'none';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeLightbox();
});

// 8. Contact Form Handling
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<span class="status-dot"></span> Sending Message...';

    // Simulate reliable submission
    setTimeout(() => {
      btn.innerHTML = '✓ Message Sent Successfully!';
      btn.style.background = 'var(--success)';
      form.reset();
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 4000);
    }, 1000);
  });
}
