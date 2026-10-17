import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../../lib/cx';
import { Icon, type LucideIcon } from '../../../lib/icon';
import s from './IconButton.module.css';

export type IconButtonVariant = 'plain' | 'outline' | 'secondary' | 'primary' | 'dark';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant: IconButtonVariant;
  size: 'sm' | 'md' | 'lg';
  icon: LucideIcon;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant, size, icon, label, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx(s.root, s[size], s[variant], className)}
      {...rest}
    >
      <Icon icon={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  );
});
