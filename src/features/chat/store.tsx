import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { CAST, type CharacterId } from './cast';
import { isPlaying, mentionedIn, mentionOptions, queryAtCaret, type MentionKey } from './logic';
import { KEYWORDS, newEditCard, REPLIES, SEED_TRIM, seedState } from './script';
import { createSimulator, typingDelay } from './simulate';
import type { AudioMedia, ChatState, EditCardMedia, ImageMedia, Media, MediaActions, Range, ThreadItem, VideoMedia } from './types';
import { COVER_SRC, duration, WARM_FILTER } from '../../lib/media';
import { clockNow, mss, secs } from '../../lib/time';

type Updater = (s: ChatState) => ChatState;
const reducer = (s: ChatState, fn: Updater) => fn(s);

export type DemoKey = 'trim' | 'apply' | 'play' | 'mention' | 'mute' | 'phone';

export interface ChatApi extends MediaActions {
  state: ChatState;
  /** Draft changed in the composer; caret is the selection end after the change. */
  setDraft(text: string, caret: number): void;
  movePicker(delta: number): void;
  hoverPicker(index: number): void;
  closePicker(): void;
  /** Inserts the chosen mention at the caret. Returns the new caret position. */
  insertMention(key: MentionKey, caret: number): number;
  /** Inserts "@" at the caret and opens the picker. Returns the new caret position. */
  startMention(caret: number): number;
  removeAddressee(c: CharacterId): void;
  send(): void;
  toggleMute(c: CharacterId): void;
  toast(message: string): void;
  dismissToast(): void;
  setChatsOpen(open: boolean): void;
  setCastOpen(open: boolean): void;
  jumpTo(mediaId: string): void;
  registerEl(id: string): (el: HTMLElement | null) => void;
  markDone(key: DemoKey): void;
  setDemoDismissed(dismissed: boolean): void;
  setPreview(preview: 'fit' | 'phone'): void;
  downloadAll(): void;
  reset(): void;
}

const ChatContext = createContext<ChatApi | null>(null);

export function useChat(): ChatApi {
  const api = useContext(ChatContext);
  if (!api) throw new Error('useChat outside ChatProvider');
  return api;
}

let uidCounter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(uidCounter++).toString(36)}`;

function patchMedia<T extends Media = Media>(s: ChatState, id: string, patch: Partial<NoInfer<T>> | ((m: T) => Partial<NoInfer<T>>)): ChatState {
  const m = s.media[id] as T | undefined;
  if (!m) return s;
  const p = typeof patch === 'function' ? patch(m) : patch;
  return { ...s, media: { ...s.media, [id]: { ...m, ...p } } };
}

function pauseAll(s: ChatState, except?: string): ChatState {
  const media = { ...s.media };
  for (const [id, m] of Object.entries(media)) {
    if (id === except) continue;
    if (m.kind === 'audio' && m.playing) media[id] = { ...m, playing: false };
    if (m.kind === 'video' && m.state === 'playing') media[id] = { ...m, state: 'default' };
  }
  return { ...s, media };
}

function addItem(s: ChatState, item: ThreadItem): ChatState {
  return { ...s, items: [...s.items, item] };
}

function download(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface Reply {
  text: string;
  media?: Media;
  onLanded?: () => void;
}

interface Job {
  character: CharacterId;
  delay?: number;
  make: () => Reply;
}

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function ChatProvider({ children, initial, frozen = false }: { children: ReactNode; initial?: () => ChatState; frozen?: boolean }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial ?? seedState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const sim = useMemo(() => createSimulator(), []);
  sim.frozen = frozen;
  const queue = useRef<Job[]>([]);
  const busy = useRef(false);
  const rotation = useRef({ nova: 0, iris: 0, take: 2 });
  const els = useRef(new Map<string, HTMLElement>());
  const toastId = useRef(0);

  const update = useCallback((fn: Updater) => dispatch(fn), []);

  useEffect(() => () => sim.clearAll(), [sim]);

  const toast = useCallback((message: string) => update((s) => ({ ...s, ui: { ...s.ui, toast: { id: ++toastId.current, message } } })), [update]);
  const markDone = useCallback(
    (key: DemoKey) => update((s) => (s.demo.done.includes(key) ? s : { ...s, demo: { ...s.demo, done: [...s.demo.done, key] } })),
    [update],
  );

  // Reply engine: one reply at a time, each preceded by the typing indicator.
  const pump = useCallback(() => {
    if (busy.current) return;
    const job = queue.current.shift();
    if (!job) return;
    busy.current = true;
    const next = () => {
      busy.current = false;
      pump();
    };
    sim.after(job.delay ?? 0, () => {
      if (stateRef.current.muted[job.character]) return next();
      const typingId = uid('t');
      update((s) => addItem(s, { id: typingId, kind: 'typing', character: job.character }));
      sim.after(typingDelay(), () => {
        if (stateRef.current.muted[job.character]) {
          update((s) => ({ ...s, items: s.items.filter((i) => i.id !== typingId) }));
          return next();
        }
        const r = job.make();
        const msg: ThreadItem = { id: uid('i'), kind: 'message', sender: job.character, text: r.text, time: clockNow(), mediaId: r.media?.id };
        update((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === typingId ? msg : i)),
          media: r.media ? { ...s.media, [r.media.id]: r.media } : s.media,
        }));
        r.onLanded?.();
        sim.after(600, next);
      });
    });
  }, [sim, update]);

  const enqueue = useCallback(
    (job: Job) => {
      queue.current.push(job);
      pump();
    },
    [pump],
  );

  /** Media that arrives generating: step 2 active at 0, step 3 at half time, done at the end. */
  const runGeneration = useCallback(
    (id: string, total: number, done: (m: Media) => Partial<Media>) => {
      update((s) => patchMedia(s, id, { state: 'generating', progress: { percent: 33, stepIndex: 1 } } as Partial<Media>));
      sim.after(total / 2, () => update((s) => patchMedia<AudioMedia>(s, id, { progress: { percent: 66, stepIndex: 2 } })));
      sim.after(total, () => update((s) => patchMedia(s, id, (m) => ({ state: 'default', progress: { percent: 100, stepIndex: 3 }, ...done(m) }) as Partial<Media>)));
    },
    [sim, update],
  );

  const runEditCard = useCallback(
    (id: string) => {
      sim.after(1200, () => update((s) => patchMedia<EditCardMedia>(s, id, { percent: 33, stepIndex: 1 })));
      sim.after(2400, () => update((s) => patchMedia<EditCardMedia>(s, id, { percent: 66, stepIndex: 2 })));
      sim.after(3600, () => update((s) => patchMedia<EditCardMedia>(s, id, { percent: 100, stepIndex: 3, status: 'ready', view: 'after' })));
    },
    [sim, update],
  );

  const newMedia = useCallback(
    (kind: 'audio' | 'image' | 'video', owner: CharacterId): Media => {
      const take = rotation.current.take++;
      const base = { id: uid('m'), owner, version: 1, changeDraft: '', changes: [], progress: { percent: 33, stepIndex: 1 } };
      if (kind === 'image')
        return { ...base, kind, title: `Cover art, take ${take}`, prompt: 'Another direction for the cover: night train window, city lights, deep blue and amber', state: 'generating', src: COVER_SRC, filter: 'hue-rotate(14deg) saturate(1.1)' };
      if (kind === 'video')
        return { ...base, kind, title: `Teaser loop, take ${take}`, prompt: 'Six second loop of the window lights, rain streaks, seamless, 16:9', state: 'generating', fullDuration: 6, trim: null, pendingTrim: { start: 0, end: 6 }, current: 0, muted: false, filter: null };
      return { ...base, kind, title: `Late trains hook, take ${take}`, prompt: 'Lo-fi hook, 92 BPM, late trains and city lights, a new take', state: 'generating', fullDuration: 20, trim: null, pendingTrim: { start: 0, end: 20 }, current: 0, playing: false };
    },
    [],
  );

  const replyWithMedia = useCallback(
    (character: CharacterId, text: string, kind: 'audio' | 'image' | 'video') =>
      enqueue({
        character,
        make: () => {
          const media = newMedia(kind, character);
          return { text, media, onLanded: () => runGeneration(media.id, 3000, () => ({})) };
        },
      }),
    [enqueue, newMedia, runGeneration],
  );

  const api: ChatApi = useMemo(() => {
    const media = <T extends Media>(id: string) => stateRef.current.media[id] as T;
    const ownerName = (id: string) => CAST[stateRef.current.media[id].owner].name;

    const setState = (fn: Updater) => update(fn);

    const actions: ChatApi = {
      get state() {
        return stateRef.current;
      },

      // Composer and mentions
      setDraft(text, caret) {
        const q = queryAtCaret(text, caret);
        setState((s) => ({
          ...s,
          draft: text,
          picker: q === null ? { open: false, query: '', index: 0 } : { open: true, query: q, index: s.picker.open && s.picker.query === q ? s.picker.index : 0 },
        }));
      },
      movePicker(delta) {
        setState((s) => {
          const n = Math.max(1, mentionOptions(s).length);
          return { ...s, picker: { ...s.picker, index: (s.picker.index + delta + n) % n } };
        });
      },
      hoverPicker(index) {
        setState((s) => ({ ...s, picker: { ...s.picker, index } }));
      },
      closePicker() {
        setState((s) => ({ ...s, picker: { open: false, query: '', index: 0 } }));
      },
      insertMention(key, caret) {
        const s = stateRef.current;
        const name = key === 'all' ? 'all' : CAST[key].name;
        const before = s.draft.slice(0, caret).replace(/@([^\s@]*)$/, `@${name} `);
        const text = before + s.draft.slice(caret).replace(/^\s+/, '');
        const unmute = key !== 'all' && s.muted[key];
        setState((st) => {
          let next: ChatState = { ...st, draft: text, picker: { open: false, query: '', index: 0 }, addressees: mentionedIn(text) };
          if (unmute) {
            next = { ...next, muted: { ...next.muted, [key]: false } };
            next = addItem(next, { id: uid('s'), kind: 'system', icon: 'unmute', text: `${CAST[key].name} is back` });
          }
          return next;
        });
        if (unmute) toast(`${CAST[key].name} unmuted`);
        if (key === 'iris' || key === 'all') markDone('mention');
        return before.length;
      },
      startMention(caret) {
        const s = stateRef.current;
        const pre = s.draft.slice(0, caret);
        const insert = pre === '' || /\s$/.test(pre) ? '@' : ' @';
        const text = pre + insert + s.draft.slice(caret);
        setState((st) => ({ ...st, draft: text, picker: { open: true, query: '', index: 0 } }));
        return pre.length + insert.length;
      },
      removeAddressee(c) {
        const s = stateRef.current;
        if (s.addressees.length <= 1) {
          setState((st) => ({ ...st, ui: { ...st.ui, shakeKey: st.ui.shakeKey + 1 } }));
          toast('Pick at least one character to reply');
          return;
        }
        setState((st) => ({ ...st, addressees: st.addressees.filter((a) => a !== c) }));
      },
      send() {
        const s = stateRef.current;
        const text = s.draft.trim();
        if (!text) return;
        const named = mentionedIn(text);
        const addressees = named.length ? named : s.addressees;
        setState((st) =>
          addItem({ ...st, draft: '', picker: { open: false, query: '', index: 0 }, addressees }, { id: uid('i'), kind: 'message', sender: 'user', text, time: clockNow() }),
        );
        if (/@(iris|all)\b/i.test(text)) markDone('mention');
        const responders = (['nova', 'iris'] as CharacterId[]).filter((c) => addressees.includes(c) && !s.muted[c]);
        for (const c of responders) {
          if (c === 'iris' && KEYWORDS.cover.test(text)) replyWithMedia('iris', REPLIES.newCover, 'image');
          else if (c === 'iris' && KEYWORDS.loop.test(text)) replyWithMedia('iris', REPLIES.newLoop, 'video');
          else if (c === 'nova' && KEYWORDS.hook.test(text)) replyWithMedia('nova', REPLIES.newHook, 'audio');
          else
            enqueue({
              character: c,
              make: () => {
                const lines = REPLIES[c];
                return { text: lines[rotation.current[c]++ % lines.length] };
              },
            });
        }
      },

      // Cast
      toggleMute(c) {
        const s = stateRef.current;
        const muting = !s.muted[c];
        setState((st) => {
          let addressees = st.addressees;
          if (muting) {
            addressees = addressees.filter((a) => a !== c);
            if (addressees.length === 0) addressees = [c === 'nova' ? 'iris' : 'nova'];
          }
          return addItem(
            { ...st, muted: { ...st.muted, [c]: muting }, addressees },
            muting
              ? { id: uid('s'), kind: 'system', icon: 'mute', text: `${CAST[c].name} is muted and won't reply` }
              : { id: uid('s'), kind: 'system', icon: 'unmute', text: `${CAST[c].name} is back` },
          );
        });
        if (muting) markDone('mute');
      },

      // UI
      toast,
      dismissToast() {
        setState((s) => ({ ...s, ui: { ...s.ui, toast: null } }));
      },
      setChatsOpen(open) {
        setState((s) => ({ ...s, ui: { ...s.ui, chatsOpen: open } }));
      },
      setCastOpen(open) {
        setState((s) => ({ ...s, ui: { ...s.ui, castOpen: open } }));
      },
      registerEl(id) {
        return (el) => {
          if (el) els.current.set(id, el);
          else els.current.delete(id);
        };
      },
      jumpTo(mediaId) {
        setState((s) => ({ ...s, ui: { ...s.ui, highlightId: mediaId, castOpen: false } }));
        // Wait a frame so a closing sheet releases scroll lock before scrolling.
        window.setTimeout(() => {
          els.current.get(mediaId)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
        }, 220);
        sim.after(1400, () => setState((s) => (s.ui.highlightId === mediaId ? { ...s, ui: { ...s.ui, highlightId: null } } : s)));
      },
      markDone,
      setDemoDismissed(dismissed) {
        setState((s) => ({ ...s, demo: { ...s.demo, dismissed } }));
      },
      setPreview(preview) {
        setState((s) => ({ ...s, preview }));
        if (preview === 'phone') markDone('phone');
      },
      downloadAll() {
        toast('Downloading 3 files');
        ['/assets/cover-late-trains.svg', '/assets/poster-teaser-loop.svg', '/assets/avatar-nova.svg'].forEach((u, i) =>
          window.setTimeout(() => download(u, u.split('/').pop() ?? 'file.svg'), i * 250),
        );
      },
      reset() {
        sim.clearAll();
        queue.current = [];
        busy.current = false;
        rotation.current = { nova: 0, iris: 0, take: 2 };
        const dismissed = stateRef.current.demo.dismissed;
        const preview = stateRef.current.preview;
        setState(() => {
          const s = seedState();
          return { ...s, demo: { ...s.demo, dismissed }, preview };
        });
      },

      // Media
      togglePlay(id) {
        const m = media<AudioMedia | VideoMedia>(id);
        if (m.kind === 'audio') {
          setState((s) =>
            m.playing ? patchMedia<AudioMedia>(s, id, { playing: false }) : patchMedia<AudioMedia>(pauseAll(s, id), id, (a) => ({ playing: true, current: a.current >= duration(a) ? 0 : a.current })),
          );
        } else if (m.state === 'playing') {
          setState((s) => patchMedia<VideoMedia>(s, id, { state: 'default' }));
        } else if (m.state === 'default') {
          setState((s) => patchMedia<VideoMedia>(pauseAll(s, id), id, { state: 'playing' }));
          markDone('play');
        }
      },
      seek(id, sec) {
        setState((s) => patchMedia<AudioMedia | VideoMedia>(s, id, (m) => ({ current: Math.min(Math.max(0, sec), duration(m)) })));
      },
      toggleVideoMute(id) {
        setState((s) => patchMedia<VideoMedia>(s, id, (m) => ({ muted: !m.muted })));
      },
      startTrim(id) {
        setState((s) =>
          patchMedia<AudioMedia | VideoMedia>(pauseAll(s), id, (m) => ({ state: 'trimming', current: 0, pendingTrim: m.trim ?? m.pendingTrim }) as Partial<AudioMedia | VideoMedia>),
        );
      },
      setPendingTrim(id, range: Range) {
        setState((s) => patchMedia<AudioMedia | VideoMedia>(s, id, { pendingTrim: range }));
      },
      saveTrim(id) {
        const m = media<AudioMedia | VideoMedia>(id);
        const r = m.pendingTrim;
        const len = r.end - r.start;
        const change =
          m.kind === 'audio'
            ? { id: uid('c'), icon: 'scissors' as const, title: `Trimmed to ${mss(r.start)} to ${mss(r.end)}`, detail: `${secs(len)}s kept from the ${secs(m.fullDuration)}s hook`, tone: 'user' as const, undone: false }
            : { id: uid('c'), icon: 'scissors' as const, title: `Trimmed to ${secs(len)}s`, detail: `${mss(r.start, true)} to ${mss(r.end, true)}`, tone: 'user' as const, undone: false };
        setState((s) =>
          patchMedia<AudioMedia | VideoMedia>(s, id, (x) => ({
            state: 'default',
            trim: { ...r },
            current: 0,
            changes: [...x.changes.filter((c) => c.icon !== 'scissors' || c.tone !== 'user'), change],
          }) as Partial<AudioMedia | VideoMedia>),
        );
        if (m.kind === 'audio') {
          markDone('trim');
          enqueue({ character: m.owner, make: () => ({ text: REPLIES.saveHookTrim }) });
        }
      },
      cancelTrim(id) {
        setState((s) => patchMedia<AudioMedia | VideoMedia>(s, id, (m) => ({ state: 'default', pendingTrim: m.trim ?? m.pendingTrim }) as Partial<AudioMedia | VideoMedia>));
      },
      startEdit(id) {
        setState((s) => patchMedia({ ...pauseAll(s), ui: { ...s.ui, editFocus: id } }, id, { state: 'editing' } as Partial<Media>));
      },
      setChangeDraft(id, text) {
        setState((s) => patchMedia<AudioMedia | ImageMedia | VideoMedia>(s, id, { changeDraft: text }));
      },
      submitEdit(id) {
        const m = media<AudioMedia | ImageMedia | VideoMedia>(id);
        if (!m.changeDraft.trim()) return;
        setState((s) => patchMedia(s, id, { state: 'default' } as Partial<Media>));
        if (m.kind === 'audio') {
          enqueue({
            character: m.owner,
            make: () => ({
              text: REPLIES.hookEdit,
              onLanded: () => runGeneration(id, 2400, (x) => ({ version: (x as AudioMedia).version + 1 }) as Partial<Media>),
            }),
          });
          return;
        }
        const kind = m.kind;
        enqueue({
          character: m.owner,
          make: () => {
            const card = newEditCard(uid('e'), m.owner, id, kind);
            return { text: kind === 'image' ? REPLIES.coverEdit : REPLIES.loopEdit, media: card, onLanded: () => runEditCard(card.id) };
          },
        });
      },
      cancelEdit(id) {
        setState((s) => patchMedia(s, id, { state: 'default' } as Partial<Media>));
      },
      regenerate(id) {
        const name = ownerName(id);
        setState((s) => pauseAll(s));
        runGeneration(id, 2400, (m) => ({ version: (m as AudioMedia).version + 1, current: 0 }) as Partial<Media>);
        sim.after(2400, () => toast(`${name} made a new version`));
      },
      download(id) {
        const m = media<AudioMedia | ImageMedia | VideoMedia>(id);
        if (m.kind === 'audio') return toast('Audio files aren’t part of this prototype');
        toast(`Downloading ${m.title}`);
        const url = m.kind === 'image' ? m.src : '/assets/poster-teaser-loop.svg';
        download(url, url.split('/').pop() ?? 'file.svg');
      },
      copyPrompt() {
        toast('Prompt copied');
      },
      toggleChange(mediaId, changeId) {
        const m = media(mediaId);
        const change = m.changes.find((c) => c.id === changeId);
        if (!change) return;
        const undone = !change.undone;
        setState((s) =>
          patchMedia(s, mediaId, (x) => {
            const changes = x.changes.map((c) => (c.id === changeId ? { ...c, undone } : c));
            if ((x.kind === 'audio' || x.kind === 'video') && change.icon === 'scissors' && change.tone === 'user') {
              return { changes, current: 0, trim: undone ? null : { ...x.pendingTrim } } as Partial<Media>;
            }
            return { changes } as Partial<Media>;
          }),
        );
      },
      setEditView(id, view) {
        setState((s) => patchMedia<EditCardMedia>(s, id, { view }));
      },
      applyEdit(id) {
        const e = media<EditCardMedia>(id);
        setState((s) => {
          let next = patchMedia<EditCardMedia>(s, id, { status: 'applied', view: 'after' });
          next =
            e.targetKind === 'image'
              ? patchMedia<ImageMedia>(next, e.targetId, (t) => ({ filter: WARM_FILTER, version: t.version + 1, state: 'default' }))
              : patchMedia<VideoMedia>(next, e.targetId, (t) => ({ trim: { ...SEED_TRIM.loop }, pendingTrim: { ...SEED_TRIM.loop }, filter: WARM_FILTER, version: t.version + 1, current: 0, state: 'default' }));
          return next;
        });
        markDone('apply');
        if (e.targetKind === 'image') enqueue({ character: 'nova', delay: 1500, make: () => ({ text: REPLIES.coverApplied }) });
      },
      undoApply(id) {
        const e = media<EditCardMedia>(id);
        setState((s) => {
          let next = patchMedia<EditCardMedia>(s, id, { status: 'ready' });
          next =
            e.targetKind === 'image'
              ? patchMedia<ImageMedia>(next, e.targetId, (t) => ({ filter: null, version: Math.max(1, t.version - 1) }))
              : patchMedia<VideoMedia>(next, e.targetId, (t) => ({ trim: null, filter: null, version: Math.max(1, t.version - 1), current: 0 }));
          return next;
        });
        toast('Back to v1');
      },
      refine(id) {
        const e = media<EditCardMedia>(id);
        setState((s) => patchMedia({ ...pauseAll(s), ui: { ...s.ui, editFocus: e.targetId } }, e.targetId, { state: 'editing' } as Partial<Media>));
        window.setTimeout(() => els.current.get(e.targetId)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' }), 50);
      },
      openInEditor() {
        toast('The full editor isn’t part of this prototype');
      },
    };
    return actions;
  }, [enqueue, markDone, replyWithMedia, runEditCard, runGeneration, sim, toast, update]);

  // Playback: one 100ms tick while anything plays.
  const anyPlaying = Object.values(state.media).some(isPlaying);
  useEffect(() => {
    if (!anyPlaying) return;
    return sim.every(100, () =>
      update((s) => {
        const media = { ...s.media };
        for (const [id, m] of Object.entries(media)) {
          if (m.kind === 'audio' && m.playing) {
            const t = m.current + 0.1;
            media[id] = t >= duration(m) ? { ...m, playing: false, current: 0 } : { ...m, current: t };
          } else if (m.kind === 'video' && m.state === 'playing') {
            const t = m.current + 0.1;
            media[id] = { ...m, current: t >= duration(m) ? 0 : t };
          }
        }
        return { ...s, media };
      }),
    );
  }, [anyPlaying, sim, update]);

  const value = useMemo(() => ({ ...api, state }), [api, state]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

