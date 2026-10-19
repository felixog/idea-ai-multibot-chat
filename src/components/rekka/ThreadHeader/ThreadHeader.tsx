import { forwardRef } from 'react';
import { Menu } from 'lucide-react';
import { CAST, type CharacterId } from '../../../features/chat/cast';
import { cx } from '../../../lib/cx';
import { AvatarStack } from '../Avatar/Avatar';
import { IconButton } from '../IconButton/IconButton';
import s from './ThreadHeader.module.css';

interface ThreadHeaderProps {
  layout: 'desktop' | 'mobile';
  title: string;
  muted: Record<CharacterId, boolean>;
  /** When set, the avatar stack is a button that opens the cast. */
  onOpenCast?: () => void;
  onOpenChats?: () => void;
  castOpen?: boolean;
  /** Who is in this chat (defaults to both). */
  members?: CharacterId[];
  /** Replaces the computed subtitle (the new-chat flow). */
  subtitle?: string;
}

export const ThreadHeader = forwardRef<HTMLButtonElement, ThreadHeaderProps>(function ThreadHeader(
  { layout, title, muted, onOpenCast, onOpenChats, castOpen, members = ['nova', 'iris'], subtitle: subtitleOverride },
  castTriggerRef,
) {
  const mutedNames = (Object.keys(muted) as CharacterId[]).filter((c) => muted[c]).map((c) => CAST[c].name);
  const names = members.map((c) => CAST[c].name);
  const who = names.length === 2 ? `You, ${names[0]} and ${names[1]}` : `You and ${names[0]}`;
  const subtitle = subtitleOverride ?? `${who}${mutedNames.length ? ` · ${mutedNames.join(' and ')} muted` : ''}`;
  const mobile = layout === 'mobile';
  return (
    <header className={cx(s.root, mobile && s.mobile)}>
      {mobile && <IconButton variant="plain" size="lg" icon={Menu} label="Open chats" onClick={onOpenChats} />}
      <div className={s.titles}>
        <h1 className={cx(mobile ? 'body_bold' : 'headline_3', s.title)}>{title}</h1>
        <p className={`body_tiny ${s.subtitle}`}>{subtitle}</p>
      </div>
      {onOpenCast ? (
        <button
          ref={castTriggerRef}
          type="button"
          className={s.castButton}
          aria-label="Open cast: Nova and Iris"
          aria-haspopup="dialog"
          aria-expanded={castOpen}
          onClick={onOpenCast}
        >
          <AvatarStack overlap={mobile ? 'mobile' : 'desktop'} />
        </button>
      ) : (
        <span className={s.stack} role="img" aria-label="Nova and Iris">
          <AvatarStack />
        </span>
      )}
    </header>
  );
});
