import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../Button/Button';
import { PromptReference } from '../PromptReference/PromptReference';
import s from './EditSlot.module.css';

interface EditSlotProps {
  prompt: string;
  versionLabel: string;
  value: string;
  autoFocus?: boolean;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onCopy: () => void;
}

const MAX_HEIGHT = 5 * 24 + 24; // five lines of body plus 12 + 12 padding

export function EditSlot({ prompt, versionLabel, value, autoFocus = true, onChange, onSubmit, onCancel, onCopy }: EditSlotProps) {
  const id = useId();
  const field = useRef<HTMLTextAreaElement>(null);
  const empty = value.trim() === '';

  useEffect(() => {
    if (autoFocus) field.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, MAX_HEIGHT)}px`;
  }, [value]);

  return (
    <div className={s.root}>
      <PromptReference prompt={prompt} versionLabel={versionLabel} onCopy={onCopy} />
      <div className={s.field}>
        <label htmlFor={id} className="body_small_bold">Describe the change</label>
        <textarea
          ref={field}
          id={id}
          rows={1}
          className={`body ${s.input}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (!empty) onSubmit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }
          }}
        />
      </div>
      <div className={s.actions}>
        <Button variant="tertiary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="ai" size="sm" icon={Sparkles} disabled={empty} onClick={onSubmit}>Make changes</Button>
      </div>
    </div>
  );
}
