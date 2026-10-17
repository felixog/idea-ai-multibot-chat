import { AppShell } from './components/rekka/AppShell/AppShell';
import Gallery from './features/gallery/Gallery';
import { ChatProvider } from './features/chat/store';
import { captureState, readCapture } from './features/chat/capture';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('gallery')) return <Gallery />;
  const capture = readCapture(params);
  return (
    <ChatProvider initial={capture ? () => captureState(capture) : undefined} frozen={!!capture}>
      <AppShell capture={!!capture} />
    </ChatProvider>
  );
}
