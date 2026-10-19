import { Droplets, Film, Repeat2, RotateCcw, Scissors, Sparkles, Undo2 } from 'lucide-react';
import type { Change, ChangeIcon } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { IconButton } from '../IconButton/IconButton';
import s from './ChangeItem.module.css';

const ICONS: Record<ChangeIcon, typeof Scissors> = { scissors: Scissors, sparkles: Sparkles, droplets: Droplets, repeat: Repeat2, film: Film };

export function ChangeItem({ change, onUndo }: { change: Change; onUndo: () => void }) {
  return (
    <li className={cx(s.root, s[change.tone], change.undone && s.undone)}>
      <span className={s.tile}>
        <Icon icon={ICONS[change.icon]} size={16} />
      </span>
      <span className={s.body}>
        <span className={`body_small_bold ${s.title}`}>{change.title}</span>
        <span className={`body_tiny ${s.detail}`}>{change.detail}</span>
      </span>
      <IconButton
        variant="plain"
        size="sm"
        icon={change.undone ? RotateCcw : Undo2}
        label={change.undone ? `Redo: ${change.title}` : `Undo: ${change.title}`}
        onClick={onUndo}
      />
    </li>
  );
}

export function ChangeList({ changes, onToggle }: { changes: Change[]; onToggle: (id: string) => void }) {
  return (
    <ul className={s.list} aria-label="Changes">
      {changes.map((c) => (
        <ChangeItem key={c.id} change={c} onUndo={() => onToggle(c.id)} />
      ))}
    </ul>
  );
}
