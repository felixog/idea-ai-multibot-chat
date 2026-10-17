import { AtSign } from 'lucide-react';
import { CAST, type CharacterId } from '../../../features/chat/cast';
import { optionId, type MentionKey } from '../../../features/chat/logic';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { Avatar } from '../Avatar/Avatar';
import { CharacterTag } from '../CharacterTag/CharacterTag';
import s from './MentionPicker.module.css';

interface MentionOptionProps {
  id: string;
  option: MentionKey;
  selected: boolean;
  muted: boolean;
  onPick: () => void;
  onHover: () => void;
}

export function MentionOption({ id, option, selected, muted, onPick, onHover }: MentionOptionProps) {
  const isAll = option === 'all';
  const c = isAll ? null : CAST[option as CharacterId];
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      data-character={c?.bot}
      className={cx(s.option, selected && s.selected)}
      // Keep focus in the textarea while choosing with the pointer.
      onPointerDown={(e) => e.preventDefault()}
      onClick={onPick}
      onPointerMove={onHover}
    >
      {isAll ? (
        <span className={s.allIcon}>
          <Icon icon={AtSign} size={16} />
        </span>
      ) : (
        <Avatar character={option as CharacterId} size="md" decorative muted={muted} />
      )}
      <span className={s.text}>
        <span className={`body_small_bold ${s.name}`}>{isAll ? '@all' : c!.name}</span>
        <span className={cx('body_tiny', muted ? s.mutedText : s.spec)}>{isAll ? 'Both characters reply' : muted ? 'Muted' : c!.specialty}</span>
      </span>
      {!isAll && <CharacterTag character={option as CharacterId} />}
    </li>
  );
}

interface MentionPickerProps {
  id: string;
  options: MentionKey[];
  index: number;
  query: string;
  muted: Record<CharacterId, boolean>;
  onPick: (key: MentionKey) => void;
  onHover: (index: number) => void;
}

export function MentionPicker({ id, options, index, query, muted, onPick, onHover }: MentionPickerProps) {
  return (
    <div className={s.root}>
      <p className={`body_tiny ${s.title}`} id={`${id}-label`}>Mention a character</p>
      <ul id={id} role="listbox" aria-label="Mention a character" className={s.list}>
        {options.length === 0 ? (
          <li role="option" aria-selected={false} aria-disabled="true" className={cx('body_small', s.option, s.empty)}>
            No character called ‘{query}’
          </li>
        ) : (
          options.map((k, i) => (
            <MentionOption
              key={k}
              id={optionId(id, k)}
              option={k}
              selected={i === index}
              muted={k !== 'all' && muted[k]}
              onPick={() => onPick(k)}
              onHover={() => i !== index && onHover(i)}
            />
          ))
        )}
      </ul>
    </div>
  );
}
