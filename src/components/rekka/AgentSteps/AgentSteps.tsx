import { Circle, CircleCheck, LoaderCircle } from 'lucide-react';
import type { Step } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import s from './AgentSteps.module.css';

export type StepState = 'done' | 'active' | 'pending';

export function AgentStep({ state, label, detail }: { state: StepState; label: string; detail?: string }) {
  const icon = state === 'done' ? CircleCheck : state === 'active' ? LoaderCircle : Circle;
  return (
    <li className={cx(s.step, s[state])}>
      <Icon icon={icon} size={16} className={s.icon} />
      <span className={s.body}>
        <span className={state === 'active' ? 'body_small_bold' : 'body_small'}>
          {label}
          <span className="visually-hidden">{state === 'done' ? ', done' : state === 'active' ? ', in progress' : ''}</span>
        </span>
        {detail && <span className={`body_tiny ${s.detail}`}>{detail}</span>}
      </span>
    </li>
  );
}

export function AgentSteps({ title, percent, steps, stepIndex }: { title: string; percent: number; steps: Step[]; stepIndex: number }) {
  return (
    <div className={s.root}>
      <ProgressBar label={title} percent={percent} />
      <ul className={s.list} aria-live="polite">
        {steps.map((st, i) => (
          <AgentStep key={st.label} label={st.label} detail={st.detail} state={i < stepIndex || percent >= 100 ? 'done' : i === stepIndex ? 'active' : 'pending'} />
        ))}
      </ul>
    </div>
  );
}
