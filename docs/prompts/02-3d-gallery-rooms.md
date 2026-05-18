# 02 — 3D Gallery: Per-Room Showcase with Scroll-Driven Camera

> Agent guide. Read top-to-bottom before writing code. This guide intentionally **drops Howler.js** — see "Why this prompt needs more detail".

---

## Original prompt (verbatim)

> "Build a 3D gallery where each room showcases one product with its own lighting and atmosphere"
> - Use Three.js to render each alcove as an individual WebGL
> - Use Howler.js to manage the soundscape per scene transition
> - Use GSAP with ScrollTrigger to control the camera path on scroll
> - Save this if you want the exact stack Cartier paid an agency $500k to build 🏆

## Why this prompt needs more detail

The original prompt mixes a real architecture idea ("scroll-driven camera through rooms") with implementation choices that fight this codebase:

1. **"Each alcove as an individual WebGL"** is wrong for a portfolio. Spinning up N WebGL contexts kills mobile and most laptops (browsers cap at 8–16 concurrent contexts and warn at 4). The right architecture is **one R3F canvas, multiple rooms as scene groups**, with the camera traversing between them on scroll. This guide enforces that.
2. **Howler.js for "soundscape per transition"** is out of scope for a marketing portfolio with no music brief, adds ~25 KB gzipped, and creates an autoplay-policy minefield. Dropped from this guide. If audio is desired later, add as a separate `phase-audio.md` spec — do not let it block the visual work.
3. **GSAP ScrollTrigger** is the right call and already installed. The repo also has Lenis smooth scroll; ScrollTrigger must be configured to read Lenis's virtual scroll, not native scroll, or the camera path will desync.
4. **"$500k Cartier" framing** is marketing copy. Ignore it. The success criterion is "looks intentional and runs at 60 fps on a 2020 MacBook", not "matches a specific agency's output".

This guide replaces the prompt with a buildable spec.

---

## Codebase context map

The project already uses `@react-three/fiber` 9.6, `@react-three/drei` 10.7, `@react-three/postprocessing` 3.0, `@react-three/rapier` 2.2 (physics — not needed here), and three.js 0.184 — `UniverseCanvas.tsx` is a working R3F mount that proves the dev-server pipeline (with a known stuck-cache gotcha; see `MEMORY.md` if encountered). GSAP 3.15 with `@gsap/react` 2.1 is installed (ScrollTrigger is part of the `gsap` umbrella import). Smooth scroll is provided by `SmoothScroller.tsx` using Lenis 1.3, mounted at the layout level. Routing uses `react-router` 7.6 with routes declared in `App.tsx`. The site currently has no `/gallery` route — this guide adds one. Project data lives in `app/public/data/projects.json` (10 entries; structure already used by `sections/Projects.tsx` and `ProjectCard/`). Tailwind tokens use the `hsl(var(--*))` shadcn convention; the project palette has a "lime" accent. No audio library is installed; none is added by this guide.

---

## Goal

Add a route `/gallery` that scrolls a virtual camera through N "rooms" in a single R3F canvas. Each room presents one project from `projects.json` with its own lighting, fog/atmosphere, and post-processing accent. Scroll progress (Lenis-driven, ScrollTrigger-bound) maps 1:1 to camera position along a curved path.

## Non-goals (do NOT do these)

- Do **not** install `howler`, `tone`, or any audio library.
- Do **not** create one `<Canvas>` per room. One canvas total.
- Do **not** preload all GLB/HDR assets eagerly. Each room loads on approach.
- Do **not** use `@react-three/rapier` here. No physics in this scene.
- Do **not** modify the home page or any existing section. New route only.
- Do **not** replace `UniverseCanvas` or share its mount.
- Do **not** ship without a fallback for users on `prefers-reduced-motion` or WebGL-disabled browsers.

---

## Stack constraints

| Allowed (already installed) | Banned |
|---|---|
| `@react-three/fiber`, `drei`, `postprocessing` | `howler`, `tone`, any audio dep |
| `gsap` + `ScrollTrigger` (umbrella import) | A second R3F canvas in the tree |
| `lenis` (via existing `SmoothScroller`) | `react-spring`, `theatre.js`, new motion libs |
| `react-router` `<Route>` | Inline GLB data URLs (use `/public/models/`) |

---

## Anchor files (read these first, in order)

1. `app/src/components/UniverseCanvas.tsx` — full file. Existing R3F setup, GLB preload pattern, fog/lighting reference.
2. `app/src/App.tsx` — routing convention; where to add `<Route path="/gallery">`.
3. `app/src/layouts/MainLayout.tsx` — confirms layout chrome wraps every page (Navbar, ProbeCursor, GrainOverlay). The gallery should sit inside this chrome but visually dominate.
4. `app/src/components/SmoothScroller.tsx` — Lenis instance. Must expose it (or import the singleton) so ScrollTrigger's scroller proxy can read its virtual scroll. If not currently exposed, refactor in the same commit.
5. `app/public/data/projects.json` — source of room content (title, description, link, type).
6. `app/src/sections/Projects.tsx` and `app/src/components/ProjectCard/` — how project data is currently rendered. Reuse the data shape, not the components.

---

## Architecture

```
/gallery (route)
└── <GalleryPage>                           // app/src/pages/Gallery.tsx
    ├── <ScrollProxy>                       // tall sentinel element that ScrollTrigger measures
    │     height: rooms.length * 100vh
    ├── <Canvas> (fixed, full-viewport)     // single R3F canvas
    │   ├── <CameraRig>                     // useFrame reads progress, sets camera pose
    │   ├── <Room idx={0} project={...}>    // each room is a <group> at known world position
    │   ├── <Room idx={1} ...>
    │   ├── ...
    │   ├── <SceneAtmosphere>               // global fog + ambient, modulated by active room
    │   └── <EffectComposer>                // bloom + vignette, intensity per-room
    └── <RoomHUD>                           // 2D overlay: project title, index, "scroll to continue"
```

Key invariants:
- The visible canvas is `position: fixed; inset: 0`. The scroll height comes entirely from `<ScrollProxy>`.
- Scroll progress 0..1 is the **only** state input to camera and atmosphere. Everything derives from it.
- Rooms exist as static `<group>` nodes at fixed world positions — they are not mounted/unmounted on scroll. Mount/unmount is too expensive and visually breaks fog continuity.

---

## Implementation phases

### Phase 1 — Route + scaffold + Lenis ↔ ScrollTrigger bridge

Create `app/src/pages/Gallery.tsx` and register `<Route path="/gallery" element={<Gallery />} />` in `App.tsx`. Inside the page, render the scroll sentinel and a placeholder full-screen `<Canvas>` with an `<OrbitControls />` (drei) just to confirm WebGL mounts under your layout chrome.

Then wire Lenis to ScrollTrigger:

```ts
// At Gallery mount, after Lenis is available
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length && value !== undefined) lenis.scrollTo(value, { immediate: true });
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});
lenis.on("scroll", ScrollTrigger.update);
ScrollTrigger.defaults({ scroller: document.body });
```

Clean up on unmount: `ScrollTrigger.kill()`, remove the Lenis listener, restore defaults. Without cleanup, navigating away from `/gallery` and back will register duplicate triggers.

**Done when**: scrolling the `/gallery` page logs `ScrollTrigger.update` calls in DevTools and a placeholder cube rotates on scroll progress.

### Phase 2 — Camera path + progress

Replace `<OrbitControls />` with a `<CameraRig>` component that:

- Receives a single `progress` value (0..1, scroll-driven, smoothed by Lenis already).
- Computes camera position from a `THREE.CatmullRomCurve3` defined by `rooms.length + 1` control points (one before room 0, one between each pair, one after the last).
- Aims `camera.lookAt(targetCurve.getPoint(progress + lookAheadOffset))` where `lookAheadOffset` is ~0.04 of total progress, clamped.
- Uses `useFrame` to apply pose every frame.

Document the curve in a comment with a small ASCII diagram showing the layout (rooms spaced ~12 world units apart along Z, slight Y rise per room for visual rhythm).

**Done when**: scrolling smoothly glides past placeholder cubes labeled 0..N at distinct world positions.

### Phase 3 — Room component

`<Room>` accepts `{ idx, project, worldPosition, accentHsl }` and renders:

- A **stage**: a soft circular plinth (drei `<RoundedBox>` or a low-poly disc) at `worldPosition`.
- A **subject placeholder**: a high-poly primitive (`<Icosahedron>` / `<TorusKnot>`) until real GLBs are sourced. Real GLBs are an out-of-scope follow-up.
- **Per-room lighting**: one `<spotLight>` aimed at the subject with `color={accentHsl}`, plus a low ambient. Spot intensity 1.5–2.5, distance ~10, penumbra 0.5.
- **Per-room fog band**: NOT real fog (one fog per scene). Instead a translucent `<mesh>` "atmosphere shell" — a back-facing sphere around the room with `MeshBasicMaterial({ transparent, opacity: 0.06, color: accentHsl })`. The shell colors the room's air without affecting other rooms.

**Color palette** (use the project's accent tokens, derive per-room shifts in HSL space):

| Room idx | Accent role | HSL hint |
|---|---|---|
| 0 | Lime (brand accent) | `hsl(75, 95%, 60%)` |
| 1 | Cyan | `hsl(190, 80%, 60%)` |
| 2 | Magenta | `hsl(320, 75%, 65%)` |
| 3 | Amber | `hsl(35, 90%, 60%)` |
| 4 | Violet | `hsl(265, 70%, 65%)` |
| 5+ | Cycle through above | — |

Define this as a constant `ROOM_PALETTE` in the gallery module. Do not hardcode hex.

**Done when**: each room has a visibly distinct color signature and lighting feel from at least 8 world units away.

### Phase 4 — Atmosphere blending between rooms

The scene-level fog and `EffectComposer` bloom intensity are interpolated based on which room the camera is currently nearest:

- Compute `currentRoomFloat = progress * (rooms.length - 1)` — e.g. 1.7 means "70% through the transition from room 1 to room 2".
- `activeRoom = Math.round(currentRoomFloat)` for HUD title; `blend = currentRoomFloat - activeRoom` for atmosphere.
- Interpolate fog color, fog density, and bloom intensity between the two adjacent rooms' palettes using `blend`.
- Bloom intensity 0.4 (calm rooms) to 1.1 (showcase rooms). Vignette darkness 0.35 throughout. Chromatic aberration optional, max 0.0015.

**Done when**: the scene's overall hue and glow shift continuously during scroll — at no point does the atmosphere "snap" between rooms.

### Phase 5 — HUD overlay + project content

2D overlay (`position: fixed; pointer-events: none` except for the link), shows for the active room:

- Project title (large, accent color, fades in/out on room transition via opacity tied to `1 - |blend|`).
- One-line description.
- Index `01 / N` styled like a gallery placard.
- "View live" / "View Figma" link (CTA — pointer-events: auto for this element only). Uses project data from `projects.json`.
- A bottom-center "scroll" hint that hides after the first scroll input.

Text uses existing site typography tokens from `index.css`. Do not introduce a new font weight.

**Done when**: HUD updates room-to-room without flicker; CTA is the only clickable element; on the last room, CTA reads "Back to home" linking to `/`.

### Phase 6 — Lazy load room assets

For the placeholder primitive era this is trivial. When real GLBs are added later:

- Use drei `useGLTF` with the `useGLTF.preload(path)` pattern called inside a `<Suspense>` boundary scoped to that room.
- A room's GLB preloads when `currentRoomFloat` enters `[idx - 1.5, idx + 1.5]`. Use an effect on `activeRoom` to trigger preload of `activeRoom ± 1`.
- Show a per-room loading placeholder (small wireframe of the subject's bounding box) while loading.

**Done when**: navigating directly to `/gallery` does not block on more than the first room's assets; subsequent rooms' models appear before the camera arrives.

### Phase 7 — Fallbacks

- **`prefers-reduced-motion`**: scroll-driven camera disabled. Replace with a vertical list of room cards (reuse the HUD content + a static gradient swatch using each room's accent). Document this in a single comment.
- **WebGL unavailable**: detect via `useEffect` probing `document.createElement('canvas').getContext('webgl2')`. If null, render the same card-list fallback.
- **Mobile (< 768px)**: render the card-list fallback by default. The 3D experience is desktop/tablet-only. This is a deliberate scope cut, not a TODO.

**Done when**: emulating reduced-motion in DevTools or visiting on a phone shows the card list, not a black canvas.

---

## Performance budget

| Metric | Target | Notes |
|---|---|---|
| TTI on `/gallery` | <2.5 s on a fast 4G simulated connection | First room ready |
| Sustained FPS | 60 desktop, 30 tablet | Measured mid-scroll |
| Draw calls per frame | <120 | Drei stats helper during dev only |
| WebGL contexts | 1 | Hard limit |
| Bundle delta | ≤80 KB gzipped for gallery route (lazy-loaded via React.lazy) | Excludes GLB assets |
| Memory | <120 MB GPU memory steady-state | Chrome `chrome://gpu` |

If exceeded: reduce post-processing (drop chromatic aberration first, then vignette intensity, then bloom radius — never bloom intensity).

---

## Accessibility

- The route must have a `<h1>` even when rendering the canvas-dominant view. Visually hidden if needed (`sr-only` Tailwind class).
- HUD title updates as the active room changes; announce via `aria-live="polite"` on the title element.
- All CTAs are real `<a href>` elements, not click-handler `<div>`s.
- Keyboard: pressing Space/PageDown advances Lenis scroll by one room's worth (ScrollTrigger reads the result naturally). No custom key handling beyond this needed.
- `prefers-reduced-motion` fallback as Phase 7.

---

## Out of scope (explicit)

- Audio / Howler.js (separate future spec if needed).
- Real GLB product models (placeholder primitives are sufficient for this PR; sourcing assets is its own task).
- Authenticated content gating.
- Sharing the gallery R3F canvas with `UniverseCanvas`.
- Mobile 3D support.

---

## Acceptance checklist (agent must tick all)

- [ ] `/gallery` route registered in `app/src/App.tsx`
- [ ] Single `<Canvas>` in the route — verified via React DevTools
- [ ] Lenis ↔ ScrollTrigger bridge installed and torn down on unmount
- [ ] Navigating away from `/gallery` and back does not double-register triggers (check `ScrollTrigger.getAll().length`)
- [ ] Camera follows a `CatmullRomCurve3`, not linear interpolation
- [ ] Each room has distinct lighting, accent color, and atmosphere shell per `ROOM_PALETTE`
- [ ] Atmosphere blends continuously across room boundaries
- [ ] HUD updates with `aria-live="polite"`
- [ ] Reduced-motion + mobile + no-WebGL all fall back to the card list
- [ ] Bundle for the gallery route is lazy-loaded (`React.lazy` + `Suspense` in `App.tsx`)
- [ ] FPS ≥60 on desktop while scrolling
- [ ] No new audio dependency
- [ ] No `console.log` left behind
- [ ] `npm run build` succeeds; bundle delta within budget

---

## Definition of done

A reviewer visits `/gallery`, scrolls top to bottom in 10 seconds, and feels like they walked through a series of distinct visual environments — not flipped through slides. The camera never stutters. The atmosphere never snaps. Each room's project content reads cleanly. On a phone, the same reviewer sees a clean card list and does not notice anything missing.
