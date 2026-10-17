import { CAST } from './features/chat/cast';
import styles from './App.module.css';

const SWATCHES = [
  '--backgroundElevation0', '--backgroundElevation1', '--backgroundElevation_Alt', '--backgroundElevation_Alt200',
  '--backgroundElevation_Alt300', '--backgroundBrand', '--backgroundAction_Default', '--backgroundAction_onBrand_dark',
  '--backgroundDark', '--oceanicMain', '--goldMain',
];

export default function App() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h1 className="headline_1">Rekka foundations</h1>
        <p className={`body_tiny ${styles.muted}`}>Phase 1 specimen. The chat replaces this page in phase 4.</p>
      </section>
      <section className={styles.section}>
        <h2 className="headline_3">Type</h2>
        <p className="headline_3">Late trains teaser</p>
        <p className="body_bold">Body bold, DM Sans 700</p>
        <p className="body">Chorus idea: late trains, city lights, feeling far from home.</p>
        <p className="body_small_bold">Small bold, names and titles</p>
        <p className="body_small">Small, menu items and prompts</p>
        <p className="body_tiny tabular">Tiny 21:06 · 0:20 · 92 BPM · lo-fi</p>
        <p className="quote_body">Nova makes the music. Iris makes the visuals.</p>
      </section>
      <section className={styles.section}>
        <h2 className="headline_3">Colour</h2>
        <div className={styles.swatches}>
          {SWATCHES.map((name) => (
            <span key={name} className={styles.swatch} style={{ background: `var(${name})` }} title={name} />
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2 className="headline_3">Assets</h2>
        <div className={styles.avatars}>
          {Object.values(CAST).map((c) => (
            <img key={c.id} data-character={c.bot} className={styles.avatar} src={c.avatar} alt={c.name} />
          ))}
          <img className={styles.art} src="/assets/cover-late-trains.svg" alt="Cover art: a rainy night train window looking out on city lights in blue and amber" />
          <img className={styles.art} src="/assets/poster-teaser-loop.svg" alt="Teaser loop poster" />
        </div>
      </section>
    </main>
  );
}
