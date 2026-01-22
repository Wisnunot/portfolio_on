// ===============================
// LOAD PARTIALS
// ===============================
async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

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
}

document.addEventListener("DOMContentLoaded", loadAll);

function initNavbar() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

function initParticles() {
  const canvas = document.getElementById("particles");
  const hero = document.getElementById("home");

  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let opacity = 0;
  let targetOpacity = 0;
  const fadeSpeed = 0.03;

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.alpha = Math.random();
    }

    update() {
      this.y -= this.speedY;
      if (this.y < 0) this.reset();
    }

    draw() {
      ctx.fillStyle = `rgba(56,189,248,${this.alpha * opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    opacity += (targetOpacity - opacity) * fadeSpeed;

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();

  const observer = new IntersectionObserver(
    ([entry]) => {
      targetOpacity = entry.isIntersecting ? 1 : 0;
    },
    { threshold: 0.25 }
  );

  observer.observe(hero);
  window.addEventListener("resize", resizeCanvas);
}