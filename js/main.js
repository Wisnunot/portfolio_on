document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles");
  const hero = document.getElementById("home");

  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  let animationId;

  let particles = [];
  let opacity = 0;        // 0 = invisible, 1 = full
  let targetOpacity = 0; // arah fade
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

  function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // smooth fade
    opacity += (targetOpacity - opacity) * fadeSpeed;

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // 👁️ Observer
  const observer = new IntersectionObserver(
    ([entry]) => {
      targetOpacity = entry.isIntersecting ? 1 : 0;
    },
    { threshold: 0.25 }
  );

  observer.observe(hero);

  window.addEventListener("resize", resizeCanvas);
});
