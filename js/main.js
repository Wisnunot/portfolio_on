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
  initIntroScroll();
  initNavActiveSpread();
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
  const hero = document.getElementById("hero-wrapper");

  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");

  // State particles
  let particles = [];

  // Opacity untuk fade in/out saat scroll
  let opacity = 0;
  let targetOpacity = 0;
  const fadeSpeed = 0.03;

  hero.addEventListener("click", (e) => {
    // Gunakan clientX/Y untuk fixed positioning (viewport-relative)
    const clickX = e.clientX;
    const clickY = e.clientY;

    for (let i = 0; i < 25; i++) {
      const p = new Particle();
      p.x = clickX;
      p.y = clickY;
      p.size = Math.random() * 4 + 1;
      p.speedY = Math.random() * 2 + 1;
      particles.push(p);
    }
  });

  // ===============================
  // CANVAS RESPONSIVE
  // ===============================

  function resizeCanvas() {
    // Sesuai request: Gunakan innerWidth/innerHeight untuk full viewport interaction
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  // ===============================
  // MOUSE TRACKING
  // ===============================

  const mouse = {
    x: null,
    y: null,
    radius: 100 // radius kecil: hanya tarik partikel dekat cursor
  };

  // Track mouse pakai pageY agar tetap akurat saat di-scroll
  window.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const isOverHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (isOverHero) {
      // Gunakan clientX/Y langsung (viewport relative) untuk sync dengan canvas fixed
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  // Reset mouse saat keluar window
  document.addEventListener("mouseleave", () => {
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
      this.size = Math.random() * 2.5 + 1.5; // ukuran sedang: 1.5–4px
      this.speedY = Math.random() * 1.0 + 0.8; // lebih cepat naik: 0.8–1.8
      this.alpha = Math.random() * 0.5 + 0.3;  // 0.3–0.8
      this.density = Math.random() * 20 + 5;
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
          // Gaya tarik ke mouse — DIPERKUAT
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          this.vx += Math.cos(angle) * force * 2.0;  // semula 0.6
          this.vy += Math.sin(angle) * force * 2.0;  // semula 0.6
        }
      }

      // Gesekan — sedikit dikurangi agar partikel lebih responsif
      this.vx *= 0.90;
      this.vy *= 0.90;

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
    for (let i = 0; i < 200; i++) {  // dinaikkan dari 120 ke 200
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

  // Threshold rendah (0.05) agar partikel tetap aktif
  // meski hero sangat panjang dan hanya sebagian kecil yang terlihat
  const observer = new IntersectionObserver(
    ([entry]) => {
      targetOpacity = entry.isIntersecting ? 1 : 0;
    },
    { threshold: 0.05 }
  );

  observer.observe(hero);

  // Resize canvas saat window resize
  window.addEventListener("resize", resizeCanvas);
}

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

    avatar.style.transform = `translate(${currentX * strength}px, ${currentY * strength}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}

// ===============================
// NAVBAR ACTIVE + LETTER SPREAD
// ===============================

function initNavActiveSpread() {
  const navLinks = document.querySelectorAll(".nav-link");

  // --- 1. Wrap each link's text in letter <span>s ---
  navLinks.forEach((link) => {
    const word = link.textContent.trim();
    link.innerHTML = `<span class="nav-letters">${
      word.split("").map((c) => `<span class="nav-letter">${c}</span>`).join("")
    }</span>`;
  });

  // --- 2. Sections to watch (in DOM order) ---
  const sectionIds = ["home", "about", "skills", "projects", "contact"];

  // Map section id → nav link (contact covers footer too)
  function getLinkForSection(id) {
    if (id === "home") return null; // no nav item for home, all inactive
    return document.querySelector(`.nav-link[data-section="${id}"]`);
  }

  // --- 3. Track which section is most visible ---
  let currentActive = null;
  let spreadInterval = null;

  function setActive(link) {
    if (link === currentActive) return;

    // Clear old active
    if (currentActive) {
      currentActive.classList.remove("nav-active", "nav-spread");
      clearInterval(spreadInterval);
    }

    currentActive = link;

    if (!link) return;

    link.classList.add("nav-active");

    // Start spread loop immediately
    runSpread(link);
    spreadInterval = setInterval(() => runSpread(link), 2000);
  }

  function runSpread(link) {
    if (!link) return;

    // Phase 1: spread (0ms)
    link.classList.add("nav-spread");

    // Phase 2: snap back (700ms)
    setTimeout(() => {
      link.classList.remove("nav-spread");
    }, 700);
  }

  // --- 4. IntersectionObserver — pick most-visible section ---
  const visibilityMap = {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap[entry.target.id] = entry.intersectionRatio;
      });

      // Find section with highest visibility
      let topId = null;
      let topRatio = 0;
      sectionIds.forEach((id) => {
        const ratio = visibilityMap[id] || 0;
        if (ratio > topRatio) {
          topRatio = ratio;
          topId = id;
        }
      });

      setActive(getLinkForSection(topId));
    },
    {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // --- 5. Hover stagger on non-active links ---
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (link.classList.contains("nav-active")) return;
      link.querySelectorAll(".nav-letter").forEach((l, i) => {
        setTimeout(() => {
          l.style.transform = "translateY(-2px)";
        }, i * 30);
      });
    });
    link.addEventListener("mouseleave", () => {
      if (link.classList.contains("nav-active")) return;
      link.querySelectorAll(".nav-letter").forEach((l) => {
        l.style.transform = "translateY(0px)";
      });
    });
  });
}

function initIntroScroll() {
  const intro = document.getElementById("intro");
  const imgAvatar = document.getElementById("img-avatar");
  const imgWisnu = document.getElementById("img-wisnu");
  const introText = document.getElementById("intro-text");

  if (!intro || !imgAvatar || !imgWisnu || !introText) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Trigger transisi saat scroll lebih dari 50px
    if (scrollY > 50) {
      // Sembunyikan avatar asli
      imgAvatar.classList.remove("opacity-100", "blur-0");
      imgAvatar.classList.add("opacity-0", "scale-105", "blur-md");

      // Tampilkan avatar wisnu
      imgWisnu.classList.remove("opacity-0", "scale-95", "blur-md");
      imgWisnu.classList.add("opacity-100", "scale-100", "blur-0");

      // Efek pada text WISNU
      introText.style.transform = `translate(-50%, calc(-50% - ${scrollY * 0.2}px)) scale(${1 + scrollY * 0.001})`;
      introText.style.letterSpacing = `${scrollY * 0.05}px`;
    } else {
      // Kembalikan ke state awal
      imgAvatar.classList.remove("opacity-0", "scale-105", "blur-md");
      imgAvatar.classList.add("opacity-100", "blur-0");

      imgWisnu.classList.remove("opacity-100", "scale-100", "blur-0");
      imgWisnu.classList.add("opacity-0", "scale-95", "blur-md");

      introText.style.transform = `translate(-50%, -50%) scale(1)`;
      introText.style.letterSpacing = `0px`;
    }
  });
}
