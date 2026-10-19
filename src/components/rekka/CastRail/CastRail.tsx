import { Images, Plus, VolumeX } from 'lucide-react';
import { CAST, CHARACTER_IDS, type CharacterId } from '../../../features/chat/cast';
import { madeItems } from '../../../features/chat/logic';
import { useChat } from '../../../features/chat/store';
import { Icon } from '../../../lib/icon';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';
import s from './CastRail.module.css';

export type CastTarget = CharacterId | 'made';

/** The cast panel collapsed to icons: both characters (with their muted state), what was made, and Add a character. */
export function CastRail({ onOpen }: { onOpen: (target: CastTarget) => void }) {
  const chat = useChat();
  const { muted } = chat.state;
  const count = madeItems(chat.state).length;
  return (
    <div className={s.root}>
      {CHARACTER_IDS.map((c) => {
        const label = `${CAST[c].name}, ${CAST[c].role}${muted[c] ? ', muted' : ''}`;
        return (
          <Tooltip key={c} label={label} side="left">
            <button type="button" className={s.avatar} aria-label={label} onClick={() => onOpen(c)}>
              <Avatar character={c} size="md" decorative muted={muted[c]} />
              {muted[c] && (
                <span className={s.mutedBadge} aria-hidden="true">
                  <Icon icon={VolumeX} size={12} />
                </span>
              )}
            </button>
          </Tooltip>
        );
      })}
      <span className={s.divider} aria-hidden="true" />
      <Tooltip label={`Made in this chat · ${count} items`} side="left">
        <span className={s.badged}>
          <IconButton variant="plain" size="md" icon={Images} label={`Made in this chat, ${count} items`} onClick={() => onOpen('made')} />
          <span className={`body_tiny tabular ${s.count}`} aria-hidden="true">{count}</span>
        </span>
      </Tooltip>
      <Tooltip label="Add a character" side="left">
        <IconButton variant="plain" size="md" icon={Plus} label="Add a character" onClick={() => chat.toast('The character library is coming soon')} />
      </Tooltip>
    </div>
  );
}
