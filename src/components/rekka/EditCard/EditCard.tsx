import { forwardRef, useRef, type KeyboardEvent } from 'react';
import { Check, CircleCheck, Sparkles, Undo2, WandSparkles } from 'lucide-react';
import type { EditCardMedia, ImageMedia, MediaActions, VideoMedia } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { POSTER_SRC, WARM_FILTER } from '../../../lib/media';
import { mss } from '../../../lib/time';
import { AgentSteps } from '../AgentSteps/AgentSteps';
import { Button } from '../Button/Button';
import { ChangeList } from '../ChangeItem/ChangeItem';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import s from './EditCard.module.css';

interface Props {
  media: EditCardMedia;
  target: ImageMedia | VideoMedia;
  actions: MediaActions;
}

export const EditCard = forwardRef<HTMLElement, Props>(function EditCard({ media: e, target, actions: a }, ref) {
  const video = e.targetKind === 'video';
  const working = e.status === 'working';
  const showAfter = !working && e.view === 'after';
  const nextVersion = e.status === 'applied' ? target.version : target.version + 1;
  const title = working ? target.title : `${target.title} · v${nextVersion}`;
  const src = video ? POSTER_SRC : (target as ImageMedia).src;
  const before = video ? 6 : 0;
  const after = video ? 4.6 : 0;
  const pairRef = useRef<Array<HTMLButtonElement | null>>([]);

  const onPairKey = (ev: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) {
      ev.preventDefault();
      const next = e.view === 'after' ? 'before' : 'after';
      a.setEditView(e.id, next);
      pairRef.current[next === 'before' ? 0 : 1]?.focus();
    }
  };

  return (
    <article ref={ref} role="group" aria-label={`Edit: ${title}`} className={cx(s.root, e.status === 'applied' && s.applied)}>
      <div className={s.head}>
        <Icon icon={WandSparkles} size={16} className={s.wand} />
        <span className={`body_small_bold ${s.title}`}>{title}</span>
        {working ? (
          <StatusBadge icon={Sparkles}>Editing</StatusBadge>
        ) : e.status === 'ready' ? (
          <StatusBadge icon={Check}>Ready to review</StatusBadge>
        ) : (
          <StatusBadge icon={CircleCheck} tone="constructive">Applied</StatusBadge>
        )}
      </div>
      <div className={s.mediaRow}>
        <div className={cx(s.thumb, video && s.thumbVideo)} role="img" aria-label={showAfter ? `After: ${title}` : `Before: ${target.title}`}>
          <span
            className={s.art}
            style={{ backgroundImage: `url(${src})`, filter: showAfter ? WARM_FILTER : undefined }}
          />
          {video && <span className={`body_tiny tabular ${s.badge}`}>{mss(showAfter ? after : before)}</span>}
        </div>
        <div className={s.side}>
          {working ? (
            <AgentSteps title={`Making your ${video ? 'video' : 'image'}`} percent={e.percent} stepIndex={e.stepIndex} steps={e.steps} />
          ) : (
            <>
              <div role="radiogroup" aria-label="Compare" className={s.pair} onKeyDown={onPairKey}>
                {(['before', 'after'] as const).map((v, i) => (
                  <button
                    key={v}
                    ref={(el) => (pairRef.current[i] = el)}
                    type="button"
                    role="radio"
                    aria-checked={e.view === v}
                    tabIndex={e.view === v ? 0 : -1}
                    className={cx('body_small_bold', s.seg, e.view === v && s.segOn)}
                    onClick={() => a.setEditView(e.id, v)}
                  >
                    {v === 'before' ? 'Before' : 'After'}
                  </button>
                ))}
              </div>
              <ChangeList changes={e.changes} onToggle={(cid) => a.toggleChange(e.id, cid)} />
            </>
          )}
        </div>
      </div>
      {e.status === 'ready' && (
        <div className={s.actions}>
          <Button variant="ai" size="sm" icon={Check} onClick={() => a.applyEdit(e.id)}>Apply edits</Button>
          <Button variant="tertiary" size="sm" icon={WandSparkles} onClick={() => a.refine(e.id)}>Refine</Button>
          <Button variant="link" size="sm" onClick={a.openInEditor}>Open in editor</Button>
        </div>
      )}
      {e.status === 'applied' && (
        <div className={s.actions}>
          <Button variant="link" size="sm" icon={Undo2} onClick={() => a.undoApply(e.id)}>Undo apply</Button>
        </div>
      )}
    </article>
  );
});
