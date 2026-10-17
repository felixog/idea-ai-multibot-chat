import { useCallback, useId, useRef, useState } from 'react';
import { Download, Ellipsis, RotateCcw, Scissors, ScrollText, WandSparkles } from 'lucide-react';
import { cx } from '../../../lib/cx';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Menu } from '../Menu/Menu';
import s from './MediaToolbar.module.css';

interface MediaToolbarProps {
  type: 'audio' | 'video' | 'image';
  /** Forces a layout; otherwise the card's container query picks full or compact. */
  layout?: 'full' | 'compact';
  onPrimary: () => void;
  onEditPrompt: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
}

export function MediaToolbar({ type, layout, onPrimary, onEditPrompt, onRegenerate, onDownload }: MediaToolbarProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }, []);

  return (
    <div className={cx(s.root, layout === 'full' && s.forceFull, layout === 'compact' && s.forceCompact)}>
      {type === 'image' ? (
        <Button variant="tertiary" size="sm" icon={WandSparkles} onClick={onPrimary}>Edit</Button>
      ) : (
        <Button variant="tertiary" size="sm" icon={Scissors} onClick={onPrimary}>Trim</Button>
      )}
      <div className={s.full}>
        <Button variant="link" size="sm" icon={ScrollText} onClick={onEditPrompt}>Edit prompt</Button>
        <IconButton variant="plain" size="sm" icon={RotateCcw} label="Regenerate" onClick={onRegenerate} />
        <IconButton variant="plain" size="sm" icon={Download} label="Download" onClick={onDownload} />
      </div>
      <div className={s.compact}>
        <IconButton
          ref={trigger}
          variant="outline"
          size="sm"
          icon={Ellipsis}
          label="More actions"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((o) => !o)}
        />
        {open && (
          <Menu
            id={menuId}
            triggerRef={trigger}
            onClose={close}
            items={[
              { label: 'Edit prompt', icon: ScrollText, onSelect: onEditPrompt },
              { label: 'Regenerate', icon: RotateCcw, onSelect: onRegenerate },
              { label: 'Download', icon: Download, onSelect: onDownload },
            ]}
          />
        )}
      </div>
    </div>
  );
}
