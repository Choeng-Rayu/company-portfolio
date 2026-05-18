// Shared Framer Motion easing (expo-out)
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Standard viewport config for whileInView animations
export const VIEWPORT_ONCE = { once: true, margin: '-100px' as const };

// Shorthand transition presets
export const TRANSITION_SLOW = { duration: 0.6, ease: EASE_OUT_EXPO };
export const TRANSITION_MEDIUM = { duration: 0.5, ease: EASE_OUT_EXPO };
export const TRANSITION_FAST = { duration: 0.4, ease: EASE_OUT_EXPO };

// Stagger delay helper
export const staggerDelay = (index: number, base = 0.1) => base * index;
