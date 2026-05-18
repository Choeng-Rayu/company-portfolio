# Research Analysis: Tonik SR006 — 3D Scroll Interaction

> **URL:** https://sr006.tonik.com/  
> **Date:** May 2026  
> **Focus:** How the 3D object interacts with scroll, especially the pricing section

---

## 1. What I Found

The SR006 website uses a **single persistent 3D object** approach — not multiple separate 3D scenes. This is exactly why it feels clean and professional rather than messy.

### The Core Pattern

| Element | Behavior |
|---------|----------|
| **Central 3D Object** | One bronze/copper cube with embossed "SR" and "006" stays fixed in the viewport center across multiple sections |
| **Scroll Interaction** | As you scroll, text content orbits/fades in around the cube. The cube itself subtly rotates. |
| **Background** | Transitions from dark charcoal gray (hero) → pure black (price section) |
| **Content Arrangement** | Text items appear on left/right sides of the cube, never blocking it |

---

## 2. Section Breakdown (Scroll Journey)

### Hero Section (Top)
- **Visual:** Giant "SR006" typography + "Brand Lab — on-site in SF"
- **3D Object:** Bronze cube centered, facing corner-forward (showing two faces: "SR" and "006")
- **Background:** Dark charcoal `#333333` range
- **Interaction:** Cube slowly auto-rotates. No scroll-linked movement yet.

### "What You Get" Section (~1500px scroll)
- **Visual:** The cube is still dead-center. Now content appears beside it:
  - **Left:** "Brand system" → "Waitlist website" → "Demo-day deck"
  - **Right:** Descriptions for each deliverable
- **3D Behavior:** Cube continues rotating. Content items fade/slide in as they enter viewport.
- **Key Insight:** The cube does NOT move. The HTML content scrolls past it. The cube feels like a fixed anchor.

### Price Section (~3000px scroll) — THE KEY MOMENT
- **Visual:** This is the section you referenced. The cube is still the hero object.
  - **Left:** "SR006 Brand Lab"
  - **Right:** "$10k" / "2-3 weeks"
- **Background:** Now pure black `#000000` — the cube pops with more contrast
- **3D Behavior:** The cube has rotated to show a different face/angle than the hero. The lighting on the cube appears more dramatic against the black background.
- **Why it works:** The user has formed a relationship with this object over the previous scroll. Now when pricing appears, the object feels like a "product" being presented.

### Secret Menu / Highlights (~4500px scroll)
- **Visual:** "Web", "UX/UI", "Launch Video" cards + "SR005 Highlights"
- **3D Behavior:** The cube either exits viewport or dims. The focus shifts to 2D content cards.

---

## 3. Why This Design Is Effective

### 3.1 One Anchor Object
They use **ONE 3D object**, not many. Your brain can focus on it. It becomes familiar. By the time you reach pricing, you trust the object.

### 3.2 Object Stays, Content Moves
The cube is either:
- **Fixed/sticky** in viewport while HTML scrolls behind/around it, OR
- **Parallaxed** at a slower speed than the scroll

Either way, the object feels stable while the story unfolds around it.

### 3.3 Background Color Shift
The transition from charcoal → pure black at the price section is intentional. It creates a "reveal" moment. The cube suddenly looks more premium.

### 3.4 Minimal Typography
All text is sans-serif, light weight, generous spacing. Nothing fights the 3D object for attention.

### 3.5 No Chaotic Motion
The cube rotates slowly. No bouncing, no flashing, no particle explosions. It feels like a museum piece, not a video game.

---

## 4. Technical Observations

| Aspect | Observation |
|--------|-------------|
| **Platform** | Framer (hosted on Framer infrastructure) |
| **Animation** | Framer Motion (`motion.BMUva3c6.mjs` detected) |
| **3D Engine** | Likely **Spline** embedded via Framer, or native Framer 3D. The cube has realistic metal material with embossed lettering — suggests Spline or imported GLB. |
| **Scroll Logic** | Framer Motion's `useScroll` + `useTransform` for scroll-linked opacity/position |
| **Responsive** | On mobile, the cube likely scales down or switches to a static image/video |

---

## 5. How to Adapt This to YOUR Software Company

### Keep the Same Pattern

Your site should follow the exact same architecture:

```
[Hero]          3D Object appears (wireframe core / geometric monolith)
                    ↓
[Services]      Object stays center. Service names appear around it.
                    ↓
[Process]       Object stays center. Process steps orbit/arrange around it.
                    ↓
[Projects]      Object stays center. Project thumbnails float beside it.
                    ↓
[Pricing]       Object stays center. Pricing tiers appear left/right.
                    ↓
[Contact]       Object fades. Focus shifts to CTA.
```

### Your Specific Adaptations

| SR006 Element | Your Adaptation (Universe + Software Theme) |
|---------------|---------------------------------------------|
| Bronze cube with "SR006" | **Lime wireframe icosahedron** or **geometric monolith** with your logo embossed. Metallic dark material with `#C8F135` edge lighting. |
| Charcoal → Black background | **Deep space black** → **Void black** at pricing. Add subtle starfield particles at pricing reveal. |
| "Brand system / Waitlist / Deck" text | **Services list:** "Custom Software" / "Digital Transformation" / "Business Systems" / "Automation" |
| "$10k / 2-3 weeks" | **Your pricing:** "From $X,XXX" / "6-10 week delivery" or "Get a quote" |
| Minimal sans-serif | Keep your current font (it already works) |

### Recommended 3D Object for Your Brand

Instead of a cube, use a **"Digital Core"**:
- **Shape:** Icosahedron or dodecahedron (more interesting than a cube, still geometric/professional)
- **Material:** Dark gunmetal with **lime emissive edges** (wireframe glow)
- **Embossed/etched:** Your company initials or a code-bracket symbol `{}` on one face
- **Inner element:** A slowly pulsing lime sphere inside the wireframe (like a reactor core)
- **Behavior:** Rotates 360° over 60 seconds. On scroll, rotation speeds up slightly (+20%).

### Scroll Behavior Map for Your Site

```
Scroll 0% (Hero)
├── 3D Core appears, centered
├── Headline: "Cambodian Engineers..."
└── Core rotates slowly, background: deep space

Scroll 15% (Services)
├── Core stays center
├── Service titles slide in from left
├── Service descriptions slide in from right
└── Core subtly brightens

Scroll 35% (Process)
├── Core stays center
├── 5 step labels orbit around core in a ring
├── Active step glows lime
└── Completed steps stay dim

Scroll 55% (Projects)
├── Core stays center
├── Project thumbnails float left/right
├── On hover: thumbnail tilts, core pulses

Scroll 75% (Pricing) ← THE MONEY SHOT
├── Background shifts to pure black
├── Core rotates to present "front face"
├── Pricing tiers appear left/right
├── Core emits faint lime aura

Scroll 90% (Contact)
├── Core drifts upward/out of frame
├── Contact form fades in
└── Subtle particle trail follows core exit
```

---

## 6. Implementation Tips (Based on SR006's Approach)

### 6.1 Use a Sticky/Fixed 3D Container
```tsx
// The canvas stays fixed while content scrolls
<canvas className="fixed inset-0 z-0 pointer-events-none" />
<div className="relative z-10">
  {/* Your scrollable content sections */}
</div>
```

### 6.2 Scroll-Linked Opacity/Position (Framer Motion)
```tsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0.1, 0.15], [0, 1]);
const x = useTransform(scrollYProgress, [0.1, 0.15], [-100, 0]);
// Use these on service title elements
```

### 6.3 Background Color Transition
```tsx
const backgroundColor = useTransform(
  scrollYProgress,
  [0.65, 0.75],
  ["#0E0E11", "#000000"] // charcoal → pure black at pricing
);
```

### 6.4 3D Object Rotation Linked to Scroll
```tsx
// In R3F useFrame
useFrame(() => {
  const scroll = scrollYProgress.get();
  mesh.rotation.y = scroll * Math.PI * 2; // Full rotation over entire page
});
```

### 6.5 Mobile Strategy (Critical)
SR006 likely shows a **static image or video** of the cube on mobile instead of real-time 3D. You should do the same:
- Desktop: Full R3F interactive 3D core
- Mobile: Pre-rendered 360° video or PNG sequence of the core, controlled by scroll position
- Or: CSS `transform: rotateY()` on a div with layered images

---

## 7. What Makes SR006's Price Section Specifically Good

1. **Familiarity:** You've been looking at the cube for 3 sections. It's now a trusted object.
2. **Contrast shift:** The background goes black. The cube looks expensive.
3. **Numbers feel anchored:** "$10k" sits next to a physical-feeling object. It feels like a price tag on a product.
4. **No clutter:** Just the object + 3 text elements. Maximum focus.
5. **Confidence:** The cube doesn't animate wildly here. It holds still. The design says "this is the price, it's solid."

---

## 8. Mistakes to Avoid (That SR006 Doesn't Make)

| ❌ Don't | ✅ Do (like SR006) |
|----------|---------------------|
| Change the 3D object per section | Keep ONE object throughout |
| Put 3D objects behind text | Keep object in clear space, text beside it |
| Use bright rainbow colors | Use ONE accent color (your lime) on dark material |
| Make object bounce/shake on scroll | Gentle rotation only |
| Add particle explosions | Subtle starfield at most |
| Show pricing with 10 other elements | Pricing section = object + price + timeline + CTA only |

---

## Summary

**SR006's secret:** They turned a 3D cube into a **product presenter**. The cube is not decoration — it is the product being sold. As you scroll, you learn about the product (what you get), and then you see the price next to the product.

**For your software company:** Turn your 3D core into a **"system"** that gets built as you scroll. The user watches the system take shape (services → process → projects), and then at pricing, the system is complete and presented with a price tag.
