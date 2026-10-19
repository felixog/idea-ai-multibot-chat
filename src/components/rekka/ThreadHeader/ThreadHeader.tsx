import { forwardRef } from 'react';
import { Menu, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { Icon } from '../../../lib/icon';
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
  /** Desktop with the chats sidebar collapsed: a button to bring it back. */
  onShowChats?: () => void;
  /** Wording for the avatar-stack button: open a drawer, or show the collapsed panel. */
  castAction?: 'open' | 'show';
}

export const ThreadHeader = forwardRef<HTMLButtonElement, ThreadHeaderProps>(function ThreadHeader(
  { layout, title, muted, onOpenCast, onOpenChats, castOpen, onShowChats, castAction = 'open' },
  castTriggerRef,
) {
  const mutedNames = (Object.keys(muted) as CharacterId[]).filter((c) => muted[c]).map((c) => CAST[c].name);
  const subtitle = `You, Nova and Iris${mutedNames.length ? ` · ${mutedNames.join(' and ')} muted` : ''}`;
  const mobile = layout === 'mobile';
  return (
    <header className={cx(s.root, mobile && s.mobile)}>
      {mobile && <IconButton variant="plain" size="lg" icon={Menu} label="Open chats" onClick={onOpenChats} />}
      {!mobile && onShowChats && (
        <IconButton variant="plain" size="md" icon={PanelLeftOpen} id="show-chats-button" label="Show chats" aria-expanded={false} aria-controls="chats-sidebar" onClick={onShowChats} />
      )}
      <div className={s.titles}>
        <h1 className={cx(mobile ? 'body_bold' : 'headline_3', s.title)}>{title}</h1>
        <p className={`body_tiny ${s.subtitle}`}>{subtitle}</p>
      </div>
      {onOpenCast ? (
        <button
          ref={castTriggerRef}
          id={mobile ? undefined : 'cast-trigger'}
          type="button"
          className={s.castButton}
          aria-label={castAction === 'show' ? 'Show cast: Nova and Iris' : 'Open cast: Nova and Iris'}
          aria-haspopup={castAction === 'show' ? undefined : 'dialog'}
          aria-expanded={castAction === 'show' ? false : castOpen}
          aria-controls={castAction === 'show' ? 'cast-panel' : undefined}
          onClick={onOpenCast}
        >
          <AvatarStack overlap={mobile ? 'mobile' : 'desktop'} />
          {castAction === 'show' && <Icon icon={PanelRightOpen} size={20} className={s.castIcon} />}
        </button>
      ) : (
        <span className={s.stack} role="img" aria-label="Nova and Iris">
          <AvatarStack />
        </span>
      )}
    </header>
  );
});
