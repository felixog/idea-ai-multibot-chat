import type { ReactNode } from 'react';
import { Lightbulb, SquarePen, X } from 'lucide-react';
import { lastTime, previewLine } from '../../../features/chat/logic';
import { OTHER_CHATS, THREAD_TITLE } from '../../../features/chat/script';
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
  const other = () => {
    chat.toast('This prototype has one chat: Late trains teaser');
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
        <NavItem icon={SquarePen} label="New chat" onClick={other} />
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
          <ChatListItem title={THREAD_TITLE} time={lastTime(chat.state.items)} preview={previewLine(chat.state.items)} active onClick={() => onClose?.()} />
          {OTHER_CHATS.map((c) => (
            <ChatListItem key={c.id} title={c.title} time={c.time} preview={c.preview} active={false} onClick={other} />
          ))}
        </div>
      </section>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
