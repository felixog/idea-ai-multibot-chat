import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { Icon, type LucideIcon } from '../../../lib/icon';
import s from './StatusBadge.module.css';

export function StatusBadge({ icon, tone = 'ai', children }: { icon: LucideIcon; tone?: 'ai' | 'constructive'; children: ReactNode }) {
  return (
    <span className={cx('body_tiny', s.root, s[tone])}>
      <Icon icon={icon} size={12} />
      {children}
    </span>
  );
}
