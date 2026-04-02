/* ===========================
   RAJAN KUMAR — PORTFOLIO JS
   =========================== */

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hover
document.querySelectorAll('a, button, .project-card, .skill-group, .ach-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '54px';
    cursor.style.height = '54px';
    cursor.style.borderColor = 'rgba(56,189,248,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '36px';
    cursor.style.height = '36px';
    cursor.style.borderColor = 'var(--accent)';
  });
});

// ===== CANVAS PARTICLE NETWORK =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 70;
const CONNECTION_DISTANCE = 130;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.color = Math.random() > 0.7 ? '129,140,248' : '56,189,248';
  }
  update(t) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulseOffset));
  }
  draw(t) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

let animTime = 0;
function animateCanvas() {
  animTime++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update & draw particles
  particles.forEach(p => {
    p.update(animTime);
    p.draw(animTime);
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DISTANCE) {
        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL ANIMATIONS =====
const aosElements = document.querySelectorAll('[data-aos]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => {
        el.classList.add('animated');
      }, delay);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

aosElements.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// Add active nav style via JS
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active { color: var(--accent); }
.nav-links a.active::after { width: 100%; }`;
document.head.appendChild(navStyle);

// ===== GLITCH TEXT EFFECT ON HERO NAME =====
const heroName = document.querySelector('.hero-name');
let glitchInterval;

function startGlitch() {
  const chars = '!@#$%^&*<>?/\\|~';
  const original = 'Rajan';
  let iterations = 0;
  const spans = heroName.querySelectorAll('.line');
  
  glitchInterval = setInterval(() => {
    spans[0].textContent = original
      .split('')
      .map((char, idx) => {
        if (idx < iterations) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iterations >= original.length) {
      clearInterval(glitchInterval);
      spans[0].textContent = original;
    }
    iterations += 0.3;
  }, 40);
}

// Trigger glitch on hover
if (heroName) {
  heroName.addEventListener('mouseenter', startGlitch);
}

// ===== TYPEWRITER for hero tag =====
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const phrases = ['AI Developer & Engineer', 'Computer Vision Researcher', 'Full Stack Builder', 'NLP Enthusiast'];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeDelay = 80;

  function typewriter() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      heroTag.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typeDelay = 40;
    } else {
      heroTag.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typeDelay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typeDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeDelay = 400;
    }

    setTimeout(typewriter, typeDelay);
  }

  // Start typewriter after initial animation
  setTimeout(typewriter, 1000);
}

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== RESUME DOWNLOAD TRACKING (visual feedback) =====
document.querySelectorAll('[download]').forEach(btn => {
  btn.addEventListener('click', function() {
    const original = this.innerHTML;
    this.style.opacity = '0.7';
    this.style.transform = 'scale(0.97)';
    setTimeout(() => {
      this.style.opacity = '1';
      this.style.transform = '';
    }, 300);
  });
});

console.log('%c👋 Hey there! Built by Rajan Kumar.', 'color: #38bdf8; font-size: 16px; font-weight: bold;');
console.log('%c🔗 github.com/RAJANKUMAR033', 'color: #94a3b8; font-size: 12px;');
