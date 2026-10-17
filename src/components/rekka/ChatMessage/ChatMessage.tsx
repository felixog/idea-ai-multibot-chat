import type { ReactNode } from 'react';
import { CAST } from '../../../features/chat/cast';
import type { Sender } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Avatar } from '../Avatar/Avatar';
import { CharacterTag } from '../CharacterTag/CharacterTag';
import s from './ChatMessage.module.css';

const MENTION = /(@(?:nova|iris|all)\b)/gi;

/** Renders @Nova, @Iris and @all with their identity underline. */
export function MessageText({ text }: { text: string }) {
  return (
    <>
      {text.split(MENTION).map((part, i) => {
        if (i % 2 === 0) return part;
        const key = part.slice(1).toLowerCase();
        if (key === 'all') return <span key={i} className={cx('body_bold', s.mention, s.mentionAll)}>{part}</span>;
        return (
          <span key={i} data-character={key === 'nova' ? 'bot-a' : 'bot-b'} className={cx('body_bold', s.mention)}>
            {part}
          </span>
        );
      })}
    </>
  );
}

interface ChatMessageProps {
  sender: Sender;
  showHeader: boolean;
  text?: string;
  time?: string;
  /** Replaces the text bubble's contents (the typing dots). */
  bubble?: ReactNode;
  media?: ReactNode;
  label?: string;
}

export function ChatMessage({ sender, showHeader, text = '', time, bubble, media, label }: ChatMessageProps) {
  if (sender === 'user') {
    return (
      <article className={s.user} aria-label={label ?? `You, ${time}`}>
        <p className={`body ${s.userBubble}`}>
          <MessageText text={text} />
        </p>
      </article>
    );
  }
  const c = CAST[sender];
  return (
    <article className={s.bot} data-character={c.bot} aria-label={label ?? `${c.name}, ${c.role}${time ? `, ${time}` : ''}`}>
      <div className={s.avatarCol}>{showHeader && <Avatar character={sender} size="md" decorative />}</div>
      <div className={s.body}>
        {showHeader && (
          <div className={s.header}>
            <span className={`body_small_bold ${s.name}`}>{c.name}</span>
            <CharacterTag character={sender} />
            {time && <span className={`body_tiny ${s.time}`}>{time}</span>}
          </div>
        )}
        <div className={`body ${s.bubble}`}>{bubble ?? <MessageText text={text} />}</div>
        {media && <div className={s.media}>{media}</div>}
      </div>
    </article>
  );
}
