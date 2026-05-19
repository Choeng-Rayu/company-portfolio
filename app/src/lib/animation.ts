// Motion token system — used by all animation across the site.
// See docs/prompts/03-motion-polish-anime.md for the full spec.

// ─── Durations (seconds) ────────────────────────────────────────────────────
export const D = {
  micro: 0.18,   // hover, tap, focus
  short: 0.32,   // small UI in/out
  medium: 0.6,   // section reveals
  long: 1.1,     // hero / orchestrated sequences
  epic: 1.8,     // page transitions
} as const;

// ─── Easings ──────────────────────────────────────────────────────────────────
export const E = {
  // Primary expo-out — workhorse for most motion
  out: {
    gsap: 'expo.out' as const,
    fm: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  // Gentle in-out for reversible UI states
  inOut: {
    gsap: 'power3.inOut' as const,
    fm: [0.65, 0, 0.35, 1] as [number, number, number, number],
  },
  // Sharp out for hovers
  sharpOut: {
    gsap: 'power2.out' as const,
    fm: [0.33, 1, 0.68, 1] as [number, number, number, number],
  },
  // Overshoot for confirmations — use sparingly
  back: {
    gsap: 'back.out(1.4)' as const,
    fm: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
} as const;

// ─── Stagger delays (seconds) ────────────────────────────────────────────────
export const S = {
  text: 0.04,    // per-word or per-letter
  card: 0.08,    // per-card in a grid
  section: 0.15, // per-large-block
} as const;

// ─── Legacy exports (kept for backward compat) ───────────────────────────────
export const EASE_OUT_EXPO = E.out.fm;
export const VIEWPORT_ONCE = { once: true, margin: '-100px' as const };
export const TRANSITION_SLOW = { duration: D.medium, ease: EASE_OUT_EXPO };
export const TRANSITION_MEDIUM = { duration: D.short, ease: EASE_OUT_EXPO };
export const TRANSITION_FAST = { duration: 0.4, ease: EASE_OUT_EXPO };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Split a text node into word-wrapped spans for staggered animation.
 * Returns an array of words. Preserves spacing.
 */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Stagger delay helper — legacy alias
 */
export const staggerDelay = (index: number, base = 0.1) => base * index;
