import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { cx } from '../../../lib/cx';
import { Icon, type LucideIcon } from '../../../lib/icon';
import s from './Menu.module.css';

export interface MenuEntry {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
}

interface MenuProps {
  id: string;
  items: MenuEntry[];
  triggerRef: RefObject<HTMLButtonElement>;
  onClose: (returnFocus: boolean) => void;
}

/** role="menu", anchored under its trigger with right edges aligned; flips upward when there is no room. */
export function Menu({ id, items, triggerRef, onClose }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [up, setUp] = useState(false);

  useLayoutEffect(() => {
    const menu = ref.current;
    const trigger = triggerRef.current;
    if (!menu || !trigger) return;
    const t = trigger.getBoundingClientRect();
    setUp(t.bottom + 8 + menu.offsetHeight > window.innerHeight && t.top - 8 - menu.offsetHeight > 0);
    itemRefs.current[0]?.focus();
  }, [triggerRef]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !triggerRef.current?.contains(target)) onClose(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [onClose, triggerRef]);

  const move = (delta: number) => {
    const list = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    list[(i + delta + list.length) % list.length]?.focus();
  };

  return (
    <div
      ref={ref}
      id={id}
      role="menu"
      className={cx(s.root, up && s.up)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(true); }
        else if (e.key === 'Tab') onClose(false);
      }}
    >
      {items.map((item, i) => (
        <button
          key={item.label}
          ref={(el) => (itemRefs.current[i] = el)}
          type="button"
          role="menuitem"
          tabIndex={-1}
          className={`body_small ${s.item}`}
          onClick={() => {
            onClose(true);
            item.onSelect();
          }}
        >
          <Icon icon={item.icon} size={16} />
          {item.label}
        </button>
      ))}
    </div>
  );
}
