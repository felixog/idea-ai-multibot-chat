import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { Icon, type LucideIcon } from '../../../lib/icon';
import s from './NavItem.module.css';

interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  /** Right-aligned extra, e.g. checklist progress. */
  trailing?: ReactNode;
}

/** A sidebar navigation row: icon and label, full width (ChatGPT-style). */
export function NavItem({ icon, label, trailing, className, type = 'button', ...rest }: NavItemProps) {
  return (
    <button type={type} className={cx('body_small', s.root, className)} {...rest}>
      <Icon icon={icon} size={20} className={s.icon} />
      <span className={s.label}>{label}</span>
      {trailing}
    </button>
  );
}
