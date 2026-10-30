(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 打字机 ---------- */
  const phrases = [
    "前端工程师 / 界面设计爱好者",
    "在写 CSS 的时候顺便想事情",
    "慢一点，读点东西。",
  ];
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    let pi = 0;
    let ci = 0;
    let deleting = false;

    const typeLoop = () => {
      const word = phrases[pi];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting) {
        if (ci < word.length) {
          ci++;
          setTimeout(typeLoop, 78);
        } else {
          deleting = true;
          setTimeout(typeLoop, 2000);
        }
      } else if (ci > 0) {
        ci--;
        setTimeout(typeLoop, 34);
      } else {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(typeLoop, 320);
      }
    };

    if (reduce) typedEl.textContent = phrases[0];
    else setTimeout(typeLoop, 900);
  }

  /* ---------- 数字滚动 ---------- */
  const countUp = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduce) {
      el.textContent = target.toLocaleString("en-US");
      return;
    }
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const nio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            countUp(en.target);
            nio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => nio.observe(n));
  } else {
    nums.forEach(countUp);
  }

  /* ---------- 卡片 3D 倾斜 ---------- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" +
          (-py * 4.2).toFixed(2) +
          "deg) rotateY(" +
          (px * 5.2).toFixed(2) +
          "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 标签筛选 ---------- */
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;

      cards.forEach((card) => {
        const match = f === "all" || card.dataset.tag === f;
        card.classList.remove("pop");
        if (match) {
          card.classList.remove("hide");
          void card.offsetWidth;
          card.classList.add("pop");
          card.addEventListener(
            "animationend",
            () => {
              card.classList.remove("pop");
            },
            { once: true }
          );
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ---------- Hero 视差 ---------- */
  const heroInner = document.getElementById("heroInner");
  if (heroInner && !reduce && window.innerWidth > 680) {
    let pTick = false;
    window.addEventListener(
      "scroll",
      () => {
        if (pTick) return;
        pTick = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroInner.style.transform = "translate3d(0," + y * 0.14 + "px,0)";
            heroInner.style.opacity = Math.max(1 - y / (window.innerHeight * 0.85), 0).toFixed(3);
          }
          pTick = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- 订阅表单（仅前端演示） ---------- */
  const subForm = document.getElementById("subForm");
  if (subForm) {
    subForm.addEventListener("submit", (e) => e.preventDefault());
  }
})();
