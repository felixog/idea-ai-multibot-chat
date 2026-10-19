import type { CharacterId } from './cast';
import { EDITING } from './steps';
import type { AudioMedia, Change, ChatState, EditCardMedia, ImageMedia, Media, ThreadData, ThreadItem, VideoMedia } from './types';
import { COVER_SRC } from '../../lib/media';

export const THREAD_TITLE = 'Late trains teaser';

export const CHAT_IDS = { lateTrains: 'late-trains', market: 'market', album: 'album' } as const;
/** Sidebar order. */
export const CHAT_ORDER: string[] = [CHAT_IDS.lateTrains, CHAT_IDS.market, CHAT_IDS.album];

export const COVER_ALT = 'Cover art: a rainy night train window looking out on city lights in blue and amber';

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
      state: 'trimming', fullDuration: 20, trim: null, pendingTrim: { ...SEED_TRIM.hook }, current: 0, playing: false, tags: '92 BPM · lo-fi',
    },
    [COVER_ID]: {
      id: COVER_ID, kind: 'image', owner: 'iris', title: 'Cover art, late trains', version: 1,
      prompt: 'Night train window, city lights blurred, lo-fi album cover, soft grain, deep blue and amber',
      changeDraft: 'Warmer lights and rain on the window', changes: [], progress: idle,
      state: 'editing', src: COVER_SRC, filter: null, alt: COVER_ALT,
    },
    [LOOP_ID]: {
      id: LOOP_ID, kind: 'video', owner: 'iris', title: 'Teaser loop', version: 1,
      prompt: 'Six second loop of the window lights, rain streaks, seamless, 16:9',
      changeDraft: '', changes: [], progress: idle,
      state: 'default', fullDuration: 6, trim: null, pendingTrim: { ...SEED_TRIM.loop }, current: 0, muted: false, filter: null,
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
  const threads: Record<string, ThreadData> = {
    [CHAT_IDS.lateTrains]: { id: CHAT_IDS.lateTrains, title: THREAD_TITLE, dayLabel: null, unread: false, items: [], addressees: [], draft: '', members: ['nova', 'iris'] },
    [CHAT_IDS.market]: { id: CHAT_IDS.market, title: 'Sunday market vlog', dayLabel: 'Yesterday', unread: false, items: marketItems(), addressees: ['nova', 'iris'], draft: '', members: ['nova', 'iris'] },
    [CHAT_IDS.album]: { id: CHAT_IDS.album, title: 'Album cover ideas', dayLabel: 'Mon', unread: true, items: albumItems(), addressees: ['iris'], draft: '', members: ['nova', 'iris'] },
  };
  return {
    chatId: CHAT_IDS.lateTrains,
    threads,
    order: [...CHAT_ORDER],
    items: seedItems(),
    media: { ...seedMedia(), ...otherChatMedia() },
    addressees: ['nova', 'iris'],
    muted: { nova: false, iris: false },
    draft: '',
    picker: { open: false, query: '', index: 0 },
    ui: { chatsOpen: false, castOpen: false, toast: null, highlightId: null, shakeKey: 0, editFocus: null, chatsCollapsed: false, castCollapsed: false, newChat: false },
    demo: { done: [], dismissed: false },
    preview: 'fit',
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Sunday market vlog (yesterday) and Album cover ideas (Monday)

const done = { percent: 100, stepIndex: 3 };
const image = (id: string, title: string, src: string, alt: string, prompt: string): ImageMedia => ({
  id, kind: 'image', owner: 'iris', title, version: 1, prompt, changeDraft: '', changes: [], progress: done,
  state: 'default', src, filter: null, alt,
});
const audio = (id: string, title: string, seconds: number, tags: string, prompt: string): AudioMedia => ({
  id, kind: 'audio', owner: 'nova', title, version: 1, prompt, changeDraft: '', changes: [], progress: done,
  state: 'default', fullDuration: seconds, trim: null, pendingTrim: { start: 0, end: seconds }, current: 0, playing: false, tags,
});

export function otherChatMedia(): Record<string, Media> {
  const radioEdit: EditCardMedia = {
    id: 'e-radio', kind: 'edit', owner: 'iris', targetId: 'm-radio-cover', targetKind: 'image', status: 'ready', percent: 100, stepIndex: 3,
    view: 'after',
    steps: [{ label: 'Read your note' }, { label: 'Darkening the room', detail: 'Shadows down a stop' }, { label: 'Adding film grain' }],
    changes: [
      { id: 'c-dark', icon: 'sparkles', title: 'Darker room', detail: 'Shadows down a stop, the dial still glows', tone: 'ai', undone: false },
      { id: 'c-grain', icon: 'film', title: 'Film grain', detail: '35mm grain over the whole frame', tone: 'ai', undone: false },
    ],
    afterSrc: '/assets/night-radio-grain.svg',
    afterFilter: 'none',
  };
  return {
    'm-market-intro': audio('m-market-intro', 'Market morning intro', 15, '84 BPM · acoustic', 'Calm acoustic intro, 84 BPM, Sunday market morning, coffee and footsteps'),
    'm-thumb-flowers': image('m-thumb-flowers', 'Thumbnail, flower stall', '/assets/market-flower-stall.svg',
      'Vlog thumbnail: a striped market awning over buckets of bright flowers', 'Bright market thumbnail, flower stall under a striped awning, readable at small sizes'),
    'm-thumb-coffee': image('m-thumb-coffee', 'Thumbnail, coffee cart', '/assets/market-coffee-cart.svg',
      'Vlog thumbnail: an orange coffee cart under a blue and white umbrella on a sunny morning', 'Market thumbnail, coffee cart and umbrella, morning light, simple shapes'),
    'm-thumb-lights': image('m-thumb-lights', 'Thumbnail, string lights', '/assets/market-string-lights.svg',
      'Vlog thumbnail: string lights glowing over market stalls at dusk', 'Market thumbnail at dusk, string lights over the stalls, warm glow'),
    'm-radio-cover': image('m-radio-cover', 'EP cover, night radio', '/assets/night-radio.svg',
      'EP cover: a vintage radio glowing amber in a dark room, a moonlit window behind it', 'Late night radio, vintage set glowing in a dark room, moon in the window, warm amber dial'),
    'm-radio-sting': audio('m-radio-sting', 'Station sting', 10, '120 BPM · synth', 'Ten second radio station ident, warm synth, late night'),
    'e-radio': radioEdit,
  };
}

function marketItems(): ThreadItem[] {
  return [
    { id: 'mk-day', kind: 'day', label: 'Yesterday' },
    { id: 'mk-1', kind: 'message', sender: 'user', time: '10:12', text: 'Filmed the Sunday market this morning. Can you make a calm intro track and a few thumbnail options?' },
    { id: 'mk-2', kind: 'message', sender: 'nova', time: '10:13', text: 'Here’s a 15s acoustic intro at 84 BPM. Slow start, then the stalls open up.', mediaId: 'm-market-intro' },
    { id: 'mk-3', kind: 'message', sender: 'user', time: '10:15', text: '@Iris thumbnails please. Bright, busy and readable on a phone.' },
    { id: 'mk-4', kind: 'message', sender: 'iris', time: '10:17', text: 'Three thumbnails to pick from. First, the flower stall.', mediaId: 'm-thumb-flowers' },
    { id: 'mk-5', kind: 'message', sender: 'iris', time: '10:17', text: 'Second, the coffee cart. Warmer and simpler.', mediaId: 'm-thumb-coffee' },
    { id: 'mk-6', kind: 'message', sender: 'iris', time: '10:18', text: 'Third, the string lights, if you want the evening feel.', mediaId: 'm-thumb-lights' },
    { id: 'mk-7', kind: 'message', sender: 'user', time: '10:21', text: 'The coffee cart is the one. Can the intro sit under a 6 second loop of it next week?' },
    { id: 'mk-8', kind: 'message', sender: 'nova', time: '10:22', text: 'Easy. I’ll keep the intro at 84 BPM so it lands on the cut.' },
  ];
}

function albumItems(): ThreadItem[] {
  return [
    { id: 'al-day', kind: 'day', label: 'Monday' },
    { id: 'al-1', kind: 'message', sender: 'user', time: '19:40', text: 'Moodboard time for the EP cover. Something like late night radio.' },
    { id: 'al-2', kind: 'message', sender: 'iris', time: '19:42', text: 'Here’s a first direction: an old radio glowing in a dark room.', mediaId: 'm-radio-cover' },
    { id: 'al-3', kind: 'message', sender: 'nova', time: '19:43', text: 'If it’s radio, here’s a station sting to open the EP.', mediaId: 'm-radio-sting' },
    { id: 'al-4', kind: 'message', sender: 'user', time: '19:45', text: '@Iris darker, with more grain please' },
    { id: 'al-5', kind: 'message', sender: 'iris', time: '19:47', text: 'Darker room and 35mm grain. Here’s v2 to review.', mediaId: 'e-radio' },
  ];
}

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

// ---------------------------------------------------------------------------------------------------------------
// Per-chat replies: plain replies rotate per character; "make another" requests reuse the chat's own art and sound.

export interface ChatScript {
  nova: string[];
  iris: string[];
  image: { title: string; src: string; alt: string; prompt: string; filter: string | null };
  audio: { title: string; seconds: number; tags: string; prompt: string };
}

export const CHAT_SCRIPTS: Record<string, ChatScript> = {
  [CHAT_IDS.lateTrains]: {
    nova: REPLIES.nova,
    iris: REPLIES.iris,
    image: { title: 'Cover art', src: COVER_SRC, alt: COVER_ALT, prompt: 'Another direction for the cover: night train window, city lights, deep blue and amber', filter: 'hue-rotate(14deg) saturate(1.1)' },
    audio: { title: 'Late trains hook', seconds: 20, tags: '92 BPM · lo-fi', prompt: 'Lo-fi hook, 92 BPM, late trains and city lights, a new take' },
  },
  [CHAT_IDS.market]: {
    nova: [
      'Got it. I’ll keep the intro light so it sits under your voiceover.',
      'Sure. Want a version that fades out for the outro too?',
      'On it. I’ll match the tempo to your walking shots.',
    ],
    iris: [
      'Noted. One question: should the thumbnail lead with faces or with stalls?',
      'Got it. I’ll keep the title big enough to read on a phone.',
      'Understood. I’ll keep the colours bright and warm, like the coffee cart.',
    ],
    image: { title: 'Thumbnail', src: '/assets/market-coffee-cart.svg', alt: 'Vlog thumbnail: an orange coffee cart under a blue and white umbrella', prompt: 'Another market thumbnail, the coffee cart closer and brighter', filter: 'saturate(1.2) brightness(1.04)' },
    audio: { title: 'Market morning intro', seconds: 15, tags: '84 BPM · acoustic', prompt: 'Calm acoustic intro, 84 BPM, a new take with more space' },
  },
  [CHAT_IDS.album]: {
    nova: [
      'Got it. I’ll keep the sting under ten seconds.',
      'Nice. Want a slower, darker take to open track one?',
      'On it. I’ll add a little tape hiss to match the grain.',
    ],
    iris: [
      'Noted. One question: should the title sit at the top or the bottom?',
      'Got it. I’ll keep the amber dial as the only warm light.',
      'Understood. I’ll try a version with the window lit.',
    ],
    image: { title: 'EP cover', src: '/assets/night-radio.svg', alt: 'EP cover: a vintage radio glowing amber in a dark room', prompt: 'Another EP cover direction: the night radio, closer, moodier', filter: 'hue-rotate(-10deg) contrast(1.1)' },
    audio: { title: 'Station sting', seconds: 10, tags: '120 BPM · synth', prompt: 'Ten second station ident, a new take, warmer synth' },
  },
};
