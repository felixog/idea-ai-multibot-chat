import { useEffect, useId, useState } from 'react';
import { Check, Copy, ScrollText } from 'lucide-react';
import { Icon } from '../../../lib/icon';
import { IconButton } from '../IconButton/IconButton';
import s from './PromptReference.module.css';

export function PromptReference({ prompt, versionLabel, onCopy }: { prompt: string; versionLabel: string; onCopy: () => void }) {
  const headingId = useId();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <section className={s.root} aria-labelledby={headingId}>
      <div className={s.head}>
        <Icon icon={ScrollText} size={16} className={s.icon} />
        <h4 id={headingId} className={`body_small_bold ${s.title}`}>Original prompt</h4>
        <span className={`body_tiny ${s.version}`}>{versionLabel}</span>
        <IconButton
          variant="plain"
          size="sm"
          icon={copied ? Check : Copy}
          label="Copy prompt"
          onClick={() => {
            navigator.clipboard?.writeText(prompt).catch(() => {});
            setCopied(true);
            onCopy();
          }}
        />
      </div>
      <p className={`body_small ${s.text}`}>{prompt}</p>
    </section>
  );
}
