import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CAST } from '../../../features/chat/cast';
import { showsHeader } from '../../../features/chat/logic';
import { useChat } from '../../../features/chat/store';
import type { ImageMedia, ThreadItem, VideoMedia } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Button } from '../Button/Button';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { DayDivider } from '../DayDivider/DayDivider';
import { EditCard } from '../EditCard/EditCard';
import { MediaAudio } from '../MediaAudio/MediaAudio';
import { MediaImage } from '../MediaImage/MediaImage';
import { MediaVideo } from '../MediaVideo/MediaVideo';
import { SystemLine } from '../SystemLine/SystemLine';
import { TypingDots } from '../TypingIndicator/TypingIndicator';
import s from './ChatThread.module.css';

function MessageMedia({ mediaId }: { mediaId: string }) {
  const chat = useChat();
  const m = chat.state.media[mediaId];
  if (!m) return null;
  const ref = chat.registerEl(mediaId);
  const highlight = chat.state.ui.highlightId === mediaId;
  if (m.kind === 'audio') return <MediaAudio ref={ref} media={m} actions={chat} highlight={highlight} />;
  if (m.kind === 'image') return <MediaImage ref={ref} media={m} actions={chat} highlight={highlight} autoFocusEdit={chat.state.ui.editFocus === m.id} />;
  if (m.kind === 'video') return <MediaVideo ref={ref} media={m} actions={chat} highlight={highlight} filter={m.filter} />;
  const target = chat.state.media[m.targetId] as ImageMedia | VideoMedia;
  return <EditCard ref={ref} media={m} target={target} actions={chat} />;
}

function Item({ item, items, index, fill }: { item: ThreadItem; items: ThreadItem[]; index: number; fill: boolean }) {
  switch (item.kind) {
    case 'day':
      return <DayDivider label={item.label} />;
    case 'system':
      return <SystemLine icon={item.icon} text={item.text} />;
    case 'typing':
      return <ChatMessage sender={item.character} showHeader bubble={<TypingDots character={item.character} />} label={`${CAST[item.character].name} is typing`} fill={fill} />;
    case 'message':
      return (
        <ChatMessage
          sender={item.sender}
          showHeader={showsHeader(items, index)}
          text={item.text}
          time={item.time}
          fill={fill}
          media={item.mediaId ? <MessageMedia mediaId={item.mediaId} /> : undefined}
        />
      );
  }
}

const NEAR_BOTTOM = 120;

export function ChatThread({ layout, capture = false }: { layout: 'desktop' | 'mobile'; capture?: boolean }) {
  const chat = useChat();
  const { items } = chat.state;
  const list = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const count = useRef(items.length);
  const [unseen, setUnseen] = useState(false);

  // Open at the newest message.
  useLayoutEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    const el = list.current;
    if (!el || items.length === count.current) return;
    const grew = items.length > count.current;
    count.current = items.length;
    if (!grew) return;
    if (nearBottom.current) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    else setUnseen(true);
  }, [items.length]);

  return (
    <div className={s.wrap}>
      <div
        ref={list}
        className={cx(s.list, layout === 'mobile' && s.mobile, capture && s.capture)}
        role="log"
        aria-live="polite"
        aria-label="Messages"
        tabIndex={-1}
        onScroll={(e) => {
          const el = e.currentTarget;
          nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
          if (nearBottom.current && unseen) setUnseen(false);
        }}
      >
        <div className={s.column}>
          {items.map((item, i) => (
            <Item key={item.id} item={item} items={items} index={i} fill={false} />
          ))}
        </div>
      </div>
      {unseen && (
        <div className={s.pill}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
              setUnseen(false);
            }}
          >
            New messages
          </Button>
        </div>
      )}
    </div>
  );
}
