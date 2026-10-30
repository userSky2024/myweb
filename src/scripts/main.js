(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- 主题 ---------- */
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("blog-theme", next);
      } catch (e) {}
    });
  }

  /* ---------- 进度条 + 导航 + 回到顶部 ---------- */
  const progress = document.getElementById("progress");
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");
  let ticking = false;

  function onScroll() {
    const st = window.scrollY || 0;
    const h = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.transform = "scaleX(" + (h > 0 ? Math.min(st / h, 1) : 0) + ")";
    }
    if (nav) nav.classList.toggle("scrolled", st > 24);
    if (toTop) toTop.classList.toggle("show", st > 500);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- 入场 reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 鼠标光斑 ---------- */
  const glow = document.getElementById("glow");
  if (glow) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let glowOn = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!glowOn && window.matchMedia("(hover: hover)").matches) {
          glowOn = true;
          document.body.classList.add("pointer-ready");
          requestAnimationFrame(glowLoop);
        }
      },
      { passive: true }
    );

    function glowLoop() {
      gx += (mx - gx) * 0.09;
      gy += (my - gy) * 0.09;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      requestAnimationFrame(glowLoop);
    }
  }
})();
