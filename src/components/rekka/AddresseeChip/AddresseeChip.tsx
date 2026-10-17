import { CAST, type CharacterId } from '../../../features/chat/cast';
import { cx } from '../../../lib/cx';
import { Avatar } from '../Avatar/Avatar';
import s from './AddresseeChip.module.css';

interface AddresseeChipProps {
  character: CharacterId;
  onRemove: () => void;
  /** Bumped by the parent to replay the "cannot remove the last chip" shake. */
  shakeKey?: number;
}

export function AddresseeChip({ character, onRemove, shakeKey = 0 }: AddresseeChipProps) {
  const c = CAST[character];
  return (
    <button
      key={shakeKey}
      type="button"
      data-character={c.bot}
      className={cx('body_small_bold', s.root, shakeKey > 0 && s.shake)}
      aria-label={`Stop replying to ${c.name}`}
      onClick={onRemove}
    >
      <Avatar character={character} size="sm" decorative />
      {c.name}
    </button>
  );
}
