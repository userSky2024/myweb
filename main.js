(function(){
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 主题 ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");
  try{
    const saved = localStorage.getItem("blog-theme");
    if(saved) root.setAttribute("data-theme", saved);
  }catch(e){}
  themeBtn.addEventListener("click", function(){
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try{ localStorage.setItem("blog-theme", next); }catch(e){}
  });

  /* ---------- 进度条 + 导航 + 回到顶部 ---------- */
  const progress = document.getElementById("progress");
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");
  let ticking = false;

  function onScroll(){
    const st = window.scrollY || 0;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (h > 0 ? Math.min(st / h, 1) : 0) + ")";
    nav.classList.toggle("scrolled", st > 24);
    toTop.classList.toggle("show", st > 500);
    ticking = false;
  }
  window.addEventListener("scroll", function(){
    if(!ticking){ ticking = true; requestAnimationFrame(onScroll); }
  }, {passive:true});
  onScroll();

  toTop.addEventListener("click", function(){
    window.scrollTo({top:0, behavior: reduce ? "auto" : "smooth"});
  });

  /* ---------- 打字机 ---------- */
  const phrases = [
    "前端工程师 / 界面设计爱好者",
    "在写 CSS 的时候顺便想事情",
    "慢一点，读点东西。"
  ];
  const typedEl = document.getElementById("typed");
  let pi = 0, ci = 0, deleting = false;

  function typeLoop(){
    const word = phrases[pi];
    typedEl.textContent = word.slice(0, ci);
    if(!deleting){
      if(ci < word.length){ ci++; setTimeout(typeLoop, 78); }
      else { deleting = true; setTimeout(typeLoop, 2000); }
    } else {
      if(ci > 0){ ci--; setTimeout(typeLoop, 34); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 320); }
    }
  }
  if(reduce){ typedEl.textContent = phrases[0]; } else { setTimeout(typeLoop, 900); }

  /* ---------- 入场 reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduce){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -60px 0px"});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---------- 数字滚动 ---------- */
  function countUp(el){
    const target = parseInt(el.dataset.count, 10) || 0;
    if(reduce){ el.textContent = target.toLocaleString("en-US"); return; }
    const dur = 1500, start = performance.now();
    function step(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const nums = document.querySelectorAll("[data-count]");
  if("IntersectionObserver" in window){
    const nio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ countUp(en.target); nio.unobserve(en.target); }
      });
    }, {threshold:0.6});
    nums.forEach(function(n){ nio.observe(n); });
  } else {
    nums.forEach(countUp);
  }

  /* ---------- 鼠标光斑 ---------- */
  const glow = document.getElementById("glow");
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my, glowOn = false;

  window.addEventListener("mousemove", function(e){
    mx = e.clientX; my = e.clientY;
    if(!glowOn && window.matchMedia("(hover: hover)").matches){
      glowOn = true;
      document.body.classList.add("pointer-ready");
      requestAnimationFrame(glowLoop);
    }
  }, {passive:true});

  function glowLoop(){
    gx += (mx - gx) * 0.09;
    gy += (my - gy) * 0.09;
    glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
    requestAnimationFrame(glowLoop);
  }

  /* ---------- 卡片 3D 倾斜 ---------- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if(fine && !reduce){
    document.querySelectorAll(".card").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * 4.2).toFixed(2) + "deg) rotateY(" +
          (px * 5.2).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  }

  /* ---------- 标签筛选 ---------- */
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");
  chips.forEach(function(chip){
    chip.addEventListener("click", function(){
      chips.forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
      const f = chip.dataset.filter;

      cards.forEach(function(card){
        const match = (f === "all" || card.dataset.tag === f);
        card.classList.remove("pop");
        if(match){
          card.classList.remove("hide");
          void card.offsetWidth;
          card.classList.add("pop");
          card.addEventListener("animationend", function(){
            card.classList.remove("pop");
          }, {once:true});
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ---------- Hero 轻微视差 ---------- */
  const heroInner = document.getElementById("heroInner");
  if(!reduce && window.innerWidth > 680){
    let pTick = false;
    window.addEventListener("scroll", function(){
      if(pTick) return;
      pTick = true;
      requestAnimationFrame(function(){
        const y = window.scrollY;
        if(y < window.innerHeight){
          heroInner.style.transform = "translate3d(0," + (y * 0.14) + "px,0)";
          heroInner.style.opacity = Math.max(1 - y / (window.innerHeight * 0.85), 0).toFixed(3);
        }
        pTick = false;
      });
    }, {passive:true});
  }

  /* ---------- 订阅表单（仅前端演示，不提交） ---------- */
  const subForm = document.getElementById("subForm");
  if(subForm){
    subForm.addEventListener("submit", function(e){ e.preventDefault(); });
  }
})();
