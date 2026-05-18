# 03 — Motion Polish Pass (Anime.js Intent → GSAP + framer-motion)

> Agent guide. Read top-to-bottom before writing code. This guide deliberately **does not install Anime.js** — see "Why this prompt needs more detail".

---

## Original prompt (verbatim)

> Ask Claude to plan a minimal interactive website with smooth motion
> - Install Anime.js → "npm i animejs"
> - Use Claude to generate timelines, staggered text, and hover animations
> - Add smooth SVG, scroll, and cursor interactions with Anime.js
> - Keep UI minimal so motion becomes the focus
> - Use easing + timing to make animations feel fluid and premium
> Save this 🚀

## Why this prompt needs more detail

The original prompt is a video-tutorial caption. Followed literally, it would degrade this codebase:

1. **The site already has two motion libraries**: GSAP 3.15 (with `@gsap/react`) and framer-motion 12.38. Adding Anime.js makes three. Three motion libraries means three different easing vocabularies, three timeline systems, three bundles. This is a refactor trap that masquerades as a feature.
2. **GSAP covers everything Anime.js promises**: timelines (`gsap.timeline()`), stagger (`stagger: { each, from }`), SVG morph (`MorphSVGPlugin` — paid, but the basic `attr` and `motionPath` cases work without it), hover (declarative or imperative). The "premium feel" comes from easing curves and timing discipline, not from the library brand.
3. **"Keep UI minimal so motion becomes the focus" contradicts the current site.** This portfolio is content-rich: 10 projects, multiple sections, 3D canvas, particles, cursor effects. The right interpretation is "every motion must be motivated and restrained", not "rebuild as a single-page motion demo".
4. **No specifics about WHERE to apply motion.** Without that, an agent will scatter animations across files and the net effect will be busier, not more premium.

This guide reframes the prompt as a **motion polish pass** with a numbered list of concrete refactors using libraries already in the bundle.

---

## Codebase context map

The codebase has 10 sections (`Hero`, `Services`, `Projects`, `FeaturedWork`, `Process`, `Testimonials`, `TechStack`, `Contact`, `DesignNebula`, `WorkShowcase`) and reusable components including `ProjectCard/`, `ServiceCard/`, `ScrollStack/`, `Lanyard/`, `Folder/`, `TiltCard.tsx`, `OrbitImages.tsx`, `HUD.tsx`, `Navbar.tsx`, `PageLoader.tsx`, `PageTransition.tsx`, `SectionHeader.tsx`, `Container.tsx`. Motion is currently provided by two coexisting libraries: GSAP 3.15 + `@gsap/react` 2.1 (for timelines, scroll-driven sequences, complex stagger) and framer-motion 12.38 (for component-level enter/exit, hover/tap variants, layout animations, springs — `ProbeCursor` and route transitions use this). Smooth scroll is `SmoothScroller.tsx` (Lenis 1.3). Cursor is `ProbeCursor.tsx`. The visual design uses a dark base with a lime accent and shadcn-style `hsl(var(--*))` tokens. There is no SVG animation system in place beyond what framer-motion provides per-component. No motion testing exists. The site renders at 60 fps idle on desktop today; this pass must not regress that.

---

## Goal

Audit every interactive surface for motion quality and apply a **prescribed list of refactors** that achieve the "premium, fluid, motion-as-focus" feel the original prompt asks for — using only GSAP and framer-motion that are already installed.

## Non-goals (do NOT do these)

- Do **not** run `npm i animejs`, `motion`, `popmotion`, `theatre.js`, or any new motion lib.
- Do **not** introduce GSAP paid plugins (`MorphSVG`, `SplitText`, `DrawSVG`, `MotionPath`). They are powerful but commercial. This pass stays inside the free GSAP set + framer-motion.
- Do **not** add motion to every element. Every animation must answer "what does this clarify?" Most additions should be removals or reductions of existing motion that is too eager.
- Do **not** rebuild sections from scratch. Refactor in place.
- Do **not** touch the `/gallery` route from guide 02 — it has its own motion system.
- Do **not** rewrite the cursor system unless the refactor in `01-cinematic-particles.md` has already extracted `pointer.ts`.

---

## Stack constraints

| Use | Don't use |
|---|---|
| `gsap.timeline()` for sequences | `setTimeout` chains |
| `gsap` ScrollTrigger for scroll-driven motion | Manual `scroll` listeners |
| `framer-motion` `<motion.*>` for component enter/exit, hover, tap, layout | New animation libraries |
| `framer-motion` `useReducedMotion()` hook | Hardcoded reduced-motion checks per component |
| Native CSS transitions for trivial hovers | JS animation when CSS would suffice |
| `prefers-reduced-motion` | Skipping the reduced-motion check |

**The split rule**: GSAP for timelines and scroll. framer-motion for component lifecycle and gestures. Do not use both for the same animation. Do not import GSAP into a file that only needs a hover scale.

---

## Anchor files (read these first, in order)

1. `app/src/sections/Hero.tsx` (399 lines — the most motion-rich section) — current entry animation, scroll-coupled layers.
2. `app/src/sections/Services.tsx`, `Projects.tsx`, `FeaturedWork.tsx`, `Testimonials.tsx`, `Process.tsx`, `TechStack.tsx` — survey current usage. Note any imports of `gsap`, `framer-motion`, or CSS transitions.
3. `app/src/components/ScrollStack/` — existing scroll-pinned mechanic.
4. `app/src/components/PageTransition.tsx` — route transitions. Confirm framer-motion variants.
5. `app/src/components/SectionHeader.tsx` — most-reused heading; staggered text changes here propagate.
6. `app/src/components/Navbar.tsx`, `HUD.tsx` — chrome motion.
7. `app/src/index.css` — locate easing custom properties if defined; if not, this guide adds them.

---

## Easing + timing vocabulary (add this first, use everywhere)

Premium feel comes from a **small** vocabulary used consistently, not from many custom curves per component. Define these once in `app/src/lib/motion.ts`:

```ts
// Durations (seconds)
export const D = {
  micro: 0.18,   // hover, tap, focus
  short: 0.32,   // small UI in/out
  medium: 0.6,   // section reveals
  long: 1.1,     // hero/orchestrated sequences
  epic: 1.8,     // page transitions
} as const;

// Easings (GSAP string + framer-motion bezier equivalents)
export const E = {
  // primary "expo-out" — the workhorse, most "premium" easings are this family
  out: { gsap: "expo.out", fm: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  // gentle in-out for reversible UI
  inOut: { gsap: "power3.inOut", fm: [0.65, 0, 0.35, 1] as [number, number, number, number] },
  // sharp out for hovers
  sharpOut: { gsap: "power2.out", fm: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  // overshoot for confirmations only (use sparingly)
  back: { gsap: "back.out(1.4)", fm: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
} as const;

// Stagger
export const S = {
  text: 0.04,      // per-word or per-letter
  card: 0.08,      // per-card in a grid
  section: 0.15,   // per-large-block
} as const;
```

CSS counterpart in `index.css`:

```css
:root {
  --d-micro: 0.18s;
  --d-short: 0.32s;
  --d-medium: 0.6s;
  --d-long: 1.1s;
  --e-out: cubic-bezier(0.16, 1, 0.3, 1);
  --e-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --e-sharp-out: cubic-bezier(0.33, 1, 0.68, 1);
}
```

**Rule**: every duration in the codebase from this point forward must reference these tokens. No raw numbers like `transition-duration: 250ms`. The polish pass replaces existing raw values where it touches them; a full sweep is out of scope.

---

## Implementation phases

### Phase 1 — Motion tokens + lint

1. Create `app/src/lib/motion.ts` with the tokens above.
2. Add the CSS custom properties to `app/src/index.css`.
3. Add a one-line comment in `motion.ts` linking to this guide.

**Done when**: importing `D`, `E`, `S` from `lib/motion` works; `var(--e-out)` resolves in DevTools.

### Phase 2 — Hero section motion review

Open `Hero.tsx` (399 lines — the largest motion surface). Apply this checklist:

- [ ] Entrance timeline uses one `gsap.timeline()` with explicit `defaults: { ease: E.out.gsap, duration: D.medium }`.
- [ ] Headline reveal: split by **word** (not letter — letter splits feel showy and cost more), stagger `S.text`, y from `1.5em` to `0`, opacity 0 → 1. Implement with manual word-span splitting (avoid the SplitText paid plugin). One helper in `lib/motion.ts`: `splitWords(node: HTMLElement)`.
- [ ] CTA buttons enter `0.4s` after headline starts, not after it ends — overlap creates polish.
- [ ] Any decorative SVG drawing uses `gsap.fromTo(path, { strokeDashoffset: pathLength }, { strokeDashoffset: 0, duration: D.long, ease: E.out.gsap })`. No paid `DrawSVG`.
- [ ] Scroll-coupled background layers (if present) are throttled to `requestAnimationFrame` and use `transform: translate3d()` only.
- [ ] No element animates `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`. Compositor-friendly properties only.

**Done when**: Hero entrance plays in one orchestrated 1.5–2 second sequence with clear hierarchy (headline → sub → CTA → decoration), no fewer raw `setTimeout` calls than before.

### Phase 3 — Section reveal pattern (the most repeated win)

Audit each section file. Replace ad-hoc "fade in on scroll" wrappers with a single shared component:

`app/src/components/Reveal.tsx`:

```tsx
// Pseudocode shape — implement properly per existing patterns
interface RevealProps {
  children: ReactNode;
  delay?: number;       // multiplier of S.section
  stagger?: number;     // children-stagger override
  from?: "up" | "down" | "left" | "right" | "fade";
  amount?: number;      // intersection threshold, default 0.25
}
```

Behavior:
- Uses framer-motion's `whileInView` with `viewport={{ once: true, amount }}`.
- Default `from: "up"`, 24px translate, 0 → 1 opacity, ease `E.out.fm`, duration `D.medium`.
- If `useReducedMotion()` returns true, instantly fade in with no transform.
- If children is a fragment or list, stagger children via parent variants.

Apply `<Reveal>` consistently to: each `SectionHeader` instance, each `ProjectCard`, each `ServiceCard`, each testimonial block, each process step. Remove any existing one-off reveal implementations in those sections.

**Done when**: every section reveals on scroll with the same visual cadence; no duplicate intersection-observer logic remains in section files.

### Phase 4 — Hover + focus states

The biggest perceived-quality lift, smallest code surface. For every interactive element (`<button>`, `<a>`, `<ProjectCard>`, `<ServiceCard>`, nav links, CTAs):

- Hover: CSS transition `transform var(--d-micro) var(--e-sharp-out), background-color var(--d-short) var(--e-sharp-out)`. Translate Y ≤ -2px, or scale ≤ 1.02. No layout-shifting hovers.
- Focus-visible: identical visual to hover **plus** a `outline: 2px solid hsl(var(--ring))` `outline-offset: 3px`. Never `outline: none` without a replacement.
- Active: scale down to 0.98 within `--d-micro`. Confirms the tap.
- Cards: lift (translate Y -4px) + scale 1.01 + shadow elevation, never tilt unless `TiltCard.tsx` is explicitly opted into.

Do these in CSS, not JS. JS-driven hover is a code smell here.

**Done when**: every interactive element has a hover/focus/active distinction; tabbing through the page is visually pleasant; no `outline: 0` rules without a replacement.

### Phase 5 — Page transitions

Inspect `PageTransition.tsx`. Confirm it uses framer-motion `<AnimatePresence mode="wait">` with a single variant per route. If not, refactor:

- Exit: fade to 0 opacity + 8px down, `D.short`, `E.inOut.fm`.
- Enter: fade in from 0 + 8px up, `D.medium`, `E.out.fm`, slight delay (`0.05s`) so exit completes cleanly.
- Reduced motion: opacity only, durations halved.

**Done when**: route navigation shows a clean crossfade with no flash of unstyled chrome and no layout jump.

### Phase 6 — Cursor + scroll polish

This phase only edits if both prior guides (01 + 02) are not blocking it.

- `ProbeCursor`: confirm spring config produces a slight lag (`stiffness: 300, damping: 20, mass: 0.5` already in place). Add a subtle scale change on `:hover` over interactive elements — implement via `useEffect` reading `:hover` on `[data-cursor="zoom"]` opt-in, not by globally observing every hover.
- Lenis: confirm `duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3)` (or equivalent expo-out). If different, align with `E.out.fm`.

**Done when**: cursor feels heavy in a good way; scrolling has the same easing character as section reveals.

### Phase 7 — SVG smoothness

Inventory SVGs in the codebase (process icons, logos, decorative marks). For each that has motion:

- Use stroke-dash animation via GSAP (already shown in Phase 2 spec).
- Use CSS `transition: stroke-dashoffset var(--d-long) var(--e-out)` for hover-triggered draws.
- Do **not** animate SVG transforms via `attr` plugins — use the `transform-box: fill-box; transform-origin: center` CSS pattern instead.

**Done when**: any animated SVG draws or shifts feel intentional, not loop-y. No SVG ever animates `width`/`height` attributes.

### Phase 8 — Audit pass: motion debt

Run a grep for known smells and resolve each:

```bash
# Raw transition durations not using tokens
rg "transition-duration:\s*[0-9]" app/src
rg "transition:\s+[a-z-]+\s+[0-9]" app/src

# setTimeout used for animation sequencing
rg "setTimeout" app/src/sections app/src/components

# framer-motion duration as a raw number
rg "duration:\s*[0-9]+(\.[0-9]+)?" app/src --type tsx

# GSAP timelines without defaults
rg "gsap\.timeline\(\)" app/src
```

Replace each hit with the token or refactor.

**Done when**: each grep returns either no results, or only results that are intentionally not yet refactored (with a `// TODO(motion-polish):` comment naming this guide).

---

## Visual acceptance spec

A reviewer should be able to confirm **all** in a single sweep through the home page:

- [ ] Every section reveal feels like the same family of motion — same ease, same approximate duration, same stagger rhythm.
- [ ] Hero entrance has clear narrative (headline → sub → CTA → decoration), all within ~2 seconds.
- [ ] Hovering any card lifts it slightly and consistently across card types.
- [ ] Tabbing through the page is pleasant — every focused element is visibly focused with a ring, never with a default browser outline alone.
- [ ] Navigating between routes is a smooth crossfade.
- [ ] Cursor lag is present but not annoying; cursor never blocks clicks.
- [ ] Smooth scroll feels weighty but never sluggish.
- [ ] No element shifts layout during motion (CLS = 0 during animation).
- [ ] With `prefers-reduced-motion: reduce`, all transforms are removed; opacity-only fades remain at reduced durations.

---

## Performance budget

| Metric | Target |
|---|---|
| Bundle delta | ≤2 KB gzipped (this is mostly a refactor) |
| INP | ≤200 ms on interaction |
| FPS during section reveal | ≥58 |
| FPS during page transition | ≥55 |
| Long tasks during entrance | ≤1, ≤50 ms |

If a single section reveal causes a long task, the stagger is too dense — increase per-item duration and decrease item count, do not just shorten.

---

## Accessibility

- `prefers-reduced-motion` is honored everywhere (the shared `<Reveal>` component handles most of this).
- Focus-visible styles are added to every interactive element. No exceptions.
- No motion conveys information that is not also conveyed by content. A user who saw a static screenshot would still understand the page.
- Auto-playing motion (Hero entrance) must complete within 2 seconds. Beyond that triggers WCAG 2.2.2 (Pause/Stop/Hide).

---

## Out of scope (explicit)

- Anime.js installation — see "Why this prompt needs more detail".
- GSAP paid plugins.
- Audio.
- The `/gallery` route (covered by guide 02).
- The particle layer (covered by guide 01).
- New 3D effects.
- A "minimalist redesign" of the site — the site is content-rich, this pass polishes motion within current structure.

---

## Acceptance checklist (agent must tick all)

- [ ] `app/src/lib/motion.ts` created with `D`, `E`, `S` exports
- [ ] CSS custom properties for durations and easings added to `index.css`
- [ ] Shared `<Reveal>` component created and applied to every section
- [ ] Hero entrance refactored to a single `gsap.timeline()` with token-driven defaults
- [ ] Every interactive element has hover + focus-visible + active states
- [ ] `PageTransition` aligned with token vocabulary
- [ ] All grep audits in Phase 8 either pass or have explicit TODO comments
- [ ] Zero new motion dependencies in `package.json`
- [ ] No GSAP paid plugins added
- [ ] `prefers-reduced-motion` paths verified for Hero, Reveal, PageTransition
- [ ] FPS, INP, bundle size all within budget
- [ ] No `console.log` left behind
- [ ] `npm run build` succeeds

---

## Definition of done

A user lands on the home page, scrolls through every section, hovers a few cards, navigates to another route, and back. At no point does any motion feel "off" — too fast, too slow, too eager, too sudden, or stylistically out of place with the rest. They cannot articulate what changed, but the site feels more expensive than before. That is the polish.
