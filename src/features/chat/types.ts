import type { CharacterId } from './cast';

export type { CharacterId };
export type Sender = 'user' | CharacterId;

export type ChangeIcon = 'scissors' | 'sparkles' | 'droplets' | 'repeat';

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
}

export interface ImageMedia extends MediaBase {
  kind: 'image';
  state: 'default' | 'editing' | 'generating';
  src: string;
  filter: string | null;
}

export interface VideoMedia extends MediaBase {
  kind: 'video';
  state: 'default' | 'playing' | 'trimming' | 'editing' | 'generating';
  fullDuration: number;
  trim: Range | null;
  pendingTrim: Range;
  current: number;
  muted: boolean;
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
}

export type Media = AudioMedia | ImageMedia | VideoMedia | EditCardMedia;
export type PlayableMedia = AudioMedia | VideoMedia;

export type ThreadItem =
  | { id: string; kind: 'day'; label: string }
  | { id: string; kind: 'system'; icon: 'user' | 'mute' | 'unmute'; text: string }
  | { id: string; kind: 'typing'; character: CharacterId }
  | { id: string; kind: 'message'; sender: Sender; text: string; time: string; mediaId?: string };

export interface ChatState {
  items: ThreadItem[];
  media: Record<string, Media>;
  addressees: CharacterId[];
  muted: Record<CharacterId, boolean>;
  draft: string;
  picker: { open: boolean; query: string; index: number };
  ui: {
    chatsOpen: boolean;
    castOpen: boolean;
    toast: { id: number; message: string; action?: { label: string; kind: 'redo-apply' } } | null;
    highlightId: string | null;
    shakeKey: number;
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
