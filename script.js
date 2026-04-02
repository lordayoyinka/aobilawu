// ── Nav scroll ────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Scroll reveal ─────────────────────────────────────────────
const revealSelectors = [
  '.service-card', '.work-card', '.testi-card', '.whyme-card', '.competency-card',
  '.process-step', '.about__text', '.about__experience-col',
  '.skills__bars-col', '.skills__cards-col',
  '.contact__info', '.contact__form',
  '.section-title', '.section-sub', '.trust-bar',
  '.cta-banner__inner', '.timeline-item'
];
document.querySelectorAll(revealSelectors.join(',')).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill bars animate on scroll ─────────────────────────────
const skillsCol = document.querySelector('.skills__bars-col');
if (skillsCol) {
  document.querySelectorAll('.skill-fill').forEach(f => {
    f.style.animationPlayState = 'paused';
  });
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          fill.style.animationDelay = `${i * 0.1}s`;
          fill.style.animationPlayState = 'running';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillObserver.observe(skillsCol);
}

// ── Portfolio filter ──────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) card.style.animation = 'fadeUp 0.4s ease both';
    });
    buildLightboxIndex();
  });
});

// ── Lightbox ──────────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxTitle   = document.getElementById('lightboxTitle');
const lightboxDesc    = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxThumbs  = document.getElementById('lightboxThumbs');
const lightboxLoader  = document.getElementById('lightboxLoader');

let lightboxItems = [];
let currentIndex  = 0;

function buildLightboxIndex() {
  lightboxItems = Array.from(document.querySelectorAll('.work-card:not(.hidden)'));
}
buildLightboxIndex();

function openLightbox(index) {
  currentIndex = ((index % lightboxItems.length) + lightboxItems.length) % lightboxItems.length;
  renderLightbox();
  buildThumbs();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const card = lightboxItems[currentIndex];
  lightboxLoader.classList.remove('hidden');
  lightboxImg.classList.remove('loaded');
  lightboxImg.src = '';
  lightboxTitle.innerHTML  = card.dataset.title;
  lightboxDesc.innerHTML   = card.dataset.desc;
  lightboxCounter.textContent = `${currentIndex + 1} / ${lightboxItems.length}`;

  const tmp = new Image();
  tmp.onload = () => {
    lightboxImg.src = card.dataset.img;
    lightboxImg.alt = card.dataset.title;
    lightboxImg.classList.add('loaded');
    lightboxLoader.classList.add('hidden');
  };
  tmp.onerror = () => {
    lightboxImg.src = card.dataset.img;
    lightboxImg.classList.add('loaded');
    lightboxLoader.classList.add('hidden');
  };
  tmp.src = card.dataset.img;

  document.querySelectorAll('.lightbox__thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentIndex);
    if (i === currentIndex) t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
}

function buildThumbs() {
  lightboxThumbs.innerHTML = '';
  lightboxItems.forEach((card, i) => {
    const btn = document.createElement('button');
    btn.className = 'lightbox__thumb' + (i === currentIndex ? ' active' : '');
    btn.innerHTML = `<img src="${card.dataset.img}" alt="${card.dataset.title}" loading="lazy">`;
    btn.addEventListener('click', () => { currentIndex = i; renderLightbox(); });
    lightboxThumbs.appendChild(btn);
  });
}

// Open on card click
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    buildLightboxIndex();
    openLightbox(lightboxItems.indexOf(card));
  });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
document.getElementById('lightboxCta').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', e => { e.stopPropagation(); currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length; renderLightbox(); });
document.getElementById('lightboxNext').addEventListener('click', e => { e.stopPropagation(); currentIndex = (currentIndex + 1) % lightboxItems.length; renderLightbox(); });

// Keyboard
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % lightboxItems.length; renderLightbox(); }
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length; renderLightbox(); }
  if (e.key === 'Escape') closeLightbox();
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    currentIndex = diff > 0
      ? (currentIndex + 1) % lightboxItems.length
      : (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  }
});

// ── Contact form ──────────────────────────────────────────────
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const span = btn.querySelector('.btn-text');
  span.textContent = 'Sending...';
  btn.disabled = true;

  // ↓ Replace this timeout with Formspree / EmailJS for real sends
  setTimeout(() => {
    formSuccess.classList.add('show');
    form.reset();
    span.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1500);
});

// ── Active nav link highlight ─────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Animated number counters ──────────────────────────────────
function animateCount(el, target, suffix = '') {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat__num');
      const targets = [10, 75, 2200, 100];
      const suffixes = ['', '+', '+', '%'];
      nums.forEach((el, i) => animateCount(el, targets[i], suffixes[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);
