import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cx } from '../../../lib/cx';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';
import s from './SidePanel.module.css';

interface SidePanelProps {
  side: 'left' | 'right';
  as: 'nav' | 'aside';
  label: string;
  /** Shown in the top row while expanded. */
  title: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  /** Toggle wording, e.g. { show: 'Show chats', hide: 'Hide chats' }. */
  toggleLabel: { show: string; hide: string };
  shortcut: { display: string; aria: string };
  /** What the collapsed rail shows under the toggle. */
  rail: ReactNode;
  children: ReactNode;
  /** When true the toggle opens something else (the cast drawer) and the panel never expands. */
  railOnly?: boolean;
}

/**
 * A collapsible side panel: full width with its content, or a 64px icon rail. The toggle is one element in the top
 * row in both states, so keyboard focus stays on it as the panel changes.
 */
export function SidePanel({ side, as: Root, label, title, collapsed, onToggle, toggleLabel, shortcut, rail, children, railOnly = false }: SidePanelProps) {
  const [animating, setAnimating] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setAnimating(true);
    const t = window.setTimeout(() => setAnimating(false), 220);
    return () => window.clearTimeout(t);
  }, [collapsed]);

  const icon = side === 'left' ? (collapsed ? PanelLeftOpen : PanelLeftClose) : collapsed ? PanelRightOpen : PanelRightClose;
  const toggleText = collapsed ? toggleLabel.show : toggleLabel.hide;

  return (
    <Root aria-label={label} className={cx(s.root, s[side], collapsed && s.collapsed, animating && s.animating)}>
      <div className={s.top}>
        {!collapsed && <div className={s.title}>{title}</div>}
        <Tooltip label={toggleText} shortcut={shortcut.display} side={collapsed ? (side === 'left' ? 'right' : 'left') : 'bottom'}>
          <IconButton
            variant="plain"
            size="md"
            icon={icon}
            label={toggleText}
            aria-expanded={railOnly ? undefined : !collapsed}
            aria-haspopup={railOnly ? 'dialog' : undefined}
            aria-keyshortcuts={shortcut.aria}
            onClick={onToggle}
          />
        </Tooltip>
      </div>
      <div className={cx(s.body, collapsed && s.railBody)}>{collapsed ? rail : children}</div>
    </Root>
  );
}
