// Shared pointer singleton — one global mousemove listener, multiple consumers.
// ProbeCursor registers a callback for its springs; AtmosphericParticles reads the
// mutable object directly each rAF frame. Net listener count: one.
export const pointer = { x: 0, y: 0, active: false };

type PointerCallback = (x: number, y: number) => void;
const callbacks = new Set<PointerCallback>();
let attached = false;

function onMove(e: MouseEvent) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;
  callbacks.forEach((cb) => cb(e.clientX, e.clientY));
}

function onLeave() {
  pointer.active = false;
}

export function bindPointer(cb?: PointerCallback): () => void {
  if (cb) callbacks.add(cb);

  if (!attached) {
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    attached = true;
  }

  return () => {
    if (cb) callbacks.delete(cb);
    if (callbacks.size === 0) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      attached = false;
    }
  };
}
