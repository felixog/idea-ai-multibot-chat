import type { PointerEvent as ReactPointerEvent } from 'react';

/**
 * Starts a pointer drag that reports the pointer's horizontal fraction (0..1) across `track`.
 * Call from onPointerDown. The first position is reported immediately.
 */
export function startDrag(e: ReactPointerEvent, track: HTMLElement | null, onFraction: (f: number) => void) {
  if (!track || e.button !== 0) return;
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture?.(e.pointerId);
  const report = (clientX: number) => {
    const r = track.getBoundingClientRect();
    onFraction(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };
  report(e.clientX);
  const move = (ev: PointerEvent) => report(ev.clientX);
  const up = () => {
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', up);
  };
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);
}

/** Shared keyboard handling for role="slider": arrows step, Home and End jump. Returns the new value or null. */
export function sliderKey(key: string, value: number, min: number, max: number, step: number): number | null {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(min, value - step);
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(max, value + step);
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return null;
  }
}
