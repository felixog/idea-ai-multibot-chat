import { Clapperboard, Image, Mic, Music } from 'lucide-react';
import type { LucideIcon } from '../../lib/icon';
import { COVER_SRC } from '../../lib/media';
import type { CharacterId } from './cast';
import type { ChatScript } from './script';

/** A new-chat starting point: who joins, what to suggest, and how the characters open. */
export interface ChatTemplate {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  cast: CharacterId[];
  placeholder: string;
  starters: string[];
  /** Each invited character's first reply; media arrives generating. */
  first: Partial<Record<CharacterId, { text: string; kind?: 'audio' | 'image' }>>;
  script: ChatScript;
}

export const TEMPLATES: ChatTemplate[] = [
  {
    id: 'teaser',
    label: 'Song teaser',
    blurb: 'A hook, cover art and a short loop',
    icon: Music,
    cast: ['nova', 'iris'],
    placeholder: 'What’s the song about, how should it feel, and where will the teaser go?',
    starters: [
      'Summer single about driving with the windows down. Can you sketch a 20s hook and a cover?',
      'Slow R&B track about 3am phone calls. I need a moody hook and cover for a teaser.',
    ],
    first: {
      nova: { text: 'Here’s a first 20s sketch to react to.', kind: 'audio' },
      iris: { text: 'And a first cover direction. Tell me what to push.', kind: 'image' },
    },
    script: {
      nova: ['Got it. I’ll keep the hook under 20 seconds.', 'Nice. Want a version with the drop earlier?', 'On it. I’ll try a warmer bassline.'],
      iris: ['Noted. One question: day or night?', 'Got it. I’ll keep the type small and the colour loud.', 'Understood. I’ll match the cover to Nova’s tempo.'],
      image: { title: 'Cover', src: COVER_SRC, alt: 'Cover art: a city window at night in pink and teal', prompt: 'A first cover direction from the brief', filter: 'hue-rotate(150deg) saturate(1.3)' },
      audio: { title: 'First hook', seconds: 20, tags: '96 BPM · pop', prompt: 'A first 20 second hook from the brief' },
    },
  },
  {
    id: 'cover',
    label: 'Cover art',
    blurb: 'Directions for a single, EP or album cover',
    icon: Image,
    cast: ['iris'],
    placeholder: 'Title, mood, colours, anything it should or shouldn’t look like',
    starters: [
      'EP called Night Shift. Neon, rain, a bit lonely.',
      'Single cover for a bright summer song. Simple, bold, one main colour.',
    ],
    first: {
      iris: { text: 'Here’s a first direction. I kept it simple so we can push it either way.', kind: 'image' },
      nova: { text: 'I’m listening in. Send the track when you want a sting to match.' },
    },
    script: {
      nova: ['Got it. I’ll make a sting that matches the cover.', 'Nice. Want a short loop to go with it?', 'On it. I’ll keep it under ten seconds.'],
      iris: ['Noted. One question: should the title sit on the art or below it?', 'Got it. I’ll try a darker take as well.', 'Understood. I’ll keep it readable at thumbnail size.'],
      image: { title: 'Cover', src: '/assets/night-radio.svg', alt: 'Cover art: a glowing radio in a dark room', prompt: 'A first cover direction from the brief', filter: 'hue-rotate(200deg) saturate(1.2)' },
      audio: { title: 'Cover sting', seconds: 8, tags: '110 BPM · synth', prompt: 'A short sting to match the cover' },
    },
  },
  {
    id: 'vlog',
    label: 'Vlog intro',
    blurb: 'An intro track and thumbnails',
    icon: Clapperboard,
    cast: ['nova', 'iris'],
    placeholder: 'What’s the vlog about, how long is the intro, and what should the thumbnail show?',
    starters: [
      'Weekend hiking vlog. A calm, outdoorsy intro and a thumbnail that pops.',
      'Studio day vlog. Upbeat 10s intro and a clean, bright thumbnail.',
    ],
    first: {
      nova: { text: 'Here’s a 15s intro to start from.', kind: 'audio' },
      iris: { text: 'And a first thumbnail, big shapes so it reads on a phone.', kind: 'image' },
    },
    script: {
      nova: ['Got it. I’ll leave room for your voiceover.', 'Sure. Want an outro version too?', 'On it. I’ll match the tempo to your cuts.'],
      iris: ['Noted. One question: faces or places on the thumbnail?', 'Got it. I’ll keep the title big.', 'Understood. Bright and warm it is.'],
      image: { title: 'Thumbnail', src: '/assets/market-flower-stall.svg', alt: 'Vlog thumbnail: bright shapes under a striped awning', prompt: 'A first thumbnail from the brief', filter: 'hue-rotate(70deg) saturate(1.1)' },
      audio: { title: 'Intro', seconds: 15, tags: '88 BPM · acoustic', prompt: 'A first 15 second intro from the brief' },
    },
  },
  {
    id: 'voice',
    label: 'Voice or jingle',
    blurb: 'A sung or spoken line to try out',
    icon: Mic,
    cast: ['nova'],
    placeholder: 'The line, the voice you hear in your head, and where it will play',
    starters: [
      'A 5 second jingle for my podcast, warm and friendly.',
      'Sing the line “late trains, city lights” three different ways.',
    ],
    first: {
      nova: { text: 'Here’s a first take. Tell me warmer, faster or simpler.', kind: 'audio' },
      iris: { text: 'I can make artwork for it once the sound feels right.' },
    },
    script: {
      nova: ['Got it. I’ll try it a little slower.', 'Nice. Want a version with harmonies?', 'On it. I’ll keep it short and catchy.'],
      iris: ['Noted. Want artwork for this too?', 'Got it. I’ll keep the art simple to match.', 'Understood. I’ll wait for the final take.'],
      image: { title: 'Artwork', src: COVER_SRC, alt: 'Artwork: a city window at night', prompt: 'Artwork for the jingle', filter: 'saturate(1.2)' },
      audio: { title: 'First take', seconds: 8, tags: '100 BPM · vocal', prompt: 'A first sung take from the brief' },
    },
  },
];

export function templateById(id: string | undefined): ChatTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/** A short chat name from the brief: its first clause, cut at a word boundary. */
export function autoTitle(brief: string, fallback: string): string {
  const clause = brief.trim().split(/[.!?\n]/)[0].replace(/[,:;]+$/, '').trim();
  if (!clause) return fallback;
  let out = '';
  for (const word of clause.split(/\s+/)) {
    if ((out + ' ' + word).trim().length > 28) break;
    out = (out + ' ' + word).trim();
  }
  out = out || clause.slice(0, 28);
  return out.charAt(0).toUpperCase() + out.slice(1);
}
