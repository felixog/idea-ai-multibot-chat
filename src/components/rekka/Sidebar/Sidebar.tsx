import type { ReactNode } from 'react';
import { PanelLeftClose, Plus, X } from 'lucide-react';
import { lastTime, previewLine } from '../../../features/chat/logic';
import { OTHER_CHATS, THREAD_TITLE } from '../../../features/chat/script';
import { useChat } from '../../../features/chat/store';
import { cx } from '../../../lib/cx';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { IconButton } from '../IconButton/IconButton';
import s from './Sidebar.module.css';

interface SidebarProps {
  /** In the mobile chats drawer: the close button and the drawer's title id. */
  onClose?: () => void;
  titleId?: string;
  /** The Try the prototype card, pinned to the bottom. */
  footer?: ReactNode;
  headerExtra?: ReactNode;
  /** Web layouts: collapse the sidebar. */
  onCollapse?: () => void;
}

export function Sidebar({ onClose, titleId, footer, headerExtra, onCollapse }: SidebarProps) {
  const chat = useChat();
  const other = () => {
    chat.toast('This prototype has one chat: Late trains teaser');
    onClose?.();
  };
  const Root = onClose ? 'div' : 'nav';
  return (
    <Root id={onClose ? undefined : 'chats-sidebar'} className={cx(s.root, onClose && s.inDrawer)} aria-label={onClose ? undefined : 'Chats'}>
      <div className={s.head}>
        <h2 id={titleId} className={`headline_3 ${s.title}`}>Chats</h2>
        <div className={s.headActions}>
          {headerExtra}
          <IconButton variant="secondary" size="sm" icon={Plus} label="Start a new chat" onClick={other} />
          {onCollapse && <IconButton variant="plain" size="sm" icon={PanelLeftClose} id="hide-chats-button" label="Hide chats" aria-expanded aria-controls="chats-sidebar" onClick={onCollapse} />}
          {onClose && <IconButton variant="plain" size="lg" icon={X} label="Close chats" onClick={onClose} />}
        </div>
      </div>
      <div className={s.list}>
        <ChatListItem title={THREAD_TITLE} time={lastTime(chat.state.items)} preview={previewLine(chat.state.items)} active onClick={() => onClose?.()} />
        {OTHER_CHATS.map((c) => (
          <ChatListItem key={c.id} title={c.title} time={c.time} preview={c.preview} active={false} onClick={other} />
        ))}
      </div>
      {footer && <div className={s.footer}>{footer}</div>}
    </Root>
  );
}
