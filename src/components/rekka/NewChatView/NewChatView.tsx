import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { CAST, CHARACTER_IDS, type CharacterId } from '../../../features/chat/cast';
import { useChat } from '../../../features/chat/store';
import { autoTitle, TEMPLATES } from '../../../features/chat/templates';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { CharacterTag } from '../CharacterTag/CharacterTag';
import s from './NewChatView.module.css';

function Step({ n, done, title, hint, children }: { n: number; done: boolean; title: string; hint: string; children: ReactNode }) {
  const id = useId();
  return (
    <fieldset className={s.step} aria-labelledby={id}>
      <div className={s.stepHead}>
        <span className={cx('body_small_bold', s.badge, done && s.badgeDone)} aria-hidden="true">
          {done ? <Icon icon={Check} size={12} /> : n}
        </span>
        <span className={s.stepText}>
          <legend id={id} className={`body_bold ${s.stepTitle}`}>
            {title}
            {done && <span className="visually-hidden">, done</span>}
          </legend>
          <span className={`body_small ${s.hint}`}>{hint}</span>
        </span>
      </div>
      {children}
    </fieldset>
  );
}

/**
 * The guided new-chat flow: choose what you are making, who joins, and write the brief. Starting adds the chat to
 * the top of the list, sends the brief and the invited characters reply with first drafts.
 */
export function NewChatView() {
  const chat = useChat();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [cast, setCast] = useState<CharacterId[]>([]);
  const [brief, setBrief] = useState('');
  const [name, setName] = useState('');
  const [castHint, setCastHint] = useState(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Land keyboard and screen-reader users at the top of the flow.
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);
  const template = TEMPLATES.find((t) => t.id === templateId);
  const ready = !!template && cast.length > 0 && brief.trim() !== '';
  const ids = { brief: useId(), name: useId() };

  const pickTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    setTemplateId(id);
    if (t) setCast(t.cast);
  };
  const toggleCast = (c: CharacterId) => {
    if (cast.includes(c) && cast.length === 1) {
      setCastHint(true);
      return;
    }
    setCastHint(false);
    setCast(cast.includes(c) ? cast.filter((x) => x !== c) : CHARACTER_IDS.filter((x) => x === c || cast.includes(x)));
  };
  const start = () => {
    if (!ready || !template) return;
    chat.createChat({ templateId: template.id, cast, brief, name });
    // The composer mounts with the new chat; hand it focus once it is there.
    window.setTimeout(() => window.dispatchEvent(new CustomEvent('rk:focus-composer')), 50);
  };

  return (
    <div
      className={s.root}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          chat.cancelNewChat();
        } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          start();
        }
      }}
    >
      <div className={s.column}>
        <div className={s.intro}>
          <h2 ref={headingRef} tabIndex={-1} className={`headline_2 ${s.title}`}>Start a new chat</h2>
          <p className={`body ${s.lede}`}>Tell Nova and Iris what you’re making. You can change any of this once you’re in the chat.</p>
        </div>

        <Step n={1} done={!!template} title="What are you making?" hint="This sets who joins and what they make first.">
          <div className={s.options}>
            {TEMPLATES.map((t) => (
              <label key={t.id} className={cx(s.option, templateId === t.id && s.selected)}>
                <input className="visually-hidden" type="radio" name="new-chat-template" value={t.id} checked={templateId === t.id} onChange={() => pickTemplate(t.id)} />
                <span className={s.optionIcon}>
                  <Icon icon={t.icon} size={20} />
                </span>
                <span className={s.optionText}>
                  <span className={`body_small_bold ${s.optionTitle}`}>{t.label}</span>
                  <span className={`body_tiny ${s.optionBlurb}`}>{t.blurb}</span>
                </span>
              </label>
            ))}
          </div>
        </Step>

        <Step n={2} done={!!template && cast.length > 0} title="Who should join?" hint="Anyone left out can join later with an @mention.">
          <div className={cx(s.castRow, !template && s.waiting)}>
            {CHARACTER_IDS.map((c) => {
              const on = cast.includes(c);
              return (
                <label key={c} data-character={CAST[c].bot} className={cx(s.castTile, on && s.selected)}>
                  <input className="visually-hidden" type="checkbox" checked={on} disabled={!template} onChange={() => toggleCast(c)} />
                  <Avatar character={c} size="md" decorative />
                  <span className={s.optionText}>
                    <span className={`body_small_bold ${s.optionTitle}`}>{CAST[c].name}</span>
                    <span className={`body_tiny ${s.optionBlurb}`}>{CAST[c].specialty}</span>
                  </span>
                  <CharacterTag character={c} />
                  <span className={cx(s.check, on && s.checkOn)} aria-hidden="true">
                    {on && <Icon icon={Check} size={12} />}
                  </span>
                </label>
              );
            })}
          </div>
          {castHint && (
            <p className={`body_tiny ${s.hint}`} role="status">
              Keep at least one character in the chat.
            </p>
          )}
        </Step>

        <Step n={3} done={brief.trim() !== ''} title="Brief them" hint="A sentence or two is plenty. This becomes your first message.">
          <div className={cx(s.briefBox, !template && s.waiting)}>
            <label htmlFor={ids.brief} className="visually-hidden">Your brief</label>
            <textarea
              ref={briefRef}
              id={ids.brief}
              className={`body ${s.brief}`}
              rows={3}
              disabled={!template}
              placeholder={template?.placeholder ?? 'Pick what you’re making first'}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            {template && (
              <div className={s.starters} aria-label="Starter briefs" role="group">
                {template.starters.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`body_small ${s.starter}`}
                    onClick={() => {
                      setBrief(st);
                      briefRef.current?.focus();
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={s.nameField}>
            <label htmlFor={ids.name} className="body_small_bold">
              Chat name <span className={`body_small ${s.optional}`}>(optional)</span>
            </label>
            <input
              id={ids.name}
              className={`body ${s.nameInput}`}
              disabled={!template}
              placeholder={template ? autoTitle(brief, template.label) : ''}
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </Step>

        <div className={s.actions}>
          <Button variant="tertiary" size="md" onClick={chat.cancelNewChat}>Cancel</Button>
          <Button variant="primary" size="md" icon={ArrowRight} disabled={!ready} onClick={start}>Start chat</Button>
        </div>
      </div>
    </div>
  );
}
