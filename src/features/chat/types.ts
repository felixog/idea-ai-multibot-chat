import type { CharacterId } from './cast';

export type { CharacterId };
export type Sender = 'user' | CharacterId;

export type ChangeIcon = 'scissors' | 'sparkles' | 'droplets' | 'repeat' | 'film';

export interface Change {
  id: string;
  icon: ChangeIcon;
  title: string;
  detail: string;
  tone: 'ai' | 'user';
  undone: boolean;
}

export interface Range {
  start: number;
  end: number;
}

/** Progress of a simulated generation (AgentSteps). Not in the brief's types; added so cards can render steps. */
export interface Progress {
  percent: number;
  stepIndex: number;
}

export interface MediaBase {
  id: string;
  owner: CharacterId;
  title: string;
  version: number;
  prompt: string;
  changeDraft: string;
  changes: Change[];
  progress: Progress;
}

export interface AudioMedia extends MediaBase {
  kind: 'audio';
  state: 'default' | 'trimming' | 'generating' | 'editing';
  fullDuration: number;
  trim: Range | null;
  pendingTrim: Range;
  current: number;
  playing: boolean;
  /** Details after the duration, e.g. "92 BPM · lo-fi". */
  tags: string;
}

export interface ImageMedia extends MediaBase {
  kind: 'image';
  state: 'default' | 'editing' | 'generating';
  src: string;
  filter: string | null;
  alt: string;
  /** The art before an applied edit swapped it (restored by Undo apply). */
  beforeSrc?: string;
}

export interface VideoMedia extends MediaBase {
  kind: 'video';
  state: 'default' | 'playing' | 'trimming' | 'editing' | 'generating';
  fullDuration: number;
  trim: Range | null;
  pendingTrim: Range;
  current: number;
  muted: boolean;
  /** Warm grade after an applied EditCard. */
  filter: string | null;
}

export interface Step {
  label: string;
  detail?: string;
}

export interface EditCardMedia {
  id: string;
  kind: 'edit';
  owner: CharacterId;
  targetId: string;
  targetKind: 'image' | 'video';
  status: 'working' | 'ready' | 'applied';
  percent: number;
  stepIndex: number;
  view: 'before' | 'after';
  steps: Step[];
  changes: Change[];
  /** Image edits: the proposed version. Defaults to the warm grade on the same art. */
  afterSrc?: string;
  afterFilter?: string;
}

export type Media = AudioMedia | ImageMedia | VideoMedia | EditCardMedia;
export type PlayableMedia = AudioMedia | VideoMedia;

export type ThreadItem =
  | { id: string; kind: 'day'; label: string }
  | { id: string; kind: 'system'; icon: 'user' | 'mute' | 'unmute'; text: string }
  | { id: string; kind: 'typing'; character: CharacterId }
  | { id: string; kind: 'message'; sender: Sender; text: string; time: string; mediaId?: string };

/** One conversation. The active chat's items, addressees and draft live at the top of ChatState. */
export interface ThreadData {
  id: string;
  title: string;
  /** "Yesterday", "Mon": shown in the chat list until the chat gets a message today. */
  dayLabel: string | null;
  unread: boolean;
  items: ThreadItem[];
  addressees: CharacterId[];
  draft: string;
  /** Characters in this chat; others join when @mentioned. */
  members: CharacterId[];
  /** Chats started from the new-chat flow remember their template (replies, art). */
  templateId?: string;
}

export interface ThreadContent {
  items: ThreadItem[];
  addressees: CharacterId[];
  draft: string;
}

export interface ChatState {
  chatId: string;
  threads: Record<string, ThreadData>;
  /** Chat list order, newest first for chats started here. */
  order: string[];
  items: ThreadItem[];
  media: Record<string, Media>;
  addressees: CharacterId[];
  muted: Record<CharacterId, boolean>;
  draft: string;
  picker: { open: boolean; query: string; index: number };
  ui: {
    chatsOpen: boolean;
    castOpen: boolean;
    toast: { id: number; message: string } | null;
    highlightId: string | null;
    shakeKey: number;
    /** Media whose edit field should take focus when it opens. */
    editFocus: string | null;
    /** Web layouts: the chats sidebar and the cast panel can be collapsed (remembered per viewer). */
    chatsCollapsed: boolean;
    castCollapsed: boolean;
    /** The new-chat flow is showing in the main pane. */
    newChat: boolean;
  };
  demo: { done: string[]; dismissed: boolean };
  /** Phone 390 preview from the demo card. */
  preview: 'fit' | 'phone';
}

/** Everything a media card can ask the store to do. The store provides it; the gallery passes no-ops. */
export interface MediaActions {
  togglePlay(id: string): void;
  seek(id: string, sec: number): void;
  toggleVideoMute(id: string): void;
  startTrim(id: string): void;
  setPendingTrim(id: string, range: Range): void;
  saveTrim(id: string): void;
  cancelTrim(id: string): void;
  startEdit(id: string): void;
  setChangeDraft(id: string, text: string): void;
  submitEdit(id: string): void;
  cancelEdit(id: string): void;
  regenerate(id: string): void;
  download(id: string): void;
  copyPrompt(id: string): void;
  toggleChange(mediaId: string, changeId: string): void;
  setEditView(id: string, view: 'before' | 'after'): void;
  applyEdit(id: string): void;
  undoApply(id: string): void;
  refine(id: string): void;
  openInEditor(): void;
}
