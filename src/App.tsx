import Gallery from './features/gallery/Gallery';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('gallery')) return <Gallery />;
  return <Gallery />;
}
