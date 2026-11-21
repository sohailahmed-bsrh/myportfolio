/* ============================================================
   Sohail Ahmed Portfolio - Client JavaScript (v2026.5)
   - Devsil Design System & High-Performance Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initSidebar();
  initBottomDockScrollSpy();
  initProjectFilters();
  initLightbox();
  initSmoothScroll();
});

// 1. Hero Dynamic Typewriter
function initTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const roles = [
    'Building Autonomous AI Agents & Vision Systems',
    'Fine-Tuning LLMs & Retrieval-Augmented Generation (RAG)',
    'Real-Time Computer Vision & YOLO Detection Pipelines',
    'Production Machine Learning & High-Throughput APIs',
    'End-to-End MLOps & High-Performance Data Engineering'
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
        waitTicks = 30; // pause at end
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
    setTimeout(tick, isDeleting ? 30 : 60);
  }

  tick();
}

// 2. Sidebar Navigation Drawer
function initSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  const backdrop = document.getElementById('sidebar-backdrop');
  const btnHeader = document.getElementById('btn-header-sidebar');
  const btnDock = document.getElementById('dock-sidebar-btn');
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
  if (btnDock) btnDock.addEventListener('click', openSidebar);
  if (btnClose) btnClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Close sidebar on clicking any drawer link
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });
}

// 3. Floating Bottom Dock & Scroll-Spy
function initBottomDockScrollSpy() {
  const dockBtns = document.querySelectorAll('.dock-action-btn[data-section]');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length || !dockBtns.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        dockBtns.forEach(btn => {
          if (btn.getAttribute('data-section') === id) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        drawerLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

// 4. Smooth Anchor Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
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

// 5. Project Filter Tabs
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.portfolio-project-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


function initLightbox() {
  // Global modal handlers ready
}

// 6. Lightbox Modal
window.openLightbox = function(src, title) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  if (!modal || !img) return;

  img.src = src;
  img.alt = title || 'Preview';
  if (titleEl) titleEl.textContent = title || 'Preview';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(e) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
};
