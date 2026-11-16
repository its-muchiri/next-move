/* ============================================================
   Next Move — Animations
   GSAP 3 + ScrollTrigger (cdnjs CDN)
   Shared vanilla JS: one init per page driven by data-page.
   Brand tokens, helpers, globals, then page-specific sections.
   ============================================================ */

/* ------------------------------------------------------------
   Motion design tokens (single source of truth)
   ------------------------------------------------------------ */
const TOKENS = {
  dur: { fast: 0.25, base: 0.6, slow: 1.0, hero: 1.2 },
  ease: {
    entrance: "power3.out",
    exit: "power2.in",
    hover: "power2.out",
    signature: "expo.out",
  },
  stagger: { cards: 0.08, letters: 0.04 },
  dist: { reveal: 24, revealLg: 40 },
  scrollStart: "top 85%",
  scrollOnce: "play none none none",
};

/* ------------------------------------------------------------
   Reduced-motion fallback (prefers-reduced-motion)
   ------------------------------------------------------------ */
const RM = {
  dur: { fast: 0.2, base: 0.2, slow: 0.2, hero: 0.2 },
  ease: { entrance: "none", exit: "none", hover: "none", signature: "none" },
  stagger: { cards: 0, letters: 0 },
  dist: { reveal: 0, revealLg: 0 },
  scrollStart: "top 90%",
  scrollOnce: "play none none none",
};

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TK = prefersReduced ? RM : TOKENS;

/* ------------------------------------------------------------
   GSAP + ScrollTrigger (loaded from CDN in <head>)
   ------------------------------------------------------------ */
function regScrollTrigger() {
  if (typeof gsap !== "undefined" && typeof gsap.registerPlugin === "function") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

/* ------------------------------------------------------------
   Reusable helpers
   ------------------------------------------------------------ */

/* Fade-up reveal (transform + opacity only). Initial state set by JS. */
function reveal(el, opts = {}) {
  const {
    dist = TK.dist.reveal,
    dur = TK.dur.base,
    ease = TK.ease.entrance,
    delay = 0,
    once = true,
    x = 0,
  } = opts;
  gsap.from(el, {
    x,
    y: dist,
    opacity: 0,
    duration: dur,
    ease,
    delay,
    immediateRender: true,
    scrollTrigger: once
      ? { trigger: el, start: TK.scrollStart, toggleActions: TK.scrollOnce }
      : { trigger: el, start: TK.scrollStart, toggleActions: "play none reverse none" },
  });
}

/* Stagger children of a parent into view. */
function staggerIn(parent, children, opts = {}) {
  const {
    dist = TK.dist.reveal,
    dur = TK.dur.base,
    stagger = TK.stagger.cards,
    ease = TK.ease.entrance,
  } = opts;
  gsap.from(children, {
    y: dist,
    opacity: 0,
    duration: dur,
    stagger,
    ease,
    immediateRender: true,
    scrollTrigger: {
      trigger: parent,
      start: TK.scrollStart,
      toggleActions: TK.scrollOnce,
    },
  });
}

/* Count a number up from 0 once when visible. */
function countUp(el, target, opts = {}) {
  const {
    dur = TK.dur.slow,
    ease = TK.ease.entrance,
    prefix = "",
    suffix = "",
    decimals = 0,
  } = opts;
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration: dur,
    ease,
    scrollTrigger: {
      trigger: el,
      start: TK.scrollStart,
      toggleActions: TK.scrollOnce,
    },
    onUpdate: () => {
      el.textContent = prefix + obj.value.toFixed(decimals) + suffix;
    },
  });
}

/* Draw an SVG stroke (stroke-dashoffset) when it enters. */
function drawSVG(el, opts = {}) {
  const { dur = TK.dur.slow, ease = TK.ease.entrance } = opts;
  const length = el.getTotalLength ? el.getTotalLength() : 0;
  if (!length) return;
  el.style.strokeDasharray = length;
  el.style.strokeDashoffset = length;
  gsap.fromTo(
    el,
    { strokeDashoffset: length },
    {
      strokeDashoffset: 0,
      duration: dur,
      ease,
      immediateRender: true,
      scrollTrigger: {
        trigger: el,
        start: TK.scrollStart,
        toggleActions: TK.scrollOnce,
      },
    }
  );
}

/* Split text into word spans for word-by-word mask reveal. Returns word nodes. */
function splitWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = "";
  const words = text.split(/\s+/);
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "nm-word";
    span.style.display = "inline-block";
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return el.querySelectorAll(".nm-word");
}

/* Animate an element along an L path (axis A then axis B). */
function knightsMove(el, { x = 40, y = -40, dur = TK.dur.hero, ease = TK.ease.signature } = {}) {
  gsap.to(el, {
    x,
    y,
    duration: dur,
    ease,
    delay: dur * 0.5,
  });
}

/* Gentle idle float loop. */
function idleFloat(el, { amp = 3, dur = 6 } = {}) {
  gsap.to(el, {
    y: amp,
    duration: dur / 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/* Remove will-change after a tween finishes. */
function clearWillChange(targets) {
  gsap.set(targets, { clearProps: "will-change" });
}

/* ------------------------------------------------------------
   Global animations (all pages)
   ------------------------------------------------------------ */
function initGlobal() {
  /* Mark HTML as JS-ready; initial hidden states are applied by GSAP from() tweens
     (immediateRender) so content stays visible if JS fails. */
  document.documentElement.classList.add("js-ready");

  const body = document.body;
  if (body) {
    /* Page load: soft fade-in of the page. Masthead/first section slides down 16px. */
    gsap.set(body, { opacity: 0 });
    const masthead = document.querySelector("section:first-of-type, header:first-of-type, [class*='masthead'], [class*='hero']");
    const mastheadInner = masthead
      ? masthead.querySelector(".max-w-*, .mx-auto, > div") || masthead
      : null;

    const tl = gsap.timeline({ defaults: { ease: TK.ease.entrance, duration: TK.dur.hero } });
    tl.to(body, { opacity: 1, duration: TK.dur.base }, 0);
    if (mastheadInner) {
      tl.from(mastheadInner, { y: 16, opacity: 0, duration: TK.dur.base }, 0);
    }
  }

  /* Scroll-progress bar (2px, royal blue) at top of page. */
  (function progressBar() {
    const bar = document.createElement("div");
    Object.assign(bar.style, {
      position: "fixed",
      top: 0,
      left: 0,
      height: "2px",
      width: "0%",
      background: "#014C8F",
      zIndex: 9999,
      pointerEvents: "none",
    });
    document.documentElement.appendChild(bar);
    const update = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* Masthead/compact shadow after scrolling 40px (no nav element exists; masthead is the header). */
  (function mastheadScroll() {
    const masthead =
      document.querySelector("section:first-of-type, header:first-of-type") || document.querySelector("main > *:first-child");
    if (!masthead) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 40;
        if (scrolled) {
          gsap.to(masthead, {
            duration: TK.dur.base,
            ease: TK.ease.hover,
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          });
        } else {
          gsap.to(masthead, {
            duration: TK.dur.base,
            ease: TK.ease.hover,
            boxShadow: "none",
          });
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* Buttons: primary lift + shadow + arrow nudge; secondary left-fill via inner span. */
  (function buttons() {
    const primary = document.querySelectorAll(
      'a[class*="bg-[#E97619]"], a[class*="bg-[#E97619]"], button[class*="bg-[#E97619]"], a[class*="bg-[#e97619]"]'
    );
    primary.forEach((btn) => {
      let arrow = btn.querySelector(".material-symbols-outlined");
      if (!arrow) {
        arrow = document.createElement("span");
        arrow.className = "nm-arrow";
        arrow.textContent = "\u2192";
        arrow.style.cssText = "display:inline-block;margin-left:0.5rem;";
        btn.appendChild(arrow);
      }
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { y: -2, boxShadow: "0 8px 24px rgba(233,118,25,0.35)", duration: TK.dur.fast, ease: TK.ease.hover });
        gsap.to(arrow, { x: 4, duration: TK.dur.fast, ease: TK.ease.hover });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { y: 0, boxShadow: "none", duration: TK.dur.fast, ease: TK.ease.hover });
        if (arrow) gsap.to(arrow, { x: 0, duration: TK.dur.fast, ease: TK.ease.hover });
      });
      btn.addEventListener("mousedown", () => {
        gsap.to(btn, { y: 1, scale: 0.98, duration: 0.1, ease: TK.ease.exit });
      });
      btn.addEventListener("mouseup", () => {
        gsap.to(btn, { y: 0, scale: 1, duration: TK.dur.fast, ease: TK.ease.hover });
      });
    });

    const secondary = document.querySelectorAll(
      'a[class*="border-2"][class*="border-[#EFDDC9]"], a[class*="bg-transparent"][class*="border"]'
    );
    secondary.forEach((btn) => {
      const label = btn.textContent.trim();
      btn.innerHTML = `<span style="display:inline-block;overflow-hidden;position:relative;"><span style="display:inline-block;position:relative;left:-100%;">${label}</span></span>`;
      const fill = btn.querySelector("span > span");
      btn.addEventListener("mouseenter", () => {
        gsap.to(fill, { left: "0%", duration: TK.dur.base, ease: TK.ease.hover });
        gsap.to(btn, { color: "#0A2540", duration: TK.dur.base });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(fill, { left: "-100%", duration: TK.dur.base, ease: TK.ease.hover });
        gsap.to(btn, { color: "", duration: TK.dur.base });
      });
    });
  })();

  /* Cards: lift 6px + deeper shadow on hover. */
  (function cards() {
    const cardSel =
      ".bg-[#FAF5EE], .bg-white.rounded-xl, [class*='rounded-xl'][class*='shadow'], .bg-[#EFDDC9].rounded";
    document.querySelectorAll(cardSel).forEach((card) => {
      if (card.closest("button, a")) return;
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", duration: TK.dur.fast, ease: TK.ease.hover });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, boxShadow: "", duration: TK.dur.fast, ease: TK.ease.hover });
      });
    });
  })();

  /* Scroll reveals: data-animate="fade-up|fade-in|slide-left|slide-right". */
  (function scrollReveals() {
    const map = {
      "fade-up": { y: TK.dist.reveal },
      "fade-in": { y: 0 },
      "slide-left": { x: TK.dist.reveal },
      "slide-right": { x: -TK.dist.reveal },
    };
    document.querySelectorAll('[data-animate]').forEach((el) => {
      const type = el.getAttribute("data-animate");
      const cfg = map[type] || { y: TK.dist.reveal };
      reveal(el, { dist: cfg.y !== 0 ? cfg.y : TK.dist.reveal, x: cfg.x });
    });
    /* data-stagger on a parent staggers its direct children. */
    document.querySelectorAll('[data-stagger]').forEach((parent) => {
      const children = Array.from(parent.children).filter((c) => !c.matches("script, style"));
      staggerIn(parent, children);
    });
  })();

  /* Section dividers: draw in horizontally from center outward on enter. */
  (function dividers() {
    document.querySelectorAll('[data-divider], [class*="border-t"], [class*="border-y"]').forEach((el) => {
      if (el.closest("[data-stagger]")) return;
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: "center",
        duration: TK.dur.base,
        ease: TK.ease.entrance,
        immediateRender: true,
        scrollTrigger: { trigger: el, start: TK.scrollStart, toggleActions: TK.scrollOnce },
      });
    });
  })();

  /* Footer columns fade up with stagger. */
  (function footer() {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const cols = Array.from(footer.children).filter((c) => c.nodeType === 1);
    if (cols.length) staggerIn(footer, cols, { dist: TK.dist.reveal, stagger: 0.1 });
  })();

  /* Images: very slow subtle scale reveal on enter. */
  (function images() {
    document.querySelectorAll("img").forEach((img) => {
      gsap.from(img, {
        scale: 1.04,
        opacity: 0,
        duration: TK.dur.slow,
        ease: TK.ease.entrance,
        immediateRender: true,
        scrollTrigger: { trigger: img, start: TK.scrollStart, toggleActions: TK.scrollOnce },
      });
    });
  })();

  ScrollTrigger.refresh();
}

/* ------------------------------------------------------------
   HOME
   ------------------------------------------------------------ */
function initHome() {
  /* Hero: headline word-by-word mask reveal, then subheadline, then buttons. */
  (function hero() {
    const headline = document.querySelector("h1");
    const sub = headline ? headline.nextElementSibling : null;
    const btns = document.querySelector(".flex.items-center.gap-space-md, .flex.flex-wrap.items-center");
    const btnList = btns ? Array.from(btns.querySelectorAll("a")) : [];

    if (headline) splitWords(headline);
    const words = headline ? headline.querySelectorAll(".nm-word") : [];

    const tl = gsap.timeline({ defaults: { ease: TK.ease.entrance } });
    if (words.length) {
      tl.from(words, {
        y: TK.dist.revealLg,
        opacity: 0,
        duration: TK.dur.hero,
        stagger: TK.stagger.letters,
        ease: TK.ease.entrance,
        immediateRender: true,
      });
    }
    if (sub) {
      tl.from(sub, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base }, "-=0.4");
    }
    if (btnList.length) {
      tl.from(btnList, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base, stagger: TK.stagger.cards }, "-=0.4");
    }

    /* Chessboard/knight graphic: board reveal square-by-square, then knight L-move + idle float. */
    const board = document.querySelector(".grid.grid-cols-4.grid-rows-4");
    if (board) {
      const cells = Array.from(board.children).filter((c) => c.nodeType === 1);
      const piece = board.querySelector('[class*="sports_esports"], [class*="crisis_alert"]') || cells[0];
      tl.from(cells, {
        opacity: 0,
        scale: 0.6,
        duration: TK.dur.slow,
        stagger: { amount: TK.stagger.cards * 4, from: "center" },
        ease: TK.ease.entrance,
      });
      tl.to(piece, { x: 16, duration: TK.dur.base, ease: TK.ease.signature }, "-=0.6");
      tl.to(piece, { y: 16, duration: TK.dur.base, ease: TK.ease.signature }, "-=0.4");
      idleFloat(piece, { amp: 3, dur: 6 });
    }
  })();

  /* The Next Move Difference: three pillar cards stagger up; icon stroke draws on enter. */
  (function pillars() {
    const section = document.querySelector("section.bg-[#EFDDC9] .grid.grid-cols-1.md\\:grid-cols-3") || document.querySelector(".grid.grid-cols-1\\:md\\:grid-cols-3");
    const cards = section ? Array.from(section.children).filter((c) => c.nodeType === 1) : [];
    if (cards.length) {
      staggerIn(section || cards[0].parentElement, cards);
      cards.forEach((card) => {
        const icon = card.querySelector(".material-symbols-outlined");
        if (icon) {
          /* Material icon is text; draw its container bg instead as a subtle pop. */
          gsap.from(icon, { scale: 0, opacity: 0, duration: TK.dur.base, ease: TK.ease.back || "power2.out" });
        }
      });
    }
  })();

  /* Find Your Level: four tier cards stagger in from bottom. */
  (function tiers() {
    const grid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4") || document.querySelector('.grid[class*="grid-cols-4"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) staggerIn(grid || cards[0].parentElement, cards, { dist: TK.dist.reveal });
  })();

  /* Social proof: stat numbers count up; testimonial + quote mark scale in. */
  (function social() {
    const stats = document.querySelectorAll(".font-display.text-display-mobile");
    stats.forEach((stat) => {
      const text = stat.textContent.replace(/\D/g, "");
      const num = text ? parseInt(text, 10) : 0;
      if (num) countUp(stat, num, { prefix: stat.textContent.includes("+") ? "+" : "", suffix: stat.textContent.includes("%") ? "%" : stat.textContent.includes("Elo") ? " Elo" : "" });
    });
    const testimonial = document.querySelector(".bg-[#FAF5EE].relative.overflow-hidden") || document.querySelector("p.font-display");
    const quoteMark = document.querySelector(".material-symbols-outlined.text-36px, .material-symbols-outlined.text\\[36px\\]") || document.querySelector(".absolute.-right-6");
    if (quoteMark) gsap.from(quoteMark, { scale: 0.5, opacity: 0, duration: TK.dur.base, ease: TK.ease.signature, scrollTrigger: { trigger: testimonial, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    if (testimonial) reveal(testimonial);
  })();

  /* Final CTA band: headline fades up, orange button single attention pulse. */
  (function cta() {
    const band = document.querySelector("section.bg-[#014C8F]") || document.querySelector("section:last-of-type");
    const h2 = band ? band.querySelector("h2") : null;
    const btn = band ? band.querySelector('a[class*="bg-[#E97619]"]') : null;
    if (h2) reveal(h2);
    if (btn) {
      reveal(btn);
      gsap.to(btn, {
        scale: 1.04,
        boxShadow: "0 0 20px rgba(233,118,25,0.45)",
        duration: 0.6,
        repeat: 1,
        yoyo: true,
        ease: TK.ease.hover,
        delay: 1,
      });
    }
  })();
}

/* ------------------------------------------------------------
   COACHING & PROGRAMS
   ------------------------------------------------------------ */
function initPrograms() {
  /* Header title reveals line by line (h1, pill, sub p). */
  (function header() {
    const masthead = document.querySelector("section:first-of-type, header:first-of-type");
    if (!masthead) return;
    const lines = Array.from(masthead.querySelectorAll("h1, p, div.inline-flex")).filter((el) => el.textContent.trim());
    gsap.from(lines, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base, stagger: TK.stagger.cards, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: masthead, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
  })();

  /* Progression path: connecting line draws in (scrubbed); step markers pop in as line reaches; knight's-move between steps; Tier 4 promotion. */
  (function path() {
    const line = document.querySelector('.hidden.lg\\:block.absolute.top-12.left-16.right-16.h-\\[2px\\]') || document.querySelector('.absolute.top-12.left-16.right-16.h-\\[2px\\]');
    const steps = document.querySelectorAll(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div.relative.z-10");
    if (line) {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: TK.dur.slow, ease: TK.ease.entrance, scrollTrigger: { trigger: line, start: TK.scrollStart, toggleActions: TK.scrollOnce, scrub: false } });
    }
    steps.forEach((step, i) => {
      const marker = step.querySelector(".w-10.h-10");
      const icon = step.querySelector("svg");
      const content = step.querySelector("h3, p");
      gsap.from(step, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: step, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
      if (marker) gsap.from(marker, { scale: 0.6, opacity: 0, duration: TK.dur.fast, ease: TK.ease.entrance, scrollTrigger: { trigger: step, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
      if (i === steps.length - 1) {
        /* Tier 4 / Competitive: promotion scale-and-glow. */
        const glow = step.querySelector(".ring-2") || marker;
        gsap.from(glow, { scale: 0.8, opacity: 0, duration: TK.dur.slow, ease: TK.ease.signature, scrollTrigger: { trigger: step, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
        gsap.to(glow, { boxShadow: "0 0 24px rgba(233,118,25,0.5)", repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });
      }
    });
  })();

  /* Tier sections: text from one side, visual from the other, alternating; bullets stagger. */
  (function tierSections() {
    const sections = document.querySelectorAll("section.bg-[#EFDDC9], section.bg-[#DCE8F4]");
    sections.forEach((section, i) => {
      const left = section.querySelector(".lg\\:w-5\\/12, > div > div:first-child");
      const right = section.querySelector(".lg\\:w-7\\/12, > div > div:last-child");
      const bullets = section.querySelectorAll("ul.space-y-4 > li");
      const fromLeft = i % 2 === 0 ? { x: -TK.dist.reveal } : { x: TK.dist.reveal };
      const fromRight = i % 2 === 0 ? { x: TK.dist.reveal } : { x: -TK.dist.reveal };
      if (left) gsap.from(left, { ...fromLeft, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: section, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
      if (right) gsap.from(right, { ...fromRight, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: section, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
      if (bullets.length) staggerIn(section, Array.from(bullets), { dist: TK.dist.reveal / 2, stagger: TK.stagger.cards * 0.5 });
    });
  })();

  /* Format cards: stagger up; hover lift. */
  (function formats() {
    const grid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-3.gap-8") || document.querySelector('.grid[class*="grid-cols-3"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) staggerIn(grid || cards[0].parentElement, cards);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.1)", duration: TK.dur.fast, ease: TK.ease.hover }));
      card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, boxShadow: "", duration: TK.dur.fast, ease: TK.ease.hover }));
    });
  })();
}

/* ------------------------------------------------------------
   ABOUT & PHILOSOPHY
   ------------------------------------------------------------ */
function initAbout() {
  /* Coach portrait: clip-path wipe left-to-right while frame border draws. */
  (function portrait() {
    const frame = document.querySelector(".relative.w-full.aspect-\\[3\\/4\\].overflow-hidden") || document.querySelector("img[alt*='Grandmaster']");
    const img = frame ? frame.querySelector("img") : null;
    if (img) {
      gsap.set(img, { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)" });
      gsap.to(img, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: TK.dur.base,
        ease: TK.ease.entrance,
        scrollTrigger: { trigger: img, start: TK.scrollStart, toggleActions: TK.scrollOnce },
      });
    }
    const frameBorder = frame ? frame.parentElement : null;
    if (frameBorder) reveal(frameBorder, { dist: TK.dist.reveal / 2 });
  })();

  /* Story paragraphs fade up in sequence; credential badges count up. */
  (function story() {
    const storyDiv = document.querySelector(".space-y-4.text-\[\\#0A2540\\]") || document.querySelector(".space-y-4");
    const paragraphs = storyDiv ? Array.from(storyDiv.querySelectorAll("p")) : [];
    if (paragraphs.length) {
      gsap.from(paragraphs, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base, stagger: TK.stagger.cards * 0.6, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: storyDiv, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    }
    const badges = document.querySelectorAll(".grid.grid-cols-2.sm\\:grid-cols-4 > div, .grid > div.p-3\\.5");
    badges.forEach((badge) => {
      const num = badge.querySelector(".text-xl.font-bold, .font-\\['Playfair_Display\\,'serif\\]");
      if (num) {
        const raw = num.textContent.replace(/[^\d.+x×]/g, "");
        const target = parseFloat(raw) || 0;
        const suffix = raw.includes("+") ? "+" : raw.includes("×") || raw.includes("x") ? "× Champ" : "";
        countUp(num, target, { suffix, decimals: 0 });
      } else {
        reveal(badge);
      }
    });
  })();

  /* Methodology blocks: reveal one by one with icons drawing in. */
  (function methodology() {
    const grid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-3.gap-6") || document.querySelector('.grid[class*="grid-cols-3"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) {
      staggerIn(grid || cards[0].parentElement, cards);
      cards.forEach((card) => {
        const icon = card.querySelector(".material-symbols-outlined.text-2xl, .material-symbols-outlined");
        if (icon) gsap.from(icon, { scale: 0, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, scrollTrigger: { trigger: card, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
      });
    }
  })();

  /* Pull-quote: words fade in softly in sequence. */
  (function pullQuote() {
    const blockquote = document.querySelector("blockquote");
    const mark = document.querySelector('.material-symbols-outlined.text-5xl') || document.querySelector('.material-symbols-outlined.text\\[5xl\\]');
    if (mark) gsap.from(mark, { scale: 0.6, opacity: 0, duration: TK.dur.base, ease: TK.ease.signature, scrollTrigger: { trigger: blockquote, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    if (blockquote) {
      const text = blockquote.textContent.trim();
      blockquote.innerHTML = "";
      text.split(/\s+/).forEach((w, i) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = w;
        blockquote.appendChild(span);
        if (i < text.split(/\s+/).length - 1) blockquote.appendChild(document.createTextNode(" "));
      });
      const words = blockquote.querySelectorAll("span");
      gsap.from(words, { opacity: 0, y: 8, duration: TK.dur.base, stagger: TK.stagger.letters * 2, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: blockquote, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    }
  })();

  /* Who I Work With cards: stagger in; hover tilt max 2deg. */
  (function cohorts() {
    const grid = document.querySelector(".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-6") || document.querySelector('.grid[class*="grid-cols-4"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) staggerIn(grid || cards[0].parentElement, cards);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => gsap.to(card, { rotate: 2, y: -4, duration: TK.dur.fast, ease: TK.ease.hover }));
      card.addEventListener("mouseleave", () => gsap.to(card, { rotate: 0, y: 0, duration: TK.dur.fast, ease: TK.ease.hover }));
    });
  })();
}

/* ------------------------------------------------------------
   PRICING & BOOKING
   ------------------------------------------------------------ */
function initPricing() {
  /* Package cards stagger up; Most Popular scales 1.03; badge slides in last. */
  (function packages() {
    const grid = document.querySelector("section.grid.grid-cols-1.md\\:grid-cols-3.gap-8") || document.querySelector('section > .grid[class*="grid-cols-3"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) staggerIn(grid || cards[0].parentElement, cards);
    const popular = document.querySelector('.ring-2.ring-\\[\\#E97619\\]') || cards[1];
    if (popular) gsap.from(popular, { scale: 0.97, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: popular, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    gsap.to(popular, { scale: 1.03, duration: TK.dur.base, ease: TK.ease.entrance, delay: TK.dur.base });
    const badge = document.querySelector('.absolute.-top-3\\.5 > span');
    if (badge) gsap.from(badge, { y: -20, opacity: 0, duration: TK.dur.fast, ease: TK.ease.entrance, delay: TK.dur.base * 1.5 });
  })();

  /* Currency toggle: prices cross-fade and slide (old up/out, new up/in). */
  (function currency() {
    const prices = document.querySelectorAll(".price-val");
    const toggle = (type) => {
      prices.forEach((el) => {
        const val = type === "USD" ? el.getAttribute("data-usd") : el.getAttribute("data-intl");
        if (!val) return;
        gsap.to(el, { y: -12, opacity: 0, duration: 0.15, ease: TK.ease.exit, onComplete: () => {
          el.textContent = val;
          gsap.fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: TK.ease.entrance });
        } });
      });
    };
    window.setCurrency = (type) => {
      const btnUsd = document.getElementById("toggle-usd");
      const btnIntl = document.getElementById("toggle-intl");
      if (type === "USD") {
        btnUsd.className = "px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 bg-[#014C8F] text-[#EFDDC9] shadow-md";
        btnIntl.className = "px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 text-[#0A2540] hover:text-[#014C8F]";
      } else {
        btnIntl.className = "px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 bg-[#014C8F] text-[#EFDDC9] shadow-md";
        btnUsd.className = "px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 text-[#0A2540] hover:text-[#014C8F]";
      }
      toggle(type);
    };
  })();

  /* Scheduler: selected time slots quick orange highlight. */
  (function scheduler() {
    const slots = document.querySelectorAll(".slot-btn");
    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        slots.forEach((s) => gsap.to(s, { scale: 1, boxShadow: "none", duration: TK.dur.fast }));
        gsap.to(slot, { scale: 1.05, boxShadow: "0 0 12px rgba(233,118,25,0.45)", duration: TK.dur.fast, ease: TK.ease.hover });
      });
    });
    const calDays = document.querySelectorAll(".cal-day");
    calDays.forEach((day) => {
      day.addEventListener("click", () => gsap.to(day, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: TK.ease.hover }));
    });
  })();

  /* FAQ accordion: smooth height (max-height), one open at a time, plus->minus, keyboard accessible. */
  (function faq() {
    const items = document.querySelectorAll(".bg-white.rounded-xl.shadow-sm.overflow-hidden");
    items.forEach((item) => {
      const btn = item.querySelector("button");
      const content = item.querySelector(".faq-content");
      const icon = btn ? btn.querySelector(".material-symbols-outlined") : null;
      if (!btn || !content) return;
      content.style.overflow = "hidden";
      content.style.maxHeight = "0";
      content.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");

      const closeOthers = () => {
        items.forEach((other) => {
          if (other === item) return;
          const oc = other.querySelector(".faq-content");
          const ob = other.querySelector("button");
          const oi = ob ? ob.querySelector(".material-symbols-outlined") : null;
          if (oc) {
            const full = oc.scrollHeight;
            oc.classList.remove("hidden");
            oc.style.overflow = "hidden";
            oc.style.maxHeight = "0";
            gsap.to(oc, { maxHeight: 0, duration: 0.3, ease: TK.ease.entrance, onComplete: () => { oc.classList.add("hidden"); oc.style.maxHeight = "none"; oc.setAttribute("aria-hidden", "true"); } });
          }
          if (ob) ob.setAttribute("aria-expanded", "false");
          if (oi) oi.textContent = "add";
        });
      };

      const open = () => {
        closeOthers();
        content.classList.remove("hidden");
        content.style.overflow = "hidden";
        content.style.maxHeight = "0";
        /* force layout read after display:block so scrollHeight reflects natural height */
        content.offsetHeight;
        const full = content.scrollHeight;
        gsap.to(content, { maxHeight: full, duration: 0.3, ease: TK.ease.entrance, onComplete: () => {
          content.style.maxHeight = "none";
          content.setAttribute("aria-hidden", "false");
        } });
        btn.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "remove";
      };

      const close = () => {
        const full = content.scrollHeight;
        gsap.to(content, { maxHeight: 0, duration: 0.3, ease: TK.ease.entrance, onComplete: () => {
          content.classList.add("hidden");
          content.style.maxHeight = "none";
          content.setAttribute("aria-hidden", "true");
        } });
        btn.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "add";
      };

      const toggle = () => (btn.getAttribute("aria-expanded") === "true" ? close() : open());
      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });
    /* Neutralize any leftover inline toggleFaq to avoid conflicts. */
    window.toggleFaq = () => {};
  })();
}

/* ------------------------------------------------------------
   FREE RESOURCES
   ------------------------------------------------------------ */
function initResources() {
  /* Lead magnet banner: PDF mockup slides in w/ gentle rotateY tilt; form fades beside; input orange focus ring; submit checkmark draw. */
  (function leadMagnet() {
    const mockup = document.querySelector(".relative.w-full.max-w-\\[340px\\].aspect-\\[4\\/5\\]") || document.querySelector(".bg-\\[\\#0A2540\\].rounded-\\[12px\\]");
    const form = document.querySelector("form.flex.flex-col.sm\\:flex-row") || document.querySelector("form[onsubmit]");
    const input = document.querySelector('input[type="email"]');
    const btn = form ? form.querySelector('button[type="submit"]') : null;
    const card = mockup ? mockup.closest(".lg\\:col-span-5, div") : null;

    if (mockup) {
      gsap.from(mockup, { x: -TK.dist.revealLg, rotateY: 12, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: mockup, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    }
    if (form) {
      gsap.from(form, { x: TK.dist.revealLg, opacity: 0, duration: TK.dur.base, ease: TK.ease.entrance, immediateRender: true, scrollTrigger: { trigger: form, start: TK.scrollStart, toggleActions: TK.scrollOnce } });
    }
    if (input) {
      input.addEventListener("focus", () => {
        gsap.to(input, { boxShadow: "0 0 0 3px rgba(233,118,25,0.35)", borderColor: "#E97619", duration: TK.dur.fast, ease: TK.ease.hover });
      });
      input.addEventListener("blur", () => {
        gsap.to(input, { boxShadow: "none", borderColor: "", duration: TK.dur.fast, ease: TK.ease.hover });
      });
    }
    if (btn) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const label = btn.querySelector("span:first-child") || btn;
        const orig = label.textContent;
        label.textContent = "";
        const check = document.createElement("span");
        check.className = "nm-check";
        label.appendChild(check);
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M20 6L9 17l4-4");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#0A2540");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        check.appendChild(svg);
        drawSVG(path, { dur: 0.5 });
        gsap.to(btn, { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 });
        setTimeout(() => { label.textContent = "Guide sent!"; }, 700);
      });
    }
  })();

  /* Puzzle of the Week: reveal solution animates best move (piece slides along path). */
  (function puzzle() {
    const revealBtn = document.querySelector('button[onclick*="solutionBox"]');
    const solutionBox = document.getElementById("solutionBox");
    const board = document.querySelector("svg");
    const rook = board ? board.querySelector('text[x="175"][y="242"]') : null;
    if (revealBtn && solutionBox && rook) {
      revealBtn.addEventListener("click", () => {
        const hidden = solutionBox.classList.contains("hidden");
        if (hidden) {
          /* Move rook text along its capture path d4->d5 then settle, then show solution. */
          gsap.to(rook, { x: 175, y: 192, duration: 0.6, ease: TK.ease.signature, onComplete: () => {
            gsap.to(rook, { x: 175, y: 242, duration: 0.3 });
            solutionBox.classList.remove("hidden");
            gsap.from(solutionBox, { opacity: 0, y: 12, duration: TK.dur.base, ease: TK.ease.entrance });
          } });
        } else {
          solutionBox.classList.add("hidden");
        }
      });
    }
  })();

  /* Video & article cards stagger in; filter chips reflow grid. */
  (function cardsAndFilters() {
    const videoGrid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.gap-6");
    const articleGrid = document.querySelector("section:not(.bg-\\[\\#014C8F\\]) .grid.grid-cols-1.md\\:grid-cols-2.gap-6");
    [videoGrid, articleGrid].forEach((grid) => {
      if (!grid) return;
      const cards = Array.from(grid.children).filter((c) => c.matches("article, div"));
      if (cards.length) staggerIn(grid, cards);
    });
    const chips = document.querySelectorAll(".overflow-x-auto > button");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        /* Fade out grid, reflow implied, fade in. */
        const grid = chip.closest("section").querySelector(".grid");
        if (!grid) return;
        const cards = Array.from(grid.children).filter((c) => c.matches("article, div"));
        gsap.to(cards, { opacity: 0, duration: 0.2, ease: TK.ease.exit, onComplete: () => {
          gsap.from(cards, { opacity: 0, y: 12, duration: TK.dur.base, stagger: TK.stagger.cards * 0.5, ease: TK.ease.entrance });
        } });
      });
    });
  })();

  /* Newsletter strip: fade up. */
  (function newsletter() {
    const strip = document.querySelector("section.bg-\\[\\#014C8F\\]:last-of-type, section.bg-\[#014C8F\]:last-of-type") || document.querySelector("section.bg-[#014C8F]");
    if (strip) reveal(strip);
  })();
}

/* ------------------------------------------------------------
   CONTACT
   ------------------------------------------------------------ */
function initContact() {
  /* Form fields stagger in; labels float on focus; valid fields show animated checkmark; send button loading->success. */
  (function form() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    gsap.from(fields, { y: TK.dist.reveal, opacity: 0, duration: TK.dur.base, stagger: TK.stagger.cards, ease: TK.ease.entrance, immediateRender: true });
    fields.forEach((field) => {
      const label = field.closest(".flex.flex-col").querySelector("label");
      field.addEventListener("focus", () => {
        if (label) gsap.to(label, { y: -14, fontSize: "0.7rem", color: "#E97619", duration: TK.dur.fast, ease: TK.ease.hover });
      });
      field.addEventListener("blur", () => {
        if (!field.value && label) gsap.to(label, { y: 0, fontSize: "", color: "", duration: TK.dur.fast, ease: TK.ease.hover });
      });
      field.addEventListener("input", () => {
        const valid = field.checkValidity();
        let check = field.parentElement.querySelector(".nm-check");
        if (valid && !check) {
          check = document.createElement("span");
          check.className = "nm-check";
          check.style.cssText = "color:#E97619;margin-left:0.5rem;";
          field.parentElement.appendChild(check);
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width","14"); svg.setAttribute("height","14");
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d","M20 6L9 17l4-4"); p.setAttribute("fill","none"); p.setAttribute("stroke","#E97619"); p.setAttribute("stroke-width","3"); p.setAttribute("stroke-linecap","round"); p.setAttribute("stroke-linejoin","round");
          svg.appendChild(p); check.appendChild(svg);
          drawSVG(p, { dur: 0.3 });
        } else if (!valid && check) {
          check.remove();
        }
      });
    });
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const span = btn.querySelector("span:first-child");
        const orig = span ? span.textContent : btn.textContent;
        gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
        if (span) span.textContent = "Sending…";
        gsap.to(btn, { backgroundColor: "#014C8F", color: "#EFDDC9", duration: 0.3 });
        setTimeout(() => {
          if (span) span.textContent = "Sent!";
          gsap.to(btn, { backgroundColor: "#10B981", color: "#fff", duration: 0.3 });
          const success = document.getElementById("formSuccess");
          if (success) {
            success.classList.remove("hidden");
            gsap.from(success, { opacity: 0, y: 12, duration: TK.dur.base, ease: TK.ease.entrance });
          }
        }, 900);
      });
    }
  })();

  /* Info cards stagger in. */
  (function infoCards() {
    const grid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-3.gap-gutter") || document.querySelector('.grid[class*="gap-gutter"]');
    const cards = grid ? Array.from(grid.children).filter((c) => c.matches("div")) : [];
    if (cards.length) staggerIn(grid || cards[0].parentElement, cards);
  })();

  /* Social icon buttons lift + rotate 6deg on hover. */
  (function socials() {
    document.querySelectorAll("footer a.w-9.h-9, .w-9.h-9.rounded-xl").forEach((btn) => {
      btn.addEventListener("mouseenter", () => gsap.to(btn, { y: -4, rotate: 6, duration: TK.dur.fast, ease: TK.ease.hover }));
      btn.addEventListener("mouseleave", () => gsap.to(btn, { y: 0, rotate: 0, duration: TK.dur.fast, ease: TK.ease.hover }));
    });
  })();
}

/* ------------------------------------------------------------
   Dispatch + lifecycle
   ------------------------------------------------------------ */
function init() {
  regScrollTrigger();
  const page = document.body ? document.body.getAttribute("data-page") : null;
  initGlobal();
  switch (page) {
    case "home": initHome(); break;
    case "programs": initPrograms(); break;
    case "about": initAbout(); break;
    case "pricing": initPricing(); break;
    case "resources": initResources(); break;
    case "contact": initContact(); break;
    default: break;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* Cleanup ScrollTriggers if a page change ever occurs (static MPV: kept for safety). */
window.addEventListener("scroll", () => {}, { passive: true });
