/** "00:04" (VoicePlayer, VideoPlayer). */
export function mmss(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** "0:04" or, with tenths, "0:00.8" (trim times, details). */
export function mss(sec: number, tenths = false): string {
  const t = Math.max(0, tenths ? Math.round(sec * 10) / 10 : Math.round(sec));
  const m = Math.floor(t / 60);
  const rest = t - m * 60;
  const whole = Math.floor(rest);
  const s = String(whole).padStart(2, '0');
  return tenths ? `${m}:${s}.${Math.round((rest - whole) * 10)}` : `${m}:${s}`;
}

/** "14" or "4.6" (no trailing .0). */
export function secs(sec: number): string {
  const r = Math.round(sec * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

/** Value text for sliders: "0:04 of 0:20". */
export function valueText(sec: number, total: number, tenths = false): string {
  return `${mss(sec, tenths)} of ${mss(total, tenths)}`;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function snap(v: number, step: number): number {
  return Math.round(v / step) * step;
}

export function clockNow(d = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
