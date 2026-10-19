import type { DemoKey } from '../../../features/chat/store';

export const DEMO_ROWS: Array<{ key: DemoKey; label: string }> = [
  { key: 'trim', label: 'Save the trim on Nova’s hook' },
  { key: 'apply', label: 'Make changes to Iris’s cover, then apply them' },
  { key: 'play', label: 'Play the teaser loop' },
  { key: 'mention', label: 'Mention @Iris or @all in the message box' },
  { key: 'mute', label: 'Mute a character in the cast' },
  { key: 'phone', label: 'Try the phone preview, or make the window narrower' },
];

export const DEMO_ROW_KEYS = DEMO_ROWS.map((r) => r.key);
