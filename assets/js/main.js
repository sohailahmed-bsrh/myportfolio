document.addEventListener('DOMContentLoaded', () => {
  // ── GSAP setup ───────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── Page fade-in (removed body fade to let hero stagger be visible) ──

  // ── Navbar scroll class ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Active nav link (matches current page filename) ───────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Smooth page transitions on internal links ─────────────
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const isInternal = !href.startsWith('http') && !href.startsWith('#')
      && !href.startsWith('mailto') && !href.startsWith('tel')
      && !href.startsWith('wa.') && !href.endsWith('.pdf')
      && !a.hasAttribute('target');
    if (isInternal) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const dest = href;
        gsap.to('body', {
          opacity: 0, duration: 0.35, ease: 'power2.inOut',
          onComplete: () => { window.location.href = dest; }
        });
      });
    }
  });

  // ── Mobile hamburger toggle ───────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ── Hero animations (only on home) ───────────────────────
  if (document.querySelector('.hero')) {
    const tl = gsap.timeline({ delay: 0.1 });
    
    // Grouping elements so the entire sequence finishes within ~1 second
    const heroElements = [
      '.hero-eyebrow, .hero h1',
      '.hero-role',
      '.animated-skills-wrapper',
      '.hero-desc',
      '.hero-actions, .hero-stats',
      '.hero-social-row, .hero-tech-stack'
    ];
    
    tl.from(heroElements, {
      y: 20, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.out',
      stagger: 0.08,
      clearProps: 'transform'
    })
    .from('.profile-ring', { scale: 0.9, opacity: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform' }, '-=0.4')
    .from('.glass-panel', { opacity: 0, y: 15, stagger: 0.1, duration: 0.6, ease: 'power2.out', clearProps: 'transform' }, '-=0.5')
    .from('#hero-canvas', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.5');
    
    initCanvasNetwork();

    // Mouse Parallax Effect (only runs if reduced motion is false)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const heroVisual = document.getElementById('hero-parallax-container');
      const layers = document.querySelectorAll('.parallax-layer');
      
      if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
          const rect = heroVisual.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
            const xOffset = x * speed;
            const yOffset = y * speed;
            gsap.to(layer, {
              x: xOffset,
              y: yOffset,
              duration: 0.5,
              ease: 'power2.out'
            });
          });
        });
        
        heroVisual.addEventListener('mouseleave', () => {
          gsap.to(layers, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
        });
      }
    }
  }

  // ── Canvas Particle Network ─────────────────────────────────
  function initCanvasNetwork() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let isPaused = false;
    
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.7)'; // Cyan
        ctx.fill();
      }
    }

    function init() {
      resize();
      window.addEventListener('resize', resize);
      
      const numParticles = window.innerWidth < 768 ? 30 : 60; 
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
      
      const observer = new IntersectionObserver((entries) => {
        isPaused = !entries[0].isIntersecting;
        if (!isPaused) requestAnimationFrame(animate);
      });
      observer.observe(document.querySelector('.hero'));
    }
    
    function animate() {
      if (isPaused) return;
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (dist / 100);
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.35})`; // Emerald
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    init();
  }

  // ── Scroll reveal for .gsap-reveal and .gsap-stagger ────────
  let mm = gsap.matchMedia();
  
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Fade and slide in once when scrolled into view
    document.querySelectorAll('.gsap-reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform'
        }
      );
    });

    // Stagger for .gsap-stagger children
    document.querySelectorAll('.gsap-stagger').forEach(container => {
      const children = container.children;
      gsap.fromTo(children,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1, clearProps: 'transform'
        }
      );
    });
  });

  // ── Back to Top Button ────────────────────────────────────
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// ── Interactive Demo Modal ──────────────────────────────────────
window.openDemo = function(type, url, title, fallbackUrl) {
  const overlay = document.createElement('div');
  overlay.className = 'demo-modal-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const modal = document.createElement('div');
  modal.className = 'demo-modal';

  const header = document.createElement('div');
  header.className = 'demo-modal-header';
  header.innerHTML = `<h3>${title}</h3><button class="demo-close" onclick="this.closest('.demo-modal-overlay').remove()">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>`;

  const body = document.createElement('div');
  body.className = 'demo-modal-body';

  if (url && url !== '' && url !== '#') {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'demo-iframe';
    iframe.setAttribute('allowfullscreen', '');
    body.appendChild(iframe);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'demo-placeholder';
    placeholder.innerHTML = `
      <div class="demo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M12 17v5"/><path d="M8 22h8"/></svg>
      </div>
      <h4 style="font-size:1.5rem;margin-bottom:1rem;color:#fff;">Run This Project Locally</h4>
      <p style="margin-bottom:0.75rem;max-width:450px;margin-left:auto;margin-right:auto;color:#8892b0;">This is a Python application that runs locally. Clone the repository and follow the setup instructions to launch it.</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem;">
        <a href="${fallbackUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:#f0f4ff;color:#07070a;border-radius:10px;font-weight:700;text-decoration:none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View Source Code
        </a>
      </div>
    `;
    body.appendChild(placeholder);
  }

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  gsap.fromTo(overlay, {opacity: 0}, {opacity: 1, duration: 0.3});
  gsap.fromTo(modal, {scale: 0.8, y: 20}, {scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)'});
};

// ── Typewriter Effect for Hero ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const words = [
    "AI Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Generative AI Developer",
    "Python Developer",
    "AI Agents Developer",
    "RAG Systems Builder",
    "Prompt Engineer",
    "MLOps Engineer"
  ];
  let i = 0;
  let timer;
  const el = document.getElementById('typewriter');

  if (el) {
    function typingEffect() {
      let word = words[i].split('');
      var loopTyping = function() {
        if (word.length > 0) {
          el.innerHTML += word.shift();
        } else {
          setTimeout(deletingEffect, 2200);
          return false;
        }
        timer = setTimeout(loopTyping, 90);
      };
      loopTyping();
    }

    function deletingEffect() {
      let word = words[i].split('');
      var loopDeleting = function() {
        if (word.length > 0) {
          word.pop();
          el.innerHTML = word.join('');
        } else {
          i = (i + 1) % words.length;
          setTimeout(typingEffect, 400);
          return false;
        }
        timer = setTimeout(loopDeleting, 45);
      };
      loopDeleting();
    }
    typingEffect();
  }
});

// ── Contact Form Intercept ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! (Note: This is a static demo. A backend like Formspree or FastAPI is required to actually send emails.)');
      contactForm.reset();
    });
  }

  // ── Accessibility: Reduced Motion for GSAP ───────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.globalTimeline.timeScale(1000);
  }
});

// ── Voice Greeting (Home Page Only) ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const voiceToggleBtn = document.getElementById('voice-toggle');
  
  if (!voiceToggleBtn) return;

  const GREETING_TEXT = "Hello, and welcome to my portfolio. I'm Sohail Ahmed, an AI Engineer specializing in data science and machine learning. Feel free to explore my work.";
  let utterance = null;
  let isPlaying = false;
  let greetingTriggered = false;

  if ('speechSynthesis' in window) {
    utterance = new SpeechSynthesisUtterance(GREETING_TEXT);
    utterance.volume = 0.8;
    utterance.rate = 1.0;
    
    voiceToggleBtn.classList.add('visible');

    utterance.onend = () => {
      isPlaying = false;
      voiceToggleBtn.classList.remove('playing');
      voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    };

    utterance.onerror = (e) => {
      isPlaying = false;
      voiceToggleBtn.classList.remove('playing');
      voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    };
  } else {
    return;
  }

  const hasPlayed = sessionStorage.getItem('greetingPlayed');

  const playGreeting = () => {
    if (greetingTriggered || hasPlayed || !utterance) return;
    greetingTriggered = true;
    sessionStorage.setItem('greetingPlayed', 'true');
    
    // Ensure any previously stuck utterances are cleared before speaking
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    isPlaying = true;
    voiceToggleBtn.classList.add('playing');
    voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  };

  const stopGreeting = () => {
    window.speechSynthesis.cancel();
    isPlaying = false;
    voiceToggleBtn.classList.remove('playing');
    voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    greetingTriggered = true; 
    sessionStorage.setItem('greetingPlayed', 'true');
  };

  // Wait for FIRST interaction (click/touch) to unlock audio
  if (!hasPlayed) {
    const triggerInteraction = (e) => {
      // Don't trigger if they clicked the toggle button (it handles itself)
      if (e.target.closest('#voice-toggle')) return;
      playGreeting();
      ['click', 'touchstart'].forEach(evt => {
        document.removeEventListener(evt, triggerInteraction);
      });
    };
    
    ['click', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, triggerInteraction, { passive: true });
    });
  }

  // Toggle button manual control
  voiceToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopGreeting();
    } else {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      isPlaying = true;
      voiceToggleBtn.classList.add('playing');
      voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  });
});
