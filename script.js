/* === Custom Cursor & Matte Spotlight === */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
const spotlight = document.getElementById('mouseSpotlight');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  ring.style.left   = e.clientX + 'px';
  ring.style.top    = e.clientY + 'px';
  
  if(spotlight) {
    spotlight.style.setProperty('--mouse-x', e.clientX + 'px');
    spotlight.style.setProperty('--mouse-y', e.clientY + 'px');
  }
});

document.querySelectorAll('a, button, .skill-pill, .course-pill').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* === Magnetic Buttons === */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});

/* === 3D Tilt Effect === */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg rotation
    const rotateY = ((x - centerX) / centerX) * 4;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

/* === Cryptographic Text Scramble on Section Titles === */
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
document.querySelectorAll('.section-title').forEach(title => {
  title.dataset.value = title.innerText;
});

const scrambleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
      entry.target.classList.add('scrambled');
      let iteration = 0;
      const el = entry.target;
      const finalVal = el.dataset.value;
      
      clearInterval(el.interval);
      el.interval = setInterval(() => {
        el.innerText = finalVal.split("").map((letter, index) => {
          if(index < iteration) return finalVal[index];
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        
        if(iteration >= finalVal.length) clearInterval(el.interval);
        iteration += 1 / 3;
      }, 30);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-title').forEach(el => scrambleObs.observe(el));

/* === Nav Shrink === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

/* === Hamburger === */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* === Scroll Reveal === */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* === Active Nav Highlight === */
const allSections = document.querySelectorAll('section[id]');
const allNavAs    = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      allNavAs.forEach(a => {
        a.style.color = (a.getAttribute('href') === '#' + e.target.id) ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });
allSections.forEach(s => secObs.observe(s));

/* === Animated Stats Counters === */
function countUp(el, target, decimals, duration = 1800) {
  if (!el) return;
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(decimals || 0);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Hero stats */
let heroFired = false;
const heroObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !heroFired) {
    heroFired = true;
    countUp(document.getElementById('sGcpa'), 9.19, 2);
    countUp(document.getElementById('sCF'),   1892, 0);
    countUp(document.getElementById('sLC'),   2263, 0);
    countUp(document.getElementById('sAIR'),  844,  0);
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObs.observe(heroStats);

/* CP stats */
let compFired = false;
const compObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !compFired) {
    compFired = true;
    countUp(document.getElementById('rCF'), 1892, 0);
    countUp(document.getElementById('rLC'), 2263, 0);
    countUp(document.getElementById('rCC'), 1971, 0);
    countUp(document.getElementById('rGR'), 278,  0);
  }
}, { threshold: 0.4 });
const compRow = document.querySelector('.competitive-row');
if (compRow) compObs.observe(compRow);