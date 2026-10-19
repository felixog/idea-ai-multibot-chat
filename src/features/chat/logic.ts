import { CAST, type CharacterId } from './cast';
import type { ChatState, Media, ThreadItem } from './types';

export type MentionKey = CharacterId | 'all';

/** Whoever of Nova and Iris sent the last message. */
export function lastBotSpeaker(items: ThreadItem[]): CharacterId | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.kind === 'message' && it.sender !== 'user') return it.sender;
  }
  return null;
}

/** Picker order: the character who did not speak last, the other, then @all; filtered by name prefix. */
export function mentionOptions(state: ChatState): MentionKey[] {
  const last = lastBotSpeaker(state.items) ?? 'nova';
  const order: MentionKey[] = [last === 'nova' ? 'iris' : 'nova', last, 'all'];
  const q = state.picker.query.toLowerCase();
  return order.filter((k) => (k === 'all' ? 'all' : CAST[k].name.toLowerCase()).startsWith(q));
}

/** The @query being typed before the caret, or null. */
export function queryAtCaret(text: string, caret: number): string | null {
  const m = /(?:^|\s)@([^\s@]*)$/.exec(text.slice(0, caret));
  return m ? m[1] : null;
}

/** Characters named in a draft: @Nova, @Iris, @all (case-insensitive). Empty when none. */
export function mentionedIn(text: string): CharacterId[] {
  const found = new Set<CharacterId>();
  for (const m of text.matchAll(/@(nova|iris|all)\b/gi)) {
    const k = m[1].toLowerCase();
    if (k === 'all') {
      found.add('nova');
      found.add('iris');
    } else found.add(k as CharacterId);
  }
  return (['nova', 'iris'] as CharacterId[]).filter((c) => found.has(c));
}

function minutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Grouping rule: a bot message within 2 minutes of the same bot's previous message, with nothing between, hides its header. */
export function showsHeader(items: ThreadItem[], index: number): boolean {
  const it = items[index];
  if (it.kind !== 'message' || it.sender === 'user') return false;
  const prev = items[index - 1];
  if (!prev || prev.kind !== 'message' || prev.sender !== it.sender) return true;
  return minutes(it.time) - minutes(prev.time) > 2;
}

export function previewLine(items: ThreadItem[]): string {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.kind === 'message') return `${it.sender === 'user' ? 'You' : CAST[it.sender].name}: ${it.text}`;
  }
  return '';
}

export function lastTime(items: ThreadItem[]): string {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.kind === 'message') return it.time;
  }
  return '';
}

/** Media rows for Made in this chat, in thread order (EditCards excluded). */
export function madeItems(state: ChatState): Array<{ media: Exclude<Media, { kind: 'edit' }>; messageId: string }> {
  const rows: Array<{ media: Exclude<Media, { kind: 'edit' }>; messageId: string }> = [];
  for (const it of state.items) {
    if (it.kind !== 'message' || !it.mediaId) continue;
    const m = state.media[it.mediaId];
    if (m && m.kind !== 'edit') rows.push({ media: m, messageId: it.id });
  }
  return rows;
}

export function isPlaying(m: Media): boolean {
  return (m.kind === 'audio' && m.playing) || (m.kind === 'video' && m.state === 'playing');
}

export const optionId = (base: string, key: MentionKey) => `${base}-opt-${key}`;

/** Chat list rows: title, time ("21:08" today, "Yesterday" before), last-message preview and unread state. */
export function chatRows(state: ChatState, order: string[]) {
  return order
    .filter((id) => state.threads[id])
    .map((id) => {
      const t = state.threads[id];
      const items = id === state.chatId ? state.items : t.items;
      return { id, title: t.title, time: t.dayLabel ?? lastTime(items), preview: previewLine(items), unread: t.unread && id !== state.chatId, active: id === state.chatId };
    });
}
