import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cx } from '../../../lib/cx';
import s from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: 'left' | 'right' | 'bottom';
  /** Accessible name; shown as the sheet head on the bottom sheet, visually hidden otherwise. */
  title: string;
  children: ReactNode;
  /** Render inside this element instead of document.body (the phone preview frame). */
  container?: HTMLElement | null;
}

/**
 * ChatsDrawer (left), CastDrawer (right) and CastSheet (bottom): a modal dialog with a focus trap.
 * Focus returns to the trigger on close; scrim click and Esc close it.
 */
export function Drawer({ open, onOpenChange, side, title, children, container }: DrawerProps) {
  const [dragY, setDragY] = useState(0);
  const start = useRef<number | null>(null);
  const sheet = side === 'bottom';
  // The triggers live outside Radix (the store opens these), so remember what had focus and return to it on close.
  const returnTo = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (open) returnTo.current = document.activeElement as HTMLElement | null;
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container ?? undefined}>
        <Dialog.Overlay className={cx(s.scrim, container && s.contained)} />
        <Dialog.Content
          className={cx(s.panel, s[side], container && s.contained)}
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            returnTo.current?.focus();
          }}
          style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        >
          {sheet ? (
            <>
              <div
                className={s.handleZone}
                onPointerDown={(e) => {
                  start.current = e.clientY;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => start.current !== null && setDragY(Math.max(0, e.clientY - start.current))}
                onPointerUp={() => {
                  if (dragY >= 80) onOpenChange(false);
                  start.current = null;
                  setDragY(0);
                }}
                onPointerCancel={() => {
                  start.current = null;
                  setDragY(0);
                }}
              >
                <span className={s.handle} />
              </div>
              <Dialog.Title className={`headline_3 ${s.sheetTitle}`}>{title}</Dialog.Title>
              <div className={s.sheetBody}>{children}</div>
            </>
          ) : (
            <>
              <Dialog.Title className="visually-hidden">{title}</Dialog.Title>
              {children}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
