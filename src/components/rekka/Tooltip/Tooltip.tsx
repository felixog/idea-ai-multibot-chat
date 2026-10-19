import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import s from './Tooltip.module.css';

interface TooltipProps {
  label: string;
  /** Display text of a keyboard shortcut, e.g. "⌘B". */
  shortcut?: string;
  side?: 'right' | 'left' | 'bottom';
  children: ReactNode;
}

/**
 * A label bubble on hover and keyboard focus. Visual only: the control inside already carries the same accessible
 * name (and aria-keyshortcuts), so the bubble is hidden from assistive tech.
 */
export function Tooltip({ label, shortcut, side = 'right', children }: TooltipProps) {
  return (
    <span className={cx(s.root, s[side])}>
      {children}
      <span className={`body_tiny ${s.tip}`} aria-hidden="true">
        {label}
        {shortcut && <kbd className={s.kbd}>{shortcut}</kbd>}
      </span>
    </span>
  );
}
