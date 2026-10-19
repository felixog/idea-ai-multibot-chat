import { useEffect, useRef } from 'react';
import { AppShell } from './components/rekka/AppShell/AppShell';
import { DemoCard } from './components/rekka/DemoCard/DemoCard';
import { PhonePreview } from './components/rekka/PhonePreview/PhonePreview';
import Gallery from './features/gallery/Gallery';
import { captureState, readCapture } from './features/chat/capture';
import { seedState } from './features/chat/script';
import { ChatProvider, useChat } from './features/chat/store';
import { useLayout } from './lib/breakpoints';
import { CAST_COLLAPSED_KEY, CHATS_COLLAPSED_KEY, DEMO_HIDDEN_KEY, readFlag } from './lib/storage';

function Root({ capture, focusComposer }: { capture: boolean; focusComposer: boolean }) {
  const chat = useChat();
  const layout = useLayout();
  const firstLayout = useRef(layout);
  const { preview, demo } = chat.state;

  // Crossing a breakpoint ticks checklist row 6.
  useEffect(() => {
    if (layout !== firstLayout.current) chat.markDone('phone');
  }, [layout, chat]);

  // The Figma mentioning frames show the message box focused while "@I" is typed.
  useEffect(() => {
    if (focusComposer) document.getElementById('message-box')?.focus({ preventScroll: true });
  }, [focusComposer]);

  const card = (onNavigate?: () => void) => (capture || demo.dismissed ? undefined : <DemoCard onNavigate={onNavigate} />);

  if (preview === 'phone' && !capture) {
    return (
      <PhonePreview onBack={() => chat.setPreview('fit')}>
        {(frame) => <AppShell contained container={frame} demoCard={card(() => chat.setChatsOpen(false))} />}
      </PhonePreview>
    );
  }
  return <AppShell capture={capture} demoCard={card(layout === 'mobile' ? () => chat.setChatsOpen(false) : undefined)} />;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('gallery')) return <Gallery />;
  const capture = readCapture(params);
  const initial = capture
    ? () => captureState(capture)
    : () => {
        const s = seedState();
        return {
          ...s,
          demo: { ...s.demo, dismissed: readFlag(DEMO_HIDDEN_KEY) },
          ui: { ...s.ui, chatsCollapsed: readFlag(CHATS_COLLAPSED_KEY), castCollapsed: readFlag(CAST_COLLAPSED_KEY) },
        };
      };
  return (
    <ChatProvider initial={initial} frozen={!!capture}>
      <Root capture={!!capture} focusComposer={!!capture?.mentioning} />
    </ChatProvider>
  );
}
