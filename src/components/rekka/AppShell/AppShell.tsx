import { useEffect, useRef, type ReactNode } from 'react';
import { THREAD_TITLE } from '../../../features/chat/script';
import { useChat } from '../../../features/chat/store';
import { useLayout } from '../../../lib/breakpoints';
import { cx } from '../../../lib/cx';
import { modAria, modKey, SHORTCUTS } from '../../../lib/shortcuts';
import { CastPanelContent } from '../CastPanelContent/CastPanelContent';
import { ChatThread } from '../ChatThread/ChatThread';
import { Composer, COMPOSER_INPUT_ID } from '../Composer/Composer';
import { Drawer } from '../Drawer/Drawer';
import { NewChatView } from '../NewChatView/NewChatView';
import { CastRail, type CastTarget } from '../CastRail/CastRail';
import { SidePanel } from '../SidePanel/SidePanel';
import { Brand, Sidebar } from '../Sidebar/Sidebar';
import { SidebarRail } from '../SidebarRail/SidebarRail';
import { ThreadHeader } from '../ThreadHeader/ThreadHeader';
import { Toast } from '../Toast/Toast';
import s from './AppShell.module.css';

interface AppShellProps {
  capture?: boolean;
  /** The Try the prototype card for the sidebar or chats drawer. */
  demoCard?: ReactNode;
  /** Overlay container when rendered inside the phone preview frame. */
  container?: HTMLElement | null;
  /** Fill the parent (phone preview) instead of the viewport. */
  contained?: boolean;
}

export function AppShell({ capture = false, demoCard, container, contained = false }: AppShellProps) {
  const chat = useChat();
  const layout = useLayout();
  const { ui, muted } = chat.state;
  const castTrigger = useRef<HTMLButtonElement>(null);
  const mobile = layout === 'mobile';
  const thread = chat.state.threads[chat.state.chatId];
  const newChat = ui.newChat;
  const title = newChat ? 'New chat' : (thread?.title ?? THREAD_TITLE);
  const headerExtras = newChat ? { subtitle: 'Pick a project, a cast and a brief' } : { members: thread?.members };

  const skip = (
    <a className={s.skip} href={`#${COMPOSER_INPUT_ID}`}>
      Skip to message box
    </a>
  );
  const toast = ui.toast && (
    <Toast key={ui.toast.id} message={ui.toast.message} onDismiss={chat.dismissToast} placement={mobile ? 'mobile' : 'desktop'} persistent={capture} />
  );

  // 1024 to 1279: the cast is always a rail and opens as a drawer.
  const castRailOnly = layout === 'web-collapsed';
  const toggleChats = () => chat.setChatsCollapsed(!chat.state.ui.chatsCollapsed);
  const toggleCast = () => (castRailOnly ? chat.setCastOpen(true) : chat.setCastCollapsed(!chat.state.ui.castCollapsed));

  /** From the cast rail: open the panel (or drawer) and move focus to what was clicked. */
  const openCast = (target: CastTarget) => {
    if (castRailOnly) chat.setCastOpen(true);
    else chat.setCastCollapsed(false);
    window.setTimeout(() => {
      const el =
        target === 'made'
          ? document.querySelector<HTMLElement>('[aria-labelledby="made-heading"] li button')
          : document.querySelector<HTMLElement>(`#cast-card-${target} button`);
      el?.scrollIntoView({ block: 'nearest' });
      el?.focus();
    }, castRailOnly ? 260 : 60);
  };

  // ⌘/Ctrl+B toggles the chats sidebar, ⌘/Ctrl+. the cast (web layouts).
  const shortcuts = useRef({ toggleChats, toggleCast });
  shortcuts.current = { toggleChats, toggleCast };
  useEffect(() => {
    if (mobile || capture) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey) return;
      if (e.key.toLowerCase() === SHORTCUTS.chats.toLowerCase()) {
        e.preventDefault();
        shortcuts.current.toggleChats();
      } else if (e.key === SHORTCUTS.cast) {
        e.preventDefault();
        shortcuts.current.toggleCast();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobile, capture]);

  if (mobile) {
    return (
      <div className={cx(s.mobileRoot, 'is-small', contained && s.contained, capture && s.figmaDock)}>
        {skip}
        <ThreadHeader
          ref={castTrigger}
          layout="mobile"
          title={title}
          {...headerExtras}
          muted={muted}
          castOpen={ui.castOpen}
          onOpenCast={() => chat.setCastOpen(true)}
          onOpenChats={() => chat.setChatsOpen(true)}
        />
        <main className={s.mobileMain}>
          {newChat ? (
            <NewChatView />
          ) : (
            <>
              <ChatThread key={chat.state.chatId} layout="mobile" />
              <div className={s.mobileDock}>
                <Composer layout="mobile" />
              </div>
            </>
          )}
        </main>
        <Drawer open={ui.chatsOpen} onOpenChange={chat.setChatsOpen} side="left" title="Chats" container={container}>
          <Sidebar onClose={() => chat.setChatsOpen(false)} footer={demoCard} />
        </Drawer>
        <Drawer open={ui.castOpen} onOpenChange={chat.setCastOpen} side="bottom" title="In this chat" container={container}>
          <CastPanelContent showTitle={false} />
        </Drawer>
        {toast}
      </div>
    );
  }

  return (
    <div className={cx(s.webRoot, capture && s.capture, contained && s.contained)}>
      {skip}
      <SidePanel
        side="left"
        as="nav"
        label="Chats"
        title={<Brand />}
        collapsed={ui.chatsCollapsed}
        onToggle={toggleChats}
        toggleLabel={{ show: 'Show chats', hide: 'Hide chats' }}
        shortcut={{ display: modKey(SHORTCUTS.chats), aria: modAria(SHORTCUTS.chats) }}
        rail={<SidebarRail onExpand={() => chat.setChatsCollapsed(false)} />}
      >
        <Sidebar footer={demoCard} />
      </SidePanel>
      <main className={s.thread}>
        <ThreadHeader
          ref={castTrigger}
          layout="desktop"
          title={title}
          {...headerExtras}
          muted={muted}
          castOpen={ui.castOpen}
          onOpenCast={castRailOnly ? () => chat.setCastOpen(true) : undefined}
        />
        {newChat ? (
          <NewChatView />
        ) : (
          <>
            <ChatThread key={chat.state.chatId} layout="desktop" capture={capture} />
            <div className={s.dock}>
              <div className={s.dockColumn}>
                <Composer layout="desktop" />
              </div>
            </div>
          </>
        )}
      </main>
      <SidePanel
        side="right"
        as="aside"
        label="Cast"
        title={<h2 className="headline_3">In this chat</h2>}
        collapsed={castRailOnly || ui.castCollapsed}
        railOnly={castRailOnly}
        onToggle={toggleCast}
        toggleLabel={castRailOnly ? { show: 'Open cast', hide: 'Open cast' } : { show: 'Show cast', hide: 'Hide cast' }}
        shortcut={{ display: modKey(SHORTCUTS.cast), aria: modAria(SHORTCUTS.cast) }}
        rail={<CastRail onOpen={openCast} />}
      >
        <CastPanelContent showTitle={false} />
      </SidePanel>
      {castRailOnly && (
        <Drawer open={ui.castOpen} onOpenChange={chat.setCastOpen} side="right" title="In this chat" container={container}>
          <CastPanelContent showTitle />
        </Drawer>
      )}
      {toast}
    </div>
  );
}
