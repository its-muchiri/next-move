# Next Move — Animation System

Premium online chess coaching brand. Motion is deliberate, calm, confident, and crafted — never bouncy, flashy, or gamey.

## Stack
- **GSAP 3 + ScrollTrigger** loaded from cdnjs (3.12.7).
- Shared vanilla JS: `js/animations.js`, referenced by every page as `../js/animations.js`.
- One init per page, dispatched by `data-page` on `<body>`: `home`, `programs`, `about`, `pricing`, `resources`, `contact`.
- No bundler. No other animation libraries. CSS used only for tiny hover states that GSAP doesn't own.

## Tokens (edit once at the top of `js/animations.js`)
```js
const TOKENS = {
  dur: { fast: 0.25, base: 0.6, slow: 1.0, hero: 1.2 },
  ease: { entrance: "power3.out", exit: "power2.in", hover: "power2.out", signature: "expo.out" },
  stagger: { cards: 0.08, letters: 0.04 },
  dist: { reveal: 24, revealLg: 40 },
  scrollStart: "top 85%",
  scrollOnce: "play none none none",
};
```
Change any duration/easing/stagger/distance here; all helpers and sections read from `TOKENS`. A `prefers-reduced-motion` override (`RM`) swaps everything to 0.2s / no easing / zero distance.

## Data-attribute cheatsheet
Add these to markup (never change existing classes/IDs — only add attributes):

| Attribute | Values | Effect |
|---|---|---|
| `data-page` | `home\|programs\|about\|pricing\|resources\|contact` | On `<body>`; selects which page-specific init runs. |
| `data-animate` | `fade-up\|fade-in\|slide-left\|slide-right` | Element fades/slides into view on scroll (once). `fade-up` travels `dist.reveal`. |
| `data-stagger` | (any) | On a parent; staggers its direct children into view. |
| `data-count` | (number via JS) | Not a markup attribute — call `countUp(el, target)` for counting numbers. |
| `data-divider` | (any) | Section divider draws center-outward on enter. |

Declare initial hidden state **from JS, not CSS** (GSAP `from()` tweens with `immediateRender`), so content stays visible if JS fails. `js-ready` class is added to `<html>`.

## Helpers (reusable)
- `reveal(el, opts)` — fade-up (transform + opacity only).
- `staggerIn(parent, children, opts)` — staggered children reveal.
- `countUp(el, target, opts)` — count a number up from 0 once visible.
- `drawSVG(el, opts)` — draw an SVG stroke via `stroke-dashoffset`.
- `splitWords(el)` — split text into `.nm-word` spans for word-by-word reveal.
- `knightsMove(el, opts)` — L-path (axis A then axis B) for chess-themed motion.
- `idleFloat(el, opts)` — gentle 6s float loop.
- `clearWillChange(targets)` — remove `will-change` after a tween.

## How to add a new animation
1. Pick the page section in `js/animations.js` (`initHome`, `initPrograms`, `initAbout`, `initPricing`, `initResources`, `initContact`) or `initGlobal()` for all pages.
2. Select existing DOM nodes by class/structure — do not rename or remove existing classes/IDs.
3. Animate only `transform` and `opacity` (plus `clip-path` where noted). Accordion height is the only exception.
4. Wrap scroll-linked reveals in `ScrollTrigger` with `start: TOKENS.scrollStart`, `toggleActions: "play none none none"`.
5. Respect `prefers-reduced-motion` — use `TK` (which resolves to `RM` under reduced motion) so motion is disabled or reduced to a 0.2s opacity fade.

## Accessibility behavior
- `prefers-reduced-motion: reduce` → all movement, parallax, scrubbed line-draw, counters, and idle loops are disabled; only simple 0.2s opacity fades remain (or none).
- Content is never hidden by CSS; GSAP applies the initial hidden state at runtime, so JS failure leaves everything visible.
- Only `transform`, `opacity`, `clip-path`, and (accordion) `max-height` are animated — no `width`/`height`/`top`/`left` layout shifts.
- `will-change` is removed after animations finish.
- Scroll-progress bar is `pointer-events: none`.
- Every animated interactive element keeps a visible focus state; no focus traps.
- Mobile: distances reduced ~40%, hover-only effects removed, heavy scrubbed animations disabled under 768px.
- `ScrollTrigger.refresh()` runs after load; triggers are keyed to the static page lifecycle.

## How to test
Open each file directly (static HTML; no build step):
- `next_move_premium_online_chess_coaching_homepage/code.html` → home
- `coaching_programs_next_move/code.html` → programs
- `about_philosophy_next_move/code.html` → about
- `pricing_booking_next_move/code.html` → pricing & booking
- `next_move_free_chess_resources/code.html` → free resources
- `contact_next_move/code.html` → contact

Check: page load fade, scroll reveals on entering viewport, button/card hovers, scroll-progress bar, masthead shadow after 40px scroll, reduced motion (toggle in OS/DevTools), and keyboard tabbing through forms/FAQ/social buttons.
