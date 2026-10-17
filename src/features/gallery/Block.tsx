import type { ReactNode } from 'react';
import s from './Gallery.module.css';

export function Block({ title, node, children, col = false }: { title: string; node?: string; children: ReactNode; col?: boolean }) {
  return (
    <section className={s.block} data-gallery={title}>
      <h2 className="body_small_bold">
        {title} {node && <span className={`body_tiny ${s.label}`}>Figma {node}</span>}
      </h2>
      <div className={col ? s.col : s.row}>{children}</div>
    </section>
  );
}
