import { forwardRef, type ReactNode } from 'react';
import { Film, Image, Music } from 'lucide-react';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import s from './MediaCard.module.css';

const ICONS = { audio: Music, image: Image, video: Film };
const LABELS = { audio: 'Audio', image: 'Image', video: 'Video' };

interface MediaCardProps {
  kind: 'audio' | 'image' | 'video';
  title: string;
  details: string;
  highlight?: boolean;
  children: ReactNode;
}

export const MediaCard = forwardRef<HTMLElement, MediaCardProps>(function MediaCard({ kind, title, details, highlight, children }, ref) {
  return (
    <article
      ref={ref}
      role="group"
      aria-label={`${LABELS[kind]}: ${title}`}
      className={cx(s.root, kind === 'image' && s.image, highlight && s.highlight)}
    >
      <div className={s.meta}>
        <Icon icon={ICONS[kind]} size={16} className={s.icon} />
        <span className={`body_small_bold ${s.title}`}>{title}</span>
        <span className={`body_tiny ${s.details}`}>{details}</span>
      </div>
      {children}
    </article>
  );
});

/** The toolbar or edit slot under a card's body: a hairline above, 12 of space. */
export function CardSlot({ children }: { children: ReactNode }) {
  return <div className={s.slot}>{children}</div>;
}
