/* === Device Detection === */
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

/* === Custom Cursor, Spotlight & Parallax === */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
const spotlight = document.getElementById('mouseSpotlight');
const heroOrb = document.querySelector('.hero-orb');
const heroOrb2 = document.querySelector('.hero-orb2');
const heroGrid = document.querySelector('.hero-grid');

if (!isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    // Custom Cursor
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    ring.style.left   = e.clientX + 'px';
    ring.style.top    = e.clientY + 'px';
    
    // Spotlight
    if(spotlight) {
      spotlight.style.setProperty('--mouse-x', e.clientX + 'px');
      spotlight.style.setProperty('--mouse-y', e.clientY + 'px');
    }

    // Hero Background Parallax Effect
    if(window.innerWidth > 900) {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      
      if(heroOrb) heroOrb.style.transform = `translate(${x * -40}px, ${y * -40}px) scale(1.1)`;
      if(heroOrb2) heroOrb2.style.transform = `translate(${x * 60}px, ${y * 60}px) scale(1.1)`;
      if(heroGrid) heroGrid.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
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
      
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
} else {
  // Hide custom cursors for touch devices
  if(cursor) cursor.style.display = 'none';
  if(ring) ring.style.display = 'none';
  if(spotlight) spotlight.style.display = 'none';
  document.body.style.cursor = 'auto';
}

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

/* === Nav Shrink & Mobile Menu === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

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

/* === Interactive Network Background (Constellation Effect) === */
const canvas = document.getElementById('network-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Track mouse position specifically for the canvas
  let networkMouse = {
    x: null,
    y: null,
    radius: 120 // How far the mouse pushes particles away
  }

  window.addEventListener('mousemove', function(event) {
    networkMouse.x = event.x;
    networkMouse.y = event.y;
  });

  window.addEventListener('mouseout', function() {
    networkMouse.x = undefined;
    networkMouse.y = undefined;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = '#c9a84c'; // Uses your gold color
      ctx.fill();
    }
    
    update() {
      // Bounce off screen edges
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse collision detection
      let dx = networkMouse.x - this.x;
      let dy = networkMouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      
      // Push particles away from mouse
      if (distance < networkMouse.radius + this.size){
        if (networkMouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 2;
        }
        if (networkMouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (networkMouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 2;
        }
        if (networkMouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }
      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate the particle array
  function init() {
    particlesArray = [];
    // Adjust density based on screen size
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.5) + 0.5;
      let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 1) - 0.5;
      let directionY = (Math.random() * 1) - 0.5;
      let color = '#c9a84c';

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw lines between close particles
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        // If particles are close enough, draw a line
        if (distance < (canvas.width/9) * (canvas.height/9)) {
          opacityValue = 1 - (distance/15000);
          ctx.strokeStyle = 'rgba(201, 168, 76,' + opacityValue + ')'; // Gold lines
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  // Resize event
  window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });

  // Only run the heavy animation on non-touch devices for better performance
    init();
    animate();
}

/* === PRE-LOADER === */
// Lock scroll initially using a class
document.body.classList.add('scroll-locked');

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  
  // Set a minimum timeout so the cool animation isn't skipped instantly
  setTimeout(() => {
    loader.classList.add('hidden');
    // Restore scrolling perfectly once loader fades out
    document.body.classList.remove('scroll-locked');
  }, 2000); 
});