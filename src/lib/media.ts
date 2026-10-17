import type { AudioMedia, ImageMedia, Media, PlayableMedia, VideoMedia } from '../features/chat/types';
import { mss } from './time';

export const COVER_SRC = '/assets/cover-late-trains.svg';
export const POSTER_SRC = '/assets/poster-teaser-loop.svg';
export const WARM_FILTER = 'saturate(1.15) sepia(0.18) hue-rotate(-8deg) brightness(1.04)';

export function duration(m: PlayableMedia): number {
  return m.trim ? m.trim.end - m.trim.start : m.fullDuration;
}

const v = (n: number) => (n > 1 ? ` · v${n}` : '');

export function details(m: AudioMedia | ImageMedia | VideoMedia): string {
  if (m.kind === 'audio') return `${mss(duration(m))} · 92 BPM · lo-fi${v(m.version)}`;
  if (m.kind === 'image') return `1:1 · v${m.version}`;
  return `${mss(duration(m))} · 16:9${v(m.version)}`;
}

export function kindLabel(m: Media): string {
  return m.kind === 'audio' ? 'Audio' : m.kind === 'image' ? 'Image' : m.kind === 'video' ? 'Video' : 'Edit';
}

/** Meta for the Made in this chat row: "Audio · 0:20", "Image · v1", "Video · 0:06". */
export function madeMeta(m: AudioMedia | ImageMedia | VideoMedia): string {
  if (m.kind === 'image') return `Image · v${m.version}`;
  return `${kindLabel(m)} · ${mss(duration(m))}`;
}
