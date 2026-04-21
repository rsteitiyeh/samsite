/* ============================================
   GLASSOLOGY - Main JavaScript
   Built with Strength, Designed with Elegance
   ============================================ */

'use strict';

/* ============================================
   PORTFOLIO DATA — using actual uploaded images
   ============================================ */
const portfolioData = [
  { id: 1,  src: 'images/portfolio/2.jpeg',   category: 'glass',    title: 'Glass Facade Project',       desc: 'Frameless glass facade installation' },
  { id: 2,  src: 'images/portfolio/3.jpeg',   category: 'glass',    title: 'Glass Partitions',           desc: 'Interior glass partition system' },
  { id: 3,  src: 'images/portfolio/4.jpeg',   category: 'aluminum', title: 'Aluminum Curtain Wall',      desc: 'Commercial aluminum curtain wall' },
  { id: 4,  src: 'images/portfolio/5.jpeg',   category: 'steel',    title: 'Stainless Steel Railings',   desc: 'Custom stainless steel railings' },
  { id: 5,  src: 'images/portfolio/6.jpeg',   category: 'glass',    title: 'Tempered Glass Installation', desc: 'Tempered glass balustrade system' },
  { id: 6,  src: 'images/portfolio/7.jpeg',   category: 'aluminum', title: 'Aluminum Window Systems',    desc: 'Modern aluminum sliding windows' },
  { id: 7,  src: 'images/portfolio/8.jpeg',   category: 'steel',    title: 'Steel Gate & Fencing',       desc: 'Decorative steel gate fabrication' },
  { id: 8,  src: 'images/portfolio/9.jpeg',   category: 'glass',    title: 'Shower Enclosure',           desc: 'Frameless glass shower enclosure' },
  { id: 9,  src: 'images/portfolio/10.jpeg',  category: 'aluminum', title: 'Storefront System',          desc: 'Aluminum storefront installation' },
  { id: 10, src: 'images/portfolio/11.jpeg',  category: 'steel',    title: 'Stainless Steel Cladding',   desc: 'Decorative steel panel cladding' },
  { id: 11, src: 'images/portfolio/12.jpeg',  category: 'glass',    title: 'Glass Railing',              desc: 'Glass railing & balustrade system' },
  { id: 12, src: 'images/portfolio/13.jpeg',  category: 'aluminum', title: 'Aluminum Cladding',          desc: 'Architectural aluminum cladding' },
  { id: 13, src: 'images/portfolio/14.jpeg',  category: 'steel',    title: 'Commercial Steel Works',     desc: 'Custom commercial metalwork' },
  { id: 14, src: 'images/portfolio/15.jpeg',  category: 'glass',    title: 'Decorative Glass Panels',    desc: 'Bespoke decorative glass design' },
  { id: 15, src: 'images/portfolio/16.jpeg',  category: 'aluminum', title: 'Louvers & Sun Shades',       desc: 'Aluminum sun shading system' },
  { id: 16, src: 'images/portfolio/17.jpeg',  category: 'steel',    title: 'Stainless Steel Handrail',   desc: 'Interior handrail fabrication' },
  { id: 17, src: 'images/portfolio/18.jpeg',  category: 'glass',    title: 'Glass Entrance',             desc: 'Structural glass entrance system' },
  { id: 18, src: 'images/portfolio/19.jpeg',  category: 'aluminum', title: 'Door & Window Systems',      desc: 'Premium aluminum door frames' },
  { id: 19, src: 'images/portfolio/WhatsApp Image 2026-04-07 at 6.51.19 PM.jpeg', category: 'steel', title: 'Custom Metal Fabrication', desc: 'Bespoke steel fabrication project' },
  { id: 20, src: 'images/uploads/stair-railing-interior-cropped.jpg', category: 'steel', title: 'Interior Stair Railing', desc: 'Polished stainless steel staircase railing' },
  { id: 21, src: 'images/uploads/salon-lighting-interior.jpg', category: 'aluminum', title: 'Luxury Interior Fit-Out', desc: 'Custom reflective metal detailing and lighting' },
  { id: 22, src: 'images/uploads/exterior-stainless-railing.jpg', category: 'steel', title: 'Exterior Stainless Handrail', desc: 'Exterior polished stainless steel entrance railing' },
  { id: 23, src: 'images/uploads/glass-metal-entrance.jpg', category: 'glass', title: 'Glass Entrance System', desc: 'Framed glass and metal entrance installation' },
];

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  // Hide loader after 2.2s (bar animation = 2s + slight delay)
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  }, 2400);

  document.body.style.overflow = 'hidden';
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursor() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states on interactive elements
  const hoverTargets = 'a, button, .filter-btn, .portfolio-item, .service-card, .why-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hover');
      ring.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    }
  });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay    = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll behavior
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  function openMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu(); else openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Active link highlighting
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let current = '';

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = '#' + sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }
}

/* ============================================
   HERO CANVAS — Particle Animation
   ============================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.6 ? '#C9A84C' : '#5BA3A3',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  resize();
  draw();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const delays = [0, 0.15, 0.3, 0.45, 0.6];

  // Apply stagger delays to elements with data-stagger parent
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.querySelectorAll('[data-animate]');
    children.forEach((child, i) => {
      child.style.transitionDelay = delays[i % delays.length] + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, step);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================
   PORTFOLIO — Load from ZIP using JSZip
   ============================================ */
let portfolioImages = []; // Loaded image URLs or src strings
let currentFilter = 'all';
let lightboxIndex = 0;
let filteredItems = [];

function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  // Attempt to load from zip, fall back to direct src
  loadPortfolioImages().then(() => {
    renderPortfolio('all');
    initPortfolioFilters();
  });
}

async function loadPortfolioImages() {
  try {
    // Try loading JSZip and extracting images
    const JSZip = window.JSZip;
    if (!JSZip) throw new Error('JSZip not available');

    const response = await fetch('images/portfolio/portfolio-zip.zip');
    if (!response.ok) throw new Error('ZIP not found');

    const zipData = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);

    const imagePromises = [];
    zip.forEach((relativePath, file) => {
      if (!file.dir && /\.(jpe?g|png|webp)$/i.test(relativePath)) {
        imagePromises.push(
          file.async('blob').then(blob => ({
            name: relativePath.replace(/^.*[\\/]/, ''), // strip folder prefix
            fullPath: relativePath,
            url: URL.createObjectURL(blob),
          }))
        );
      }
    });

    const results = await Promise.all(imagePromises);

    // Build a map: numeric filename → blob URL
    // e.g. "2.jpeg" → blobUrl, "WhatsApp Image..." → blobUrl
    const byName = {};
    results.forEach(r => { byName[r.name] = r.url; });

    // Sort numerically for index-based fallback
    const sorted = [...results].sort((a, b) => {
      const getNum = s => {
        const m = s.name.match(/(\d+)/);
        return m ? parseInt(m[1]) : 9999;
      };
      return getNum(a) - getNum(b);
    });

    // Map to portfolioData by trying exact filename match first, then index
    portfolioData.forEach((item, idx) => {
      // Try to match by expected filename (e.g. '2.jpeg' from 'images/portfolio/2.jpeg')
      const expectedName = item.src.split('/').pop();
      if (byName[expectedName]) {
        item._blobUrl = byName[expectedName];
      } else if (sorted[idx]) {
        item._blobUrl = sorted[idx].url;
      }
    });

    console.log('[Glassology] Portfolio: loaded', results.length, 'images from ZIP');
  } catch (err) {
    console.log('[Glassology] ZIP load failed, using direct paths:', err.message);
    // Portfolio items will use item.src directly (direct file paths)
  }
}

function getImgSrc(item) {
  return item._blobUrl || item.src;
}

function renderPortfolio(filter) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  currentFilter = filter;
  filteredItems = filter === 'all'
    ? [...portfolioData]
    : portfolioData.filter(item => item.category === filter);

  grid.innerHTML = '';

  filteredItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.setAttribute('data-idx', idx);
    div.setAttribute('data-category', item.category);

    const catLabels = { glass: 'Glass', aluminum: 'Aluminum', steel: 'Steel' };

    div.innerHTML = `
      <img class="portfolio-img" src="${getImgSrc(item)}" alt="${item.title}" loading="lazy"
           onerror="this.style.display='none'; this.closest('.portfolio-item').classList.add('img-error')">
      <div class="portfolio-cat-badge">${catLabels[item.category] || item.category}</div>
      <div class="portfolio-overlay">
        <p class="portfolio-overlay-title">${item.title}</p>
        <div class="portfolio-zoom-icon">&#43;</div>
      </div>
    `;

    div.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(div);
  });

  // Re-observe for animations
  grid.querySelectorAll('.portfolio-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    }, i * 60);
  });
}

function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.getAttribute('data-filter'));
    });
  });
}

/* ============================================
   LIGHTBOX
   ============================================ */
function openLightbox(idx) {
  lightboxIndex = idx;
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  updateLightboxContent();
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const item = filteredItems[lightboxIndex];
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  if (img) {
    img.style.opacity = '0';
    img.src = getImgSrc(item);
    img.alt = item.title;
    img.onload = () => { img.style.opacity = '1'; };
  }
  if (caption) caption.textContent = item.title;
  if (counter) counter.textContent = (lightboxIndex + 1) + ' / ' + filteredItems.length;
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxContent();
  });
  document.getElementById('lightbox-next')?.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % filteredItems.length;
    updateLightboxContent();
  });

  // Close on backdrop click
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowRight')   { lightboxIndex = (lightboxIndex + 1) % filteredItems.length; updateLightboxContent(); }
    if (e.key === 'ArrowLeft')    { lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length; updateLightboxContent(); }
  });

  // Swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) { lightboxIndex = (lightboxIndex + 1) % filteredItems.length; }
      else         { lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length; }
      updateLightboxContent();
    }
  });
}

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const dots  = document.querySelectorAll('.testimonial-dot');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let autoPlay;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('testi-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('testi-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  function resetAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  goTo(0);
  resetAuto();
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = ['name', 'email', 'phone', 'service', 'message'];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[\d\s\+\-\(\)]{7,20}$/;

  function validate(fieldName) {
    const el = form.querySelector(`[name="${fieldName}"]`);
    const grp = el?.closest('.form-group');
    const errEl = grp?.querySelector('.form-error');
    if (!el || !grp) return true;

    let msg = '';
    const val = el.value.trim();

    if (!val) msg = 'This field is required';
    else if (fieldName === 'email' && !emailRe.test(val)) msg = 'Enter a valid email address';
    else if (fieldName === 'phone' && !phoneRe.test(val)) msg = 'Enter a valid phone number';
    else if (fieldName === 'service' && val === '') msg = 'Please select a service';

    grp.classList.toggle('error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  // Real-time validation
  fields.forEach(f => {
    const el = form.querySelector(`[name="${f}"]`);
    if (el) el.addEventListener('blur', () => validate(f));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    fields.forEach(f => { if (!validate(f)) valid = false; });
    if (!valid) return;

    const btn = form.querySelector('.form-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    // Simulate submission (replace with actual endpoint if available)
    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('form-success')?.classList.add('show');
    }, 1500);
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   COOKIE BANNER
   ============================================ */
function getSafeStorage() {
  try {
    return window.localStorage;
  } catch (err) {
    return null;
  }
}

function getCookiePreference() {
  const storage = getSafeStorage();
  return storage ? storage.getItem('gl_cookies') : (window.__glCookiePreference || null);
}

function setCookiePreference(value) {
  const storage = getSafeStorage();
  if (storage) {
    storage.setItem('gl_cookies', value);
  }
  window.__glCookiePreference = value;
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (getCookiePreference()) {
    banner.classList.add('hidden');
    return;
  }

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    setCookiePreference('accepted');
    banner.classList.add('hidden');
  });

  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    setCookiePreference('declined');
    banner.classList.add('hidden');
  });
}

/* ============================================
   SMOOTH SCROLL for hash links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const rawHref = a.getAttribute('href');
      if (!rawHref || rawHref === '#') return;

      const [pathPart, hashPart] = rawHref.split('#');
      if (!hashPart) return;

      const currentPath = (window.location.pathname.split('/').pop() || 'index.html');
      const targetPath = pathPart ? pathPart.split('/').pop() : currentPath;

      if (pathPart && targetPath !== currentPath) {
        return;
      }

      const target = document.getElementById(hashPart);
      if (!target) return;

      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}



/* ============================================
   THEME TOGGLE
   ============================================ */
function updateThemeToggleLabel(nextMode) {
  const isArabic = document.documentElement.lang === 'ar';
  document.querySelectorAll('.theme-toggle-label').forEach(label => {
    label.textContent = nextMode === 'light'
      ? (isArabic ? 'فاتح' : 'Light')
      : (isArabic ? 'داكن' : 'Dark');
  });
}

function applyTheme(mode) {
  const isLight = mode === 'light';
  document.body.classList.toggle('light-mode', isLight);
  try { localStorage.setItem('gl_theme', mode); } catch (err) {}
  updateThemeToggleLabel(isLight ? 'dark' : 'light');
}

function initThemeToggle() {
  let stored = 'dark';
  try {
    stored = localStorage.getItem('gl_theme') || 'dark';
  } catch (err) {}
  applyTheme(stored);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      applyTheme(next);
    });
  });
}


function initLanguageSwitch() {
  document.querySelectorAll('.lang-option[href], .lang-option[data-lang-url]').forEach(link => {
    link.addEventListener('click', e => {
      const targetUrl = link.getAttribute('data-lang-url') || link.getAttribute('href');
      if (!targetUrl) return;
      e.preventDefault();
      window.location.href = targetUrl;
    });
  });
}

/* ============================================
   INIT ALL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initCursor();
  initNavbar();
  initHeroCanvas();
  initScrollAnimations();
  initCounters();
  initPortfolio();
  initLightbox();
  initTestimonials();
  initContactForm();
  initBackToTop();
  initCookieBanner();
  initSmoothScroll();
  initLanguageSwitch();
  initThemeToggle();
});
