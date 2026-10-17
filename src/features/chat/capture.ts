import { COVER_ID, seedState } from './script';
import type { ChatState } from './types';

export interface CaptureOptions {
  mentioning: boolean;
}

/** ?capture=full (and &state=mentioning) for the visual tests. Not linked anywhere in the UI. */
export function readCapture(params: URLSearchParams): CaptureOptions | null {
  if (params.get('capture') !== 'full') return null;
  return { mentioning: params.get('state') === 'mentioning' };
}

/** Mentioning matches the Figma Tablet and Mobile frames: "@I" typed, picker showing Iris (selected), Nova and @all. */
export function captureState(opts: CaptureOptions): ChatState {
  const s = seedState();
  const base = { ...s, ui: { ...s.ui, editFocus: COVER_ID } };
  if (!opts.mentioning) return base;
  return { ...base, ui: { ...base.ui, editFocus: null }, draft: '@I', picker: { open: true, query: '', index: 0 }, addressees: ['iris'] };
}
