import { CAST, type CharacterId } from '../../../features/chat/cast';
import { cx } from '../../../lib/cx';
import s from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  character: CharacterId;
  size: AvatarSize;
  /** Hide from assistive tech when the name is already next to it. */
  decorative?: boolean;
  muted?: boolean;
  className?: string;
}

export function Avatar({ character, size, decorative = false, muted = false, className }: AvatarProps) {
  const c = CAST[character];
  return (
    <span data-character={c.bot} className={cx(s.root, s[size], muted && s.muted, className)}>
      <img data-visual-mask className={s.img} src={c.avatar} alt={decorative ? '' : c.name} draggable={false} />
    </span>
  );
}

export function AvatarStack({ overlap = 'desktop' }: { overlap?: 'desktop' | 'mobile' }) {
  return (
    <span className={cx(s.stack, overlap === 'mobile' && s.stackMobile)}>
      <Avatar character="nova" size="md" decorative />
      <Avatar character="iris" size="md" decorative />
    </span>
  );
}
