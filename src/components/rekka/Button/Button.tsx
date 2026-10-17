import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../../lib/cx';
import { Icon, type LucideIcon } from '../../../lib/icon';
import s from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ai' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  size: 'sm' | 'md';
  icon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, icon, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(s.root, s[size], s[variant], size === 'sm' ? 'body_small_bold' : 'body_bold', className)}
      {...rest}
    >
      {icon && <Icon icon={icon} size={16} />}
      {children}
    </button>
  );
});
