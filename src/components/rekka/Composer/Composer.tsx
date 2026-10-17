import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { AtSign, Mic, Paperclip, Send } from 'lucide-react';
import { mentionOptions, optionId } from '../../../features/chat/logic';
import { useChat } from '../../../features/chat/store';
import { cx } from '../../../lib/cx';
import { AddresseeChip } from '../AddresseeChip/AddresseeChip';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { MentionPicker } from '../MentionPicker/MentionPicker';
import s from './Composer.module.css';

export const COMPOSER_INPUT_ID = 'message-box';
const MAX_HEIGHT = 168;

export function Composer({ layout }: { layout: 'desktop' | 'mobile' }) {
  const chat = useChat();
  const chatRef = useRef(chat);
  chatRef.current = chat;
  const { draft, picker, addressees, muted, ui } = chat.state;
  const input = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const pickerId = useId();
  const options = picker.open ? mentionOptions(chat.state) : [];
  const active = picker.open && options[picker.index];

  useLayoutEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    if (pendingCaret.current !== null) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  }, [draft]);

  // Demo affordance and keyboard paths ask for focus through this event.
  useEffect(() => {
    const onStart = () => {
      const el = input.current;
      if (!el) return;
      el.scrollIntoView({ block: 'nearest' });
      pendingCaret.current = chatRef.current.startMention(el.value.length);
      el.focus();
    };
    window.addEventListener('rk:start-mention', onStart);
    return () => window.removeEventListener('rk:start-mention', onStart);
  }, []);

  const caret = () => input.current?.selectionEnd ?? draft.length;
  const pick = (index: number) => {
    const key = options[index];
    if (!key) return;
    pendingCaret.current = chat.insertMention(key, caret());
    input.current?.focus();
  };
  const mention = () => {
    pendingCaret.current = chat.startMention(caret());
    input.current?.focus();
  };

  return (
    <div className={cx(s.root, layout === 'mobile' && s.mobile)}>
      {picker.open && (
        <MentionPicker id={pickerId} options={options} index={picker.index} query={picker.query} muted={muted} onPick={(k) => pick(options.indexOf(k))} onHover={chat.hoverPicker} />
      )}
      <div className={s.addressees}>
        <div className={s.chips}>
          <span className={`body_tiny ${s.replying}`}>Replying to</span>
          {(['nova', 'iris'] as const)
            .filter((c) => addressees.includes(c))
            .map((c) => (
              <AddresseeChip key={c} character={c} onRemove={() => chat.removeAddressee(c)} shakeKey={addressees.length === 1 ? ui.shakeKey : 0} />
            ))}
        </div>
        {layout === 'desktop' ? (
          <Button variant="tertiary" size="md" icon={AtSign} aria-expanded={picker.open} onClick={mention}>
            Mention
          </Button>
        ) : (
          <IconButton variant="outline" size="lg" icon={AtSign} label="Mention a character" aria-expanded={picker.open} onClick={mention} />
        )}
      </div>
      <div className={s.tray}>
        <span className={s.handle} aria-hidden="true" />
        <div className={s.inputRow}>
          <IconButton variant="outline" size="md" icon={Paperclip} label="Attach a file" onClick={() => chat.toast('Attachments aren’t part of this prototype')} />
          <div className={s.box}>
            <textarea
              ref={input}
              id={COMPOSER_INPUT_ID}
              rows={1}
              className={`body ${s.input}`}
              placeholder="Type your request here"
              aria-label="Message Nova and Iris"
              aria-controls={picker.open ? pickerId : undefined}
              aria-activedescendant={active ? optionId(pickerId, active) : undefined}
              aria-autocomplete="list"
              value={draft}
              onChange={(e) => chat.setDraft(e.target.value, e.target.selectionEnd)}
              onSelect={(e) => {
                const el = e.currentTarget;
                if (picker.open && el.selectionEnd !== el.value.length) chat.setDraft(el.value, el.selectionEnd);
              }}
              onKeyDown={(e) => {
                if (picker.open) {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    chat.movePicker(e.key === 'ArrowDown' ? 1 : -1);
                    return;
                  }
                  if ((e.key === 'Enter' || e.key === 'Tab') && options.length > 0) {
                    e.preventDefault();
                    pick(picker.index);
                    return;
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    chat.closePicker();
                    return;
                  }
                }
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  chat.send();
                }
              }}
            />
          </div>
          {draft.trim() === '' ? (
            <IconButton variant="plain" size="md" icon={Mic} label="Record a voice note" onClick={() => chat.toast('Voice notes aren’t part of this prototype')} />
          ) : (
            <IconButton
              variant="primary"
              size="md"
              icon={Send}
              label="Send"
              onClick={() => {
                chat.send();
                input.current?.focus();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
