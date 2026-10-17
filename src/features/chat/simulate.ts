/** Every timer the prototype uses goes through one of these so Reset demo and unmount can clear them all. */
export interface Simulator {
  after(ms: number, fn: () => void): void;
  every(ms: number, fn: () => void): () => void;
  clearAll(): void;
  /** When true (capture mode), nothing is scheduled. */
  frozen: boolean;
}

export function createSimulator(): Simulator {
  const timeouts = new Set<number>();
  const intervals = new Set<number>();
  const sim: Simulator = {
    frozen: false,
    after(ms, fn) {
      if (sim.frozen) return;
      const t = window.setTimeout(() => {
        timeouts.delete(t);
        fn();
      }, ms);
      timeouts.add(t);
    },
    every(ms, fn) {
      if (sim.frozen) return () => {};
      const t = window.setInterval(fn, ms);
      intervals.add(t);
      return () => {
        window.clearInterval(t);
        intervals.delete(t);
      };
    },
    clearAll() {
      timeouts.forEach((t) => window.clearTimeout(t));
      intervals.forEach((t) => window.clearInterval(t));
      timeouts.clear();
      intervals.clear();
    },
  };
  return sim;
}

/** 900 to 1400ms, the typing indicator's random duration. */
export function typingDelay(): number {
  return 900 + Math.round(Math.random() * 500);
}
