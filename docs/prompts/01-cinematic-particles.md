# 01 — Cinematic Particles (Atmospheric Background Layer)

> Agent guide. Read top-to-bottom before writing code. Do **not** skip the "Anchor files" section.

---

## Original prompt (verbatim)

> "add cinematic particles floating smoothly through the scene for atmosphere and depth"
> - Use particles as background motion, not the main focus
> - Add slow floating movement with random direction + opacity changes
> - Create depth by using different particle sizes + speeds
> - Connect particles subtly to cursor movement and scroll

## Why this prompt needs more detail

The original is vibe-level. Three things it leaves dangerous:

1. **This codebase already has particles.** `app/src/components/Starfield.tsx` is a 162-line canvas-2D starfield with layer-based parallax, scroll coupling, and reduced-motion handling. An agent reading the prompt blind will create a *second* particle system that conflicts, double-renders, or competes for the same compositor layer.
2. **"Cursor + scroll connection" is already half-built.** `ProbeCursor.tsx` owns a global `mousemove` listener (springs, 5 trailing particles). `SmoothScroller.tsx` owns Lenis scroll. Particles must subscribe to those, not install fresh listeners.
3. **"Depth" is unspecified.** Without numeric tiers (count per layer, parallax factor, opacity range, size range), the result will look uniform and the prompt's promise of depth fails.

This guide makes those three things explicit.

---

## Codebase context map

The site is a React 19 + Vite + TypeScript portfolio with a layered visual stack already in place: `MainLayout.tsx` mounts (in z-order) `UniverseCanvas` (R3F space scene, behind), `HUD`, `ProbeCursor`, `GrainOverlay`, then `Navbar` and the page `<main>`. `Starfield.tsx` is a self-contained `<canvas>` component that draws 150–800 stars across 1–3 parallax layers, reacts to scroll (`scrollPos.y`) and mouse position (`mousePos`), respects `prefers-reduced-motion`, and resizes with the window. Smooth scroll is provided by `SmoothScroller.tsx` (Lenis 1.3); cursor state by `ProbeCursor.tsx` (framer-motion springs). Tailwind tokens follow the `hsl(var(--*))` shadcn convention, and the project palette already includes a "lime" accent (referenced in `Starfield`'s `isLime` flag). No particle/atmosphere library is installed and none should be added.

---

## Goal

Promote the existing `Starfield` from "twinkling stars" to **cinematic atmospheric particles** — slow-drifting dust/embers/motes layered for depth, with subtle cursor attraction and scroll-coupled flow. The component stays background-only and never steals focus.

## Non-goals (do NOT do these)

- Do **not** create a new component (`Particles.tsx`, `Dust.tsx`, etc.). Refactor `Starfield.tsx` in place. Rename to `AtmosphericParticles.tsx` only if downstream imports are updated in the same commit.
- Do **not** install any library (no `tsparticles`, no `particles.js`, no `three`-based replacement — `UniverseCanvas` already owns R3F). Pure canvas-2D only.
- Do **not** add a second global `mousemove` or `scroll` listener. Subscribe to the existing sources (see "Wiring" below).
- Do **not** animate via React state or `requestAnimationFrame` inside a hook with deps — keep the rAF loop inside `useEffect` like the current file does.
- Do **not** ship to mobile at desktop density. Honor the existing `getConfig()` breakpoints.

---

## Stack constraints

| Allowed (already installed) | Banned |
|---|---|
| Native `<canvas>` 2D | `tsparticles`, `particles.js`, three.js particles (R3F is reserved for `UniverseCanvas`) |
| `requestAnimationFrame` | `setInterval` for motion |
| `prefers-reduced-motion` media query | New global event listeners (reuse existing) |
| Existing `useAppStore` (zustand) for cursor/scroll if exposed | New zustand slices for particles |

---

## Anchor files (read these first, in order)

1. `app/src/components/Starfield.tsx` — current implementation. The full 162 lines. This is what you are refactoring.
2. `app/src/components/ProbeCursor.tsx` lines 1–45 — pattern for cursor listener + spring decay. Do not duplicate the listener; expose cursor position via a shared module if needed.
3. `app/src/components/SmoothScroller.tsx` — Lenis integration. Confirms scroll source.
4. `app/src/layouts/MainLayout.tsx` — where `Starfield` is (or should be) mounted. If it is not currently mounted (check `App.tsx` and routes), wire it behind `UniverseCanvas` (z-index lower than HUD/ProbeCursor/GrainOverlay, higher than the body background).
5. `app/src/index.css` — locate the existing CSS custom-property tokens for accent / lime / background. Particle color must reference these, not hardcoded hex.

---

## Implementation phases

Each phase has a single deliverable and a "done when" check. Do them in order; do not merge phases.

### Phase 1 — Particle data model: depth tiers

Replace the current `Star` interface with a `Particle` interface that encodes depth as a first-class dimension.

```ts
interface Particle {
  x: number;
  y: number;
  baseOpacity: number;     // 0..1 starting opacity
  opacity: number;         // 0..1 current opacity (drifts)
  opacityPhase: number;    // 0..2π, phase offset for sine drift
  opacitySpeed: number;    // rad/s for opacity oscillation
  size: number;            // px, derived from tier
  vx: number;              // px/s drift velocity
  vy: number;              // px/s drift velocity
  tier: 0 | 1 | 2;         // 0 = far (small, slow, faint), 2 = near (large, fast, brighter)
  isAccent: boolean;       // ~1% chance, uses --accent color
}
```

**Tier specs** (use these exact numbers; do not "tune by feel"):

| Tier | Size (px) | Drift speed (px/s) | Base opacity range | Parallax factor (scroll) | Cursor attraction radius (px) | Cursor pull strength |
|---|---|---|---|---|---|---|
| 0 (far)   | 0.6–1.2 | 2–6   | 0.15–0.35 | 0.05 | 0   | 0   |
| 1 (mid)   | 1.0–2.0 | 6–14  | 0.30–0.55 | 0.20 | 120 | 0.3 |
| 2 (near)  | 1.8–3.2 | 12–24 | 0.45–0.75 | 0.50 | 200 | 0.8 |

**Count budget by breakpoint** (replaces existing `getConfig`):

| Breakpoint | Total | Tier 0 / 1 / 2 |
|---|---|---|
| ≥1440px | 600 | 360 / 180 / 60 |
| ≥1024px | 400 | 240 / 120 / 40 |
| ≥768px  | 220 | 140 / 60 / 20  |
| <768px  | 90  | 60 / 25 / 5    |

Lower than the current 800 max because depth + drift + opacity oscillation costs more per frame than static twinkle.

**Done when**: `generateParticles()` produces arrays matching the table above; tier distribution verified by a one-time `console.log` (remove before commit).

### Phase 2 — Drift motion (the "floating" part)

Replace the current static draw with per-frame integration.

- Each particle moves by `(vx * dt, vy * dt)` per frame. `dt` clamped to `[0, 1/30]` seconds to avoid jumps when the tab regains focus.
- Drift direction is random at spawn and re-randomized when a particle exits the viewport (wrap-around with a fresh `vx`/`vy`).
- Opacity oscillates: `opacity = baseOpacity + 0.15 * sin(t * opacitySpeed + opacityPhase)`. `opacitySpeed` ∈ [0.3, 0.9] rad/s. The aggregate effect should be slow shimmer, not strobe.
- Use `performance.now()` for `t`; track `lastFrameTime` to compute `dt`.

**Done when**: with cursor and scroll motionless, particles visibly drift; opacity changes are perceptible but no individual particle ever flashes hard.

### Phase 3 — Scroll coupling (reuse Lenis, do not add listeners)

The current file uses `window.scroll` listener at `Starfield.tsx:~75` (verify). Replace with Lenis subscription if available, otherwise keep the passive `scroll` listener but verify it is `{ passive: true }`.

- Each tier's vertical offset on draw is `-(scrollVelocity * parallaxFactor)` where `scrollVelocity` is recent scroll delta (smoothed over ~100ms) — NOT absolute scroll position. The effect is "particles drag behind the scroll motion" rather than "particles teleport to follow the page".
- Smoothing: keep an EMA of scroll delta with α = 0.15.

**Done when**: scrolling fast makes near-tier particles streak briefly; far-tier particles barely react; idle scroll returns particles to neutral drift.

### Phase 4 — Cursor attraction (reuse, do not duplicate listener)

Add a tiny shared module `app/src/lib/pointer.ts` exporting:

```ts
export const pointer = { x: 0, y: 0, active: false };
export function bindPointer(): () => void; // attaches listener, returns unbind
```

`ProbeCursor.tsx` must be refactored to call `bindPointer()` once and read `pointer` for its own springs. `Starfield` (now `AtmosphericParticles`) reads `pointer` each frame. **Net listener count: same as today.**

Per-frame per-particle:
- If `pointer.active` and distance to pointer < tier radius, apply a soft acceleration toward the pointer scaled by `tier pull strength`. Cap added velocity so particles never exceed 3× their base speed.
- The attraction is not magnetic — it biases drift direction, never snaps.

**Done when**: moving the cursor slowly through dense particles produces a faint visible "current"; stopping the cursor lets drift resume naturally; near-tier particles respond more than far-tier.

### Phase 5 — Reduced motion + perf gate

- `prefers-reduced-motion: reduce` → skip drift and cursor attraction entirely. Particles render at fixed positions with the existing slow opacity oscillation only (`opacitySpeed` clamped to 0.2). No scroll coupling.
- Add a one-time check in `useEffect`: if `navigator.hardwareConcurrency <= 4` **and** viewport width ≥ 1024, downgrade count by 40% and disable tier-2 cursor attraction. Document this in a single-line comment.
- Pause the rAF loop when `document.hidden` is true; resume on `visibilitychange`.

**Done when**: DevTools "Rendering → Emulate CSS media feature prefers-reduced-motion" toggle visibly stills the drift but keeps faint twinkle; tab-switching for 30s and returning does not produce a jump.

---

## Wiring

`MainLayout.tsx` mount order (z stack, back to front):

```
<SmoothScroller>
  {showUniverse && <UniverseCanvas />}    // z: 0
  <AtmosphericParticles />                 // z: 1   ← this guide
  <HUD />                                  // z: 5
  <ProbeCursor />                          // z: 50
  <GrainOverlay />                         // z: 60
  <Navbar />                               // z: 40
  <main>...</main>                         // z: 10
</SmoothScroller>
```

The component itself sets `position: fixed; inset: 0; pointer-events: none; z-index: 1;` on its canvas.

---

## Visual acceptance spec

A reviewer (or you, after building) should be able to confirm **all** of these by eye, on a 1440px viewport, in 10 seconds:

- [ ] Three distinct depth tiers visible without squinting (size + brightness contrast).
- [ ] Far-tier particles look stationary at a glance but move on a 5-second stare.
- [ ] Near-tier particles drift noticeably but not distractingly.
- [ ] Opacity shimmer is a wave, not a flicker — no particle "blinks".
- [ ] Scrolling fast produces a subtle directional smear in the near tier.
- [ ] Moving the cursor across a dense area produces a faint trail-like bias.
- [ ] Roughly 1 in 100 particles is the accent color (lime), not white.
- [ ] No particle is ever above content (text remains the focal element).

---

## Performance budget

| Metric | Target | How to measure |
|---|---|---|
| Frame time (idle, desktop) | ≤4 ms for particle work | Chrome Performance panel, "Recalculate Style" + "Paint" combined on canvas |
| Frame time (scrolling) | ≤6 ms | Same, while scrolling |
| Sustained FPS | 60 desktop / 60 tablet / 30 mobile minimum | Chrome FPS meter |
| Bundle delta | 0 KB gzipped | This is a refactor, not an addition |
| Memory | <8 MB retained by component | Chrome Memory snapshot |

If frame time exceeds budget, reduce counts in the table above by 25% across all tiers and rerun. Do not optimize by removing depth — depth is the feature.

---

## Accessibility

- `aria-hidden="true"` on the canvas element.
- Honor `prefers-reduced-motion` as specified in Phase 5.
- Never raise CLS — canvas is `position: fixed`, never affects layout.
- Color contrast is irrelevant (decorative), but ensure no particle approaches text legibility threshold by capping opacity at 0.75.

---

## Out of scope (do NOT do as part of this work)

- Do not modify `UniverseCanvas.tsx` (R3F scene). Different system, different layer.
- Do not change `ProbeCursor` behavior beyond extracting the `pointer` module.
- Do not touch sections (`Hero`, `Projects`, etc.) — particles are layout-independent.
- Do not add a toggle in `useAppStore` to disable particles. The reduced-motion gate is the only switch.
- Do not write tests for canvas rendering. Visual regression is out of scope for this prompt.

---

## Acceptance checklist (agent must tick all)

- [ ] Single component file refactored, no new components added
- [ ] Zero new npm dependencies (`git diff app/package.json` is empty)
- [ ] Tier counts match the breakpoint table
- [ ] Tier visual parameters match the spec table
- [ ] Shared `pointer.ts` module created; `ProbeCursor` refactored to use it; net global listeners unchanged
- [ ] Scroll coupling reads existing scroll source (no new `scroll` listener)
- [ ] `prefers-reduced-motion` reduces motion as specified
- [ ] `document.hidden` pauses the rAF loop
- [ ] All 8 visual acceptance items confirmed in browser
- [ ] FPS stays ≥60 on a 1440px viewport with cursor and scroll active
- [ ] `npm run build` succeeds and bundle size delta ≤2 KB gzipped (allow rounding)
- [ ] No `console.log` left behind

---

## Definition of done

The home page, with this work shipped, should feel **deeper** than it does today — like text is floating in front of weather, not in front of a screensaver. A user who scrolls the home page once should notice atmosphere without being able to name what changed.
