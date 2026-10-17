import { useRef, type ReactNode } from 'react';
import { THREAD_TITLE } from '../../../features/chat/script';
import { useChat } from '../../../features/chat/store';
import { useLayout } from '../../../lib/breakpoints';
import { cx } from '../../../lib/cx';
import { CastPanelContent } from '../CastPanelContent/CastPanelContent';
import { ChatThread } from '../ChatThread/ChatThread';
import { Composer, COMPOSER_INPUT_ID } from '../Composer/Composer';
import { Drawer } from '../Drawer/Drawer';
import { Sidebar } from '../Sidebar/Sidebar';
import { ThreadHeader } from '../ThreadHeader/ThreadHeader';
import { Toast } from '../Toast/Toast';
import s from './AppShell.module.css';

interface AppShellProps {
  capture?: boolean;
  /** The Try the prototype card for the sidebar or chats drawer. */
  demoCard?: ReactNode;
  sidebarExtra?: ReactNode;
  /** Overlay container when rendered inside the phone preview frame. */
  container?: HTMLElement | null;
}

export function AppShell({ capture = false, demoCard, sidebarExtra, container }: AppShellProps) {
  const chat = useChat();
  const layout = useLayout();
  const { ui, muted } = chat.state;
  const castTrigger = useRef<HTMLButtonElement>(null);
  const mobile = layout === 'mobile';

  const skip = (
    <a className={s.skip} href={`#${COMPOSER_INPUT_ID}`}>
      Skip to message box
    </a>
  );
  const toast = ui.toast && (
    <Toast key={ui.toast.id} message={ui.toast.message} onDismiss={chat.dismissToast} placement={mobile ? 'mobile' : 'desktop'} persistent={capture} />
  );

  if (mobile) {
    return (
      <div className={cx(s.mobileRoot, capture && s.capture)}>
        {skip}
        <ThreadHeader
          ref={castTrigger}
          layout="mobile"
          title={THREAD_TITLE}
          muted={muted}
          castOpen={ui.castOpen}
          onOpenCast={() => chat.setCastOpen(true)}
          onOpenChats={() => chat.setChatsOpen(true)}
        />
        <main className={s.mobileMain}>
          <ChatThread layout="mobile" capture={capture} />
          <div className={s.mobileDock}>
            <Composer layout="mobile" />
          </div>
        </main>
        <Drawer open={ui.chatsOpen} onOpenChange={chat.setChatsOpen} side="left" title="Chats" container={container}>
          <Sidebar onClose={() => chat.setChatsOpen(false)} footer={demoCard} headerExtra={sidebarExtra} />
        </Drawer>
        <Drawer open={ui.castOpen} onOpenChange={chat.setCastOpen} side="bottom" title="In this chat" container={container}>
          <CastPanelContent showTitle={false} />
        </Drawer>
        {toast}
      </div>
    );
  }

  return (
    <div className={cx(s.webRoot, capture && s.capture)}>
      {skip}
      <Sidebar footer={demoCard} headerExtra={sidebarExtra} />
      <main className={s.thread}>
        <ThreadHeader
          ref={castTrigger}
          layout="desktop"
          title={THREAD_TITLE}
          muted={muted}
          castOpen={ui.castOpen}
          onOpenCast={layout === 'web-collapsed' ? () => chat.setCastOpen(true) : undefined}
        />
        <ChatThread layout="desktop" capture={capture} />
        <div className={s.dock}>
          <div className={s.dockColumn}>
            <Composer layout="desktop" />
          </div>
        </div>
      </main>
      {layout === 'web' ? (
        <aside className={s.cast} aria-label="Cast">
          <CastPanelContent />
        </aside>
      ) : (
        <Drawer open={ui.castOpen} onOpenChange={chat.setCastOpen} side="right" title="In this chat" container={container}>
          <CastPanelContent showTitle />
        </Drawer>
      )}
      {toast}
    </div>
  );
}
