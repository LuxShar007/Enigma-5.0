# 📖 Enigma 5.0 — Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Reference](#component-reference)
3. [Design System](#design-system)
4. [Animation System](#animation-system)
5. [Performance Strategy](#performance-strategy)
6. [Star Wars Sequence](#star-wars-sequence)
7. [Registration Flow](#registration-flow)
8. [FAQ Search System](#faq-search-system)
9. [Known Patterns & Gotchas](#known-patterns--gotchas)

---

## Architecture Overview

```
App.jsx (root)
  ├── StarWarsCrawl        ← fixed overlay, z-index 99999 (shown once)
  ├── HyperspaceFlash      ← fixed canvas, z-index 99998 (imperative ref)
  ├── OceanWaveBackground  ← WebGL canvas background
  ├── cyber-grid div       ← CSS dot grid
  ├── ambient-nebula-container (3 drifting orbs)
  ├── Navbar
  └── main
       ├── Hero
       ├── About           (DecryptionTerminal inside)
       ├── Organizers
       ├── Tracks
       ├── CipherStrip     ← GSAP horizontal pinned scroll
       ├── Prizes
       ├── Timeline        (Countdown inside)
       ├── Faq
       └── Contact
```

All GSAP animations are initialised in a single `gsap.context()` inside `App.jsx`'s `useEffect` to ensure proper React StrictMode cleanup via `ctx.revert()`.

---

## Component Reference

### `StarWarsCrawl.jsx`
**State machine phases:** `intro` → `logo` → `crawl` → `exit`

| Phase | Timing | What renders |
|---|---|---|
| intro | 0–2800ms | Blue "A long time ago..." text with fade-in-out |
| logo | 2800–5200ms | ENIGMA 5.0 logo scales in from 2.2× → 1× |
| crawl | 5200–14000ms | Logo shrinks to horizon; yellow perspective text crawl |
| exit | on skip/timeout | 900ms fade-out, then `onComplete()` fires |

**Body scroll lock:** `document.body.style.overflow = 'hidden'` is set on mount and cleared in `finish()`.  
**On complete:** `window.scrollTo(0, 0)` is called before `onComplete` to guarantee the hero is visible.

**Star field:** 3-layer canvas with 460 stars total:
- Layer 0: 300 distant stars (r 0.2–0.8, dim)
- Layer 1: 120 mid-field stars (r 0.5–1.2)
- Layer 2: 40 close stars (r 1.0–2.2) with radial glow halos

---

### `HyperspaceFlash.jsx`
**API:** Imperative via `ref.current.trigger(callback)`.

Renders a fixed canvas at z-index 99998. On `trigger()`:
1. Sets `opacity: 1` on the container
2. Spawns 260 streaks from a central cluster, each with a random angle
3. Over 38 frames (~600ms at 60fps), streaks accelerate outward with `speedMult = 1 + progress * 12`
4. At 75% progress, a white flash fades in `rgba(255,255,255, progress*3.5)`
5. Fades container out, fires `callback` after 80ms

---

### `CipherStrip.jsx`
**GSAP horizontal parallax with `containerAnimation`.**

Key implementation detail: The main tween is stored in a `const tween = gsap.to(track, ...)` variable and passed as `containerAnimation: tween` to per-panel reveal animations. Creating a second independent `gsap.to()` instead would conflict.

Travel distance = `(panels.length - 1) * window.innerWidth` — exact, no rounding errors.

Init is deferred one `requestAnimationFrame` so React has fully painted all panels before GSAP measures `scrollWidth`.

---

### `DecryptionTerminal.jsx`
**Important:** `autoFocus` was intentionally removed from the `<input>` element. It was causing browsers to auto-scroll to the About section on every page load. Focus can still be triggered by clicking the terminal card.

Commands are handled in `handleCommandSubmit`. The `matrix` command renders a `<canvas>` inside the terminal container and starts a `requestAnimationFrame` loop drawing Matrix-style raining characters.

---

### `Countdown.jsx`
Target date is dynamically set to **exactly 24 hours from page load** on component mount:
```js
const [targetDate] = useState(() => {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d;
});
```

Registration bar: `width: 54.75%` (= 1095 ÷ 2000) with `glowPulse` animation.

---

### `RegisterModal.jsx`
**Multi-step gateway flow:**
1. **Gateway selection** — three choices: Direct Terminal (in-site form), Unstop Uplink, DevFolio Uplink
2. **Unstop / DevFolio** — open dummy external links in new tab, modal closes
3. **Direct Terminal** — in-modal form with fields: name, email, college, team size, domain

---

## Design System

All tokens are CSS custom properties defined in `:root` in `index.css`:

```css
--color-bg:       #040408     /* deep space black */
--color-cyan:     #00f2fe
--color-purple:   #9d4edd
--color-emerald:  #05d983
--font-primary:   'Inter', sans-serif
--font-mono:      'Space Mono', monospace
--blur-val:       20px        /* base glass blur */
```

### Glass Card
```css
.glass-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(14px);   /* 14px = perf sweet spot */
  isolation: isolate;
}
```
Shadow is on `::before` pseudo-element so hover doesn't trigger a repaint — only opacity changes.

### Button — Glassmorphism Primary
```css
.btn-primary {
  background: rgba(0,242,254,0.08);
  border: 1px solid rgba(0,242,254,0.35);
  backdrop-filter: blur(16px);
  color: var(--color-cyan);
}
```
Glow halo on `::after` pseudo-element — `opacity: 0 → 1` on hover (zero repaint).

---

## Animation System

### GSAP Context
All GSAP animations in `App.jsx` are wrapped in `gsap.context()`:
```js
const ctx = gsap.context(() => { /* all gsap.from / gsap.to calls */ });
return () => ctx.revert(); // cleanup on unmount
```

### Scroll Reveals
- Section headers: `scrub: 1.2`, `start: 'top 95%'`, `end: 'top 65%'`
- Card stagger reveals: `start: 'top 85%'`, `stagger: 0.15`
- Apple-style word highlights: colour transitions from `rgba(255,255,255,0.15)` to `#fff`

### Spotlight Cards
Mouse coordinates are tracked on `mousemove` per card:
```js
card.style.setProperty('--mouse-x', `${x}px`);
card.style.setProperty('--mouse-y', `${y}px`);
```
The `::before` pseudo-element uses these as a `radial-gradient` center — zero JS paint cost.

---

## Performance Strategy

### 240Hz Optimisation Rules
1. **Only animate `transform` and `opacity`** — never `width`, `height`, `top`, `left`, `box-shadow`, or `filter` inside scroll callbacks
2. **Use pseudo-elements for shadows** — `box-shadow` on a pseudo `::before` with `opacity` transition avoids main-thread painting
3. **`will-change: transform`** on elements animated by GSAP (GSAP sets this automatically, but explicit CSS ensures it for non-GSAP hover animations)
4. **`isolation: isolate`** on glass cards creates new stacking contexts, preventing unintended compositing promotion of parent layers
5. **`backdrop-filter` blur values:**
   - Navbar: 20px
   - Glass cards: 14px (down from 24px)
   - Buttons: 8–16px
   - Ambient orbs: 80px (down from 140px)
6. **Ambient orb animations** slowed to 35–50s duration (from 20–30s) — fewer frames recalculated per second

---

## FAQ Search System

The FAQ uses a `grep -i -F` style inline search bar in the terminal header.

On input change:
1. Filter FAQ items by `question.toLowerCase().includes(query)`
2. Matching items remain visible and auto-expand
3. Non-matching items collapse (`max-height: 0`)
4. If no matches: render `SYS_ERR >> NO LOGS MATCHING QUERY` in red

---

## Known Patterns & Gotchas

| Issue | Root Cause | Fix Applied |
|---|---|---|
| Page loading at About section on startup | `autoFocus` on terminal `<input>` causes browser auto-scroll | Removed `autoFocus`; scroll-to-top + body lock on crawl mount |
| CipherStrip not scrolling horizontally | `containerAnimation` was creating a 2nd conflicting tween | Store main tween in variable, pass reference |
| GSAP measuring wrong width on init | `scrollWidth` measured before React paint | Wrap init in `requestAnimationFrame` |
| Star Wars crawl phases overlapping | Fixed CSS animation delays ignore previous phase completion | Replaced with React state machine (`useState` phase) + `setTimeout` chain |
| Browser restoring scroll position on refresh | Default browser `scroll-restoration: auto` | Set `history.scrollRestoration = 'manual'` in `main.jsx` |
