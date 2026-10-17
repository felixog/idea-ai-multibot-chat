import type { CharacterId } from './cast';
import { EDITING } from './steps';
import type { AudioMedia, Change, ChatState, EditCardMedia, ImageMedia, ThreadItem, VideoMedia } from './types';
import { COVER_SRC } from '../../lib/media';

export const THREAD_TITLE = 'Late trains teaser';

export const HOOK_ID = 'm-hook';
export const COVER_ID = 'm-cover';
export const LOOP_ID = 'm-loop';

export const SEED_TRIM = { hook: { start: 4, end: 18 }, loop: { start: 0.8, end: 5.4 } };

const idle = { percent: 33, stepIndex: 1 };

export function seedMedia(): Record<string, AudioMedia | ImageMedia | VideoMedia> {
  return {
    [HOOK_ID]: {
      id: HOOK_ID, kind: 'audio', owner: 'nova', title: 'Late trains hook', version: 1,
      prompt: 'Lo-fi hook, 92 BPM, late trains and city lights, soft voice, feeling far from home',
      changeDraft: '', changes: [], progress: idle,
      state: 'trimming', fullDuration: 20, trim: null, pendingTrim: { ...SEED_TRIM.hook }, current: 0, playing: false,
    },
    [COVER_ID]: {
      id: COVER_ID, kind: 'image', owner: 'iris', title: 'Cover art, late trains', version: 1,
      prompt: 'Night train window, city lights blurred, lo-fi album cover, soft grain, deep blue and amber',
      changeDraft: 'Warmer lights and rain on the window', changes: [], progress: idle,
      state: 'editing', src: COVER_SRC, filter: null,
    },
    [LOOP_ID]: {
      id: LOOP_ID, kind: 'video', owner: 'iris', title: 'Teaser loop', version: 1,
      prompt: 'Six second loop of the window lights, rain streaks, seamless, 16:9',
      changeDraft: '', changes: [], progress: idle,
      state: 'default', fullDuration: 6, trim: null, pendingTrim: { ...SEED_TRIM.loop }, current: 0, muted: false,
    },
  };
}

export function seedItems(): ThreadItem[] {
  return [
    { id: 'i-day', kind: 'day', label: 'Today' },
    { id: 'i-1', kind: 'message', sender: 'user', time: '21:03', text: 'Chorus idea: late trains, city lights, feeling far from home. Can you sketch a 20s hook?' },
    { id: 'i-2', kind: 'message', sender: 'nova', time: '21:04', text: 'Here’s a 20s hook at 92 BPM, lo-fi.', mediaId: HOOK_ID },
    { id: 'i-3', kind: 'message', sender: 'user', time: '21:05', text: '@Iris can you make cover art that matches this?' },
    { id: 'i-4', kind: 'system', icon: 'user', text: 'Iris joined the chat' },
    { id: 'i-5', kind: 'message', sender: 'iris', time: '21:06', text: 'On it. Here’s a first pass in Nova’s night tones. Tell me what to change.', mediaId: COVER_ID },
    { id: 'i-6', kind: 'message', sender: 'iris', time: '21:06', text: 'Want a 6 second loop for the teaser?', mediaId: LOOP_ID },
    { id: 'i-7', kind: 'message', sender: 'nova', time: '21:08', text: 'That palette fits the synth pad, warming up the mix.' },
  ];
}

export function seedState(): ChatState {
  return {
    items: seedItems(),
    media: seedMedia(),
    addressees: ['nova', 'iris'],
    muted: { nova: false, iris: false },
    draft: '',
    picker: { open: false, query: '', index: 0 },
    ui: { chatsOpen: false, castOpen: false, toast: null, highlightId: null, shakeKey: 0 },
    demo: { done: [], dismissed: false },
    preview: 'fit',
  };
}

export const OTHER_CHATS = [
  { id: 'c-market', title: 'Sunday market vlog', time: 'Yesterday', preview: 'Iris: Three thumbnails to pick from.' },
  { id: 'c-album', title: 'Album cover ideas', time: 'Mon', preview: 'You: Darker, with more grain please' },
];

/** Changes an EditCard proposes, by target kind. */
export function editChanges(kind: 'image' | 'video'): Change[] {
  return kind === 'image'
    ? [
        { id: 'c-warm', icon: 'sparkles', title: 'Warmer lights', detail: 'Lamps and windows shifted to amber', tone: 'ai', undone: false },
        { id: 'c-rain', icon: 'droplets', title: 'Rain on the window', detail: 'Streaks added to the glass', tone: 'ai', undone: false },
      ]
    : [
        { id: 'c-grade', icon: 'sparkles', title: 'Warmer grade', detail: 'Matched to the cover', tone: 'ai', undone: false },
        { id: 'c-trim', icon: 'scissors', title: 'Trimmed to 4.6s', detail: '0:00.8 to 0:05.4', tone: 'ai', undone: false },
        { id: 'c-loop', icon: 'repeat', title: 'Seamless loop', detail: 'Last frame blends into the first', tone: 'ai', undone: false },
      ];
}

export function newEditCard(id: string, owner: CharacterId, targetId: string, targetKind: 'image' | 'video'): EditCardMedia {
  return { id, kind: 'edit', owner, targetId, targetKind, status: 'working', percent: 0, stepIndex: 1, view: 'after', steps: EDITING[targetKind], changes: editChanges(targetKind) };
}

/** Scripted replies (see the brief's "Scripted replies" table). */
export const REPLIES = {
  saveHookTrim: 'Tighter. The hook lands on the downbeat now.',
  coverEdit: 'Warming the lights and adding rain. Here’s v2 to review.',
  coverApplied: 'Love the amber. I’ll nudge the pad warmer to match.',
  loopEdit: 'Grading it to the cover and tightening the loop.',
  hookEdit: 'Reworking the hook with your note. v2 coming up.', // TODO(spec): the brief has no copy for an Edit prompt on the hook
  newCover: 'Here’s another direction.',
  newLoop: 'Here’s a new loop.',
  newHook: 'New take coming up.',
  nova: [
    'On it. I’ll keep it at 92 BPM so it sits under the loop.',
    'Got it. Want me to try a warmer bassline?',
    'Nice. I’ll sketch a version with more space in the chorus.',
  ],
  iris: [
    'Noted. One question: should the rain read as soft or heavy?',
    'Got it. I’ll keep the palette in deep blue and amber.',
    'Understood. I’ll match the grain on the cover.',
  ],
};

export const KEYWORDS = {
  cover: /\b(cover|art|image|thumbnail)\b/i,
  loop: /\b(loop|video|teaser|clip)\b/i,
  hook: /\b(hook|beat|music|song|voice|melody|bpm)\b/i,
};
