// ===============================
// LOAD PARTIALS (HTML COMPONENTS)
// ===============================

/**
 * Load satu file HTML ke element tertentu
 */
async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

/**
 * Load semua section lalu jalankan inisialisasi
 */
async function loadAll() {
  await loadComponent("navbar", "./partials/navbar.html");
  await loadComponent("hero", "./partials/hero.html");
  await loadComponent("about", "./partials/about.html");
  await loadComponent("skills", "./partials/skills.html");
  await loadComponent("projects", "./partials/projects.html");
  await loadComponent("contact", "./partials/contact.html");
  await loadComponent("footer", "./partials/footer.html");

  initNavbar();
  initParticles();
  initAvatarParallax();
}

// Jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", loadAll);

// ===============================
// NAVBAR MOBILE TOGGLE
// ===============================

function initNavbar() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;

  // Toggle menu mobile
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// ===============================
// PARTICLES HERO + MOUSE EFFECT
// ===============================

function initParticles() {
  const canvas = document.getElementById("particles");
  const hero = document.getElementById("home");

  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");

  // State particles
  let particles = [];

  // Opacity untuk fade in/out saat scroll
  let opacity = 0;
  let targetOpacity = 0;
  const fadeSpeed = 0.03;
  
  hero.addEventListener("click", (e) => {
  for (let i = 0; i < 25; i++) {
    const p = new Particle();
    p.x = e.offsetX;
    p.y = e.offsetY;
    p.size = Math.random() * 4 + 1;
    p.speedY = Math.random() * 2 + 1;
    particles.push(p);
  }
});

  // ===============================
// AVATAR PARALLAX EFFECT
// ===============================

function initAvatarParallax() {
  const hero = document.getElementById("home");
  const avatar = document.querySelector(".avatar-parallax");

  if (!hero || !avatar) return;

  // Disable di mobile
  if (window.innerWidth < 768) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const strength = 20; // semakin besar = makin jauh geraknya
  const ease = 0.08;   // smooth easing

  // Ambil posisi mouse relatif ke hero
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();

    mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
  });

  // Reset saat mouse keluar
  hero.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
  });

  function animate() {
    // easing movement
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    avatar.style.transform = `
      translate(${currentX * strength}px, ${currentY * strength}px)
    `;

    requestAnimationFrame(animate);
  }

  animate();
}


  // ===============================
  // CANVAS RESPONSIVE
  // ===============================

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();

  // ===============================
  // MOUSE TRACKING
  // ===============================

  const mouse = {
    x: null,
    y: null,
    radius: 180 // jarak pengaruh mouse ke partikel
  };

  // Ambil posisi mouse relatif ke hero
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Reset mouse saat keluar area hero
  hero.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ===============================
  // PARTICLE CLASS
  // ===============================

  class Particle {
    constructor() {
      this.reset();
    }

    // Reset posisi & properti partikel
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.alpha = Math.random();
      this.density = Math.random() * 20 + 5;

         // TAMBAHAN
    this.vx = 0;
    this.vy = 0;
    }

    // Update posisi partikel
   update() {
  // Gerakan dasar naik
  this.vy -= this.speedY * 0.06;

  if (mouse.x !== null && mouse.y !== null) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      // Gaya tarik ke mouse (EFEK SLITHER)
      const force = (mouse.radius - distance) / mouse.radius;
      const angle = Math.atan2(dy, dx);

      this.vx += Math.cos(angle) * force * 0.6;
      this.vy += Math.sin(angle) * force * 0.6;
    }
  }

  // Gesekan biar gak liar
  this.vx *= 0.94;
  this.vy *= 0.94;

  this.x += this.vx;
  this.y += this.vy;

  // Reset kalau keluar layar
  if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
    this.reset();
    this.y = canvas.height;
  }
}

    // Gambar partikel ke canvas
    draw() {
      ctx.fillStyle = `rgba(56,189,248,${this.alpha * opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ===============================
  // INIT & ANIMATION LOOP
  // ===============================

  function init() {
    particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth fade in/out
    opacity += (targetOpacity - opacity) * fadeSpeed;

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();

  // ===============================
  // INTERSECTION OBSERVER
  // ===============================

  const observer = new IntersectionObserver(
    ([entry]) => {
      targetOpacity = entry.isIntersecting ? 1 : 0;
    },
    { threshold: 0.25 }
  );

  observer.observe(hero);

  // Resize canvas saat window resize
  window.addEventListener("resize", resizeCanvas);
}
