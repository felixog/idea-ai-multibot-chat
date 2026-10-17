/** localStorage for per-viewer conveniences only; it can be missing or throw (private windows, blocked storage). */
export function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeFlag(key: string, on: boolean) {
  try {
    if (on) window.localStorage.setItem(key, '1');
    else window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable: the choice lasts until reload.
  }
}

export const DEMO_HIDDEN_KEY = 'rk-demo-hidden';
