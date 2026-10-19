import { Circle, CircleCheck, RotateCcw } from 'lucide-react';
import { COVER_ID, HOOK_ID, LOOP_ID } from '../../../features/chat/script';
import { useChat, type DemoKey } from '../../../features/chat/store';
import { useLayout } from '../../../lib/breakpoints';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { DEMO_HIDDEN_KEY, writeFlag } from '../../../lib/storage';
import { Button } from '../Button/Button';
import { Segmented } from '../Segmented/Segmented';
import s from './DemoCard.module.css';

export const FIGMA_URL = 'https://www.figma.com/design/mXVWjW8DQRoi3pdiBcY0Gi/Felix-Oginni-%7C-Idea.ai-Challenge-%7C-Creative-Fabrica';

const ROWS: Array<{ key: DemoKey; label: string }> = [
  { key: 'trim', label: 'Save the trim on Nova’s hook' },
  { key: 'apply', label: 'Make changes to Iris’s cover, then apply them' },
  { key: 'play', label: 'Play the teaser loop' },
  { key: 'mention', label: 'Mention @Iris or @all in the message box' },
  { key: 'mute', label: 'Mute a character in the cast' },
  { key: 'phone', label: 'Try the phone preview, or make the window narrower' },
];

/** "Try the prototype": the reviewer checklist, phone preview switch, Reset demo and Hide. */
export function DemoCard({ onNavigate }: { onNavigate?: () => void }) {
  const chat = useChat();
  const layout = useLayout();
  const { done } = chat.state.demo;

  const go = (key: DemoKey) => {
    onNavigate?.();
    switch (key) {
      case 'trim':
        return chat.jumpTo(HOOK_ID);
      case 'apply':
        return chat.jumpTo(COVER_ID);
      case 'play':
        return chat.jumpTo(LOOP_ID);
      case 'mention':
        return window.dispatchEvent(new CustomEvent('rk:start-mention'));
      case 'mute':
        if (layout === 'web') {
          const btn = document.querySelector<HTMLButtonElement>('aside [aria-pressed]');
          btn?.scrollIntoView({ block: 'center' });
          btn?.focus();
          return;
        }
        return chat.setCastOpen(true);
      case 'phone':
        return chat.setPreview(chat.state.preview === 'phone' ? 'fit' : 'phone');
    }
  };

  return (
    <div className={s.wrap}>
      <section className={s.card} aria-labelledby="demo-title">
        <h2 id="demo-title" className={`body_small_bold ${s.title}`}>Try the prototype</h2>
        <p className={`quote_body ${s.note}`}>Nova makes the music. Iris makes the visuals.</p>
        <Segmented
          label="Preview size"
          value={chat.state.preview}
          onChange={chat.setPreview}
          options={[
            { value: 'fit', label: 'Fit window' },
            { value: 'phone', label: 'Phone 390' },
          ]}
        />
        <ol className={s.list}>
          {ROWS.map((r) => {
            const isDone = done.includes(r.key);
            return (
              <li key={r.key}>
                <button type="button" className={cx('body_small', s.row, isDone && s.done)} onClick={() => go(r.key)}>
                  <Icon icon={isDone ? CircleCheck : Circle} size={16} className={s.icon} />
                  <span>
                    {r.label}
                    {isDone && <span className="visually-hidden">, done</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className={s.footer}>
          <Button variant="link" size="sm" icon={RotateCcw} onClick={chat.reset}>Reset demo</Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              writeFlag(DEMO_HIDDEN_KEY, true);
              chat.setDemoDismissed(true);
            }}
          >
            Hide
          </Button>
        </div>
      </section>
      <a className={`body_tiny ${s.credit}`} href={FIGMA_URL} target="_blank" rel="noreferrer">
        Rex · prototype by Felix Oginni
      </a>
    </div>
  );
}

export function ShowTips() {
  const chat = useChat();
  if (!chat.state.demo.dismissed) return null;
  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => {
        writeFlag(DEMO_HIDDEN_KEY, false);
        chat.setDemoDismissed(false);
      }}
    >
      Show tips
    </Button>
  );
}
