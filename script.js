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
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
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
