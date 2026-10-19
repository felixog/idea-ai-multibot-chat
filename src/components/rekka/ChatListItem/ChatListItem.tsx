import { cx } from '../../../lib/cx';
import s from './ChatListItem.module.css';

interface ChatListItemProps {
  title: string;
  time: string;
  preview: string;
  active: boolean;
  unread?: boolean;
  onClick: () => void;
}

export function ChatListItem({ title, time, preview, active, unread = false, onClick }: ChatListItemProps) {
  return (
    <button type="button" className={cx(s.root, active && s.active, unread && s.unread)} aria-current={active ? 'page' : undefined} onClick={onClick}>
      <span className={s.top}>
        <span className={`body_small_bold ${s.title}`}>
          {title}
          {unread && <span className="visually-hidden">, new reply</span>}
        </span>
        <span className={s.metaRow}>
          {unread && <span className={s.dot} aria-hidden="true" />}
          <span className={`body_tiny ${s.meta}`}>{time}</span>
        </span>
      </span>
      <span className={`body_tiny ${s.meta} ${s.preview}`}>{preview}</span>
    </button>
  );
}
