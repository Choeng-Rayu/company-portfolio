// Shared motion vocabulary for the Chakrawal immersive portfolio.
export const D = {
  micro: 0.18,
  short: 0.32,
  medium: 0.6,
  long: 1.1,
} as const;

export const E = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  sharpOut: [0.33, 1, 0.68, 1] as [number, number, number, number],
} as const;

export const S = {
  text: 0.04,
  card: 0.08,
  section: 0.14,
} as const;
