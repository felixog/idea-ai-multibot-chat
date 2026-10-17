import { useEffect, useRef, useState } from 'react';
import { cx } from '../../../lib/cx';
import s from './Toast.module.css';

interface ToastProps {
  message: string;
  action?: { label: string; onClick: () => void };
  onDismiss: () => void;
  /** Lifts the toast above the mobile composer dock. */
  placement?: 'desktop' | 'mobile';
  /** For static captures: never auto-dismiss. */
  persistent?: boolean;
}

const LIFETIME = 3000;

export function Toast({ message, action, onDismiss, placement = 'desktop', persistent = false }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(LIFETIME);
  const startedAt = useRef(0);

  useEffect(() => {
    remaining.current = LIFETIME;
  }, [message]);

  useEffect(() => {
    if (paused || persistent) return;
    startedAt.current = Date.now();
    const t = window.setTimeout(onDismiss, remaining.current);
    return () => {
      window.clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, persistent, onDismiss, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx('body_small', s.root, placement === 'mobile' && s.mobile)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span>{message}</span>
      {action && (
        <button type="button" className={cx('body_small', s.action)} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
