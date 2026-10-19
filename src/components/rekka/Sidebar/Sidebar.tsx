import type { ReactNode } from 'react';
import { Lightbulb, SquarePen, X } from 'lucide-react';
import { chatRows } from '../../../features/chat/logic';
import { CHAT_ORDER } from '../../../features/chat/script';
import { useChat } from '../../../features/chat/store';
import { cx } from '../../../lib/cx';
import { DEMO_HIDDEN_KEY, writeFlag } from '../../../lib/storage';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { DEMO_ROW_KEYS } from '../DemoCard/rows';
import { IconButton } from '../IconButton/IconButton';
import { NavItem } from '../NavItem/NavItem';
import s from './Sidebar.module.css';

export function Brand() {
  return <span className={`headline_3 ${s.brand}`}>Rex</span>;
}

interface SidebarProps {
  /** Mobile chats drawer: shows the brand row with a close button. */
  onClose?: () => void;
  /** The Try the prototype card, pinned to the bottom. */
  footer?: ReactNode;
}

/** Chats sidebar content: navigation rows, the chat list, and the demo card. The web shell frames it in a SidePanel. */
export function Sidebar({ onClose, footer }: SidebarProps) {
  const chat = useChat();
  const { demo } = chat.state;
  const doneCount = DEMO_ROW_KEYS.filter((k) => demo.done.includes(k)).length;
  const newChat = () => {
    chat.toast('New chats aren’t part of this prototype');
    onClose?.();
  };
  const toggleTips = () => {
    writeFlag(DEMO_HIDDEN_KEY, !demo.dismissed);
    chat.setDemoDismissed(!demo.dismissed);
  };
  return (
    <div className={cx(s.root, onClose && s.inDrawer)}>
      {onClose && (
        <div className={s.drawerHead}>
          <Brand />
          <IconButton variant="plain" size="lg" icon={X} label="Close chats" onClick={onClose} />
        </div>
      )}
      <div className={s.nav}>
        <NavItem icon={SquarePen} label="New chat" onClick={newChat} />
        <NavItem
          icon={Lightbulb}
          label="Try the prototype"
          aria-pressed={!demo.dismissed}
          onClick={toggleTips}
          trailing={
            <span className={`body_tiny tabular ${s.progress}`} aria-label={`${doneCount} of ${DEMO_ROW_KEYS.length} done`}>
              {doneCount}/{DEMO_ROW_KEYS.length}
            </span>
          }
        />
      </div>
      <section className={s.chats} aria-labelledby="chats-heading">
        <h2 id="chats-heading" className={`body_small_bold ${s.section}`}>Chats</h2>
        <div className={s.list}>
          {chatRows(chat.state, CHAT_ORDER).map((r) => (
            <ChatListItem key={r.id} title={r.title} time={r.time} preview={r.preview} active={r.active} unread={r.unread} onClick={() => chat.openChat(r.id)} />
          ))}
        </div>
      </section>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
