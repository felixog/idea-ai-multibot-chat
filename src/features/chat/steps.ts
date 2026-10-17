import type { Step } from './types';

/** AgentSteps copy for media that is being generated (MediaAudio, MediaImage, MediaVideo). */
export const GENERATING = {
  audio: {
    title: (name: string) => `${name} is making your hook`,
    steps: [
      { label: 'Wrote a four-chord loop' },
      { label: 'Recording a voice preview', detail: '92 BPM, lo-fi' },
      { label: 'Mixing and levelling' },
    ] as Step[],
  },
  image: {
    title: (name: string) => `${name} is painting your cover`,
    steps: [
      { label: 'Listened to Nova’s hook' },
      { label: 'Painting the cover', detail: '1:1, night tones' },
      { label: 'Checking contrast for small screens' },
    ] as Step[],
  },
  video: {
    title: (name: string) => `${name} is making your loop`,
    steps: [
      { label: 'Matched the cover palette' },
      { label: 'Animating the window lights', detail: '6 seconds, 16:9' },
      { label: 'Looping the last frame' },
    ] as Step[],
  },
};

/** EditCard steps while working. */
export const EDITING = {
  image: [
    { label: 'Read your note' },
    { label: 'Warming the street lights', detail: 'Matching Nova’s amber' },
    { label: 'Adding rain to the glass' },
  ] as Step[],
  video: [
    { label: 'Read your note' },
    { label: 'Warming the grade to match the cover', detail: '3 of 5 shots' },
    { label: 'Rendering' },
  ] as Step[],
};
