# Universe Software Portfolio — App (Vite + React)

## Stack at a glance
- **Runtime**: React 19, Vite 7, TypeScript 5.9
- **Styling**: Tailwind 3 + shadcn/ui (`hsl(var(--*))` tokens) — palette in `src/index.css`
- **Motion**: GSAP 3.15 + `@gsap/react` (timelines, ScrollTrigger) · framer-motion 12 (component lifecycle, springs, variants)
- **3D**: `@react-three/fiber` 9.6 · drei 10.7 · postprocessing 3.0 · three.js 0.184
- **Scroll**: Lenis 1.3 via `SmoothScroller.tsx` — **always use Lenis as the scroll source**, not `window.scrollY` in animation contexts
- **State**: Zustand 5 (`src/store/useAppStore.ts`)
- **Router**: react-router 7.6 — routes in `src/App.tsx`, all lazy-loaded

## Key file map
| Path | Purpose |
|---|---|
| `src/layouts/MainLayout.tsx` | Layout chrome: UniverseCanvas → AtmosphericParticles → HUD → ProbeCursor → GrainOverlay → Navbar |
| `src/lib/pointer.ts` | **Singleton** mousemove listener. Import `pointer` + `bindPointer` — do NOT add a second `mousemove` listener anywhere |
| `src/components/AtmosphericParticles.tsx` | Canvas-2D particle system (3 depth tiers). Reads from `pointer` singleton each rAF frame |
| `src/components/UniverseCanvas.tsx` | R3F scene (planet + stars). Mounted only when `useAppStore.showUniverse` is true |
| `src/components/SmoothScroller.tsx` | Lenis init + ScrollTrigger bridge. If you need Lenis in a page, expose the `lenisRef` or use the `lenis` event bus |
| `src/index.css` | All design tokens. Use `var(--accent)` (#C8F135 lime), `var(--bg-base)`, `var(--ease-out-expo)`, etc. |
| `public/data/projects.json` | 10 projects with `id, title, description, type, link, tags, color` |

## Rules
1. **No new motion libraries.** GSAP handles timelines/scroll; framer-motion handles component variants/springs. Adding Anime.js, Theatre.js, or react-spring creates library fragmentation.
2. **One WebGL context per page.** Never render two `<Canvas>` elements simultaneously. Gallery and UniverseCanvas are mutually exclusive.
3. **No second global mousemove listener.** Use `bindPointer()` from `src/lib/pointer.ts`.
4. **Lenis is the scroll source.** Use `lenis.on('scroll', ...)` or the ScrollTrigger proxy — not `window.addEventListener('scroll', ...)` in motion/animation code.
5. **Compositor-friendly properties only.** Animate `transform`, `opacity`, `clip-path`. Never `width`, `height`, `top`, `left`, `margin`.
6. **`prefers-reduced-motion` is mandatory** for every animation component.

## Known gotchas
- **Vite dev server stuck cache** (R3F files): if a `.tsx` component with R3F returns an empty module (ETag `W/"0-..."`), run `touch src/components/UniverseCanvas.tsx` to bust the cache. Prod build is unaffected.
- **Lenis + ScrollTrigger on sub-pages**: must call `ScrollTrigger.scrollerProxy` + clean up with `ScrollTrigger.kill()` on unmount or triggers accumulate across navigations.
- `tsconfig.tsbuildinfo` is committed — don't delete it; it speeds up incremental type-checks.

## DO NOT
- Install `howler`, `animejs`, `tsparticles`, or any audio library without a spec change
- Modify `UniverseCanvas.tsx` when working on Gallery (separate systems)
- Commit `console.log` statements
- Ship code that fails `node_modules/.bin/vite build`
