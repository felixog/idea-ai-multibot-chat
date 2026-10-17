import { cx } from '../../../lib/cx';
import s from './Waveform.module.css';

/** Bars keep their 6px width and spread edge to edge; in a tight region they overlap rather than shrink (as in Figma). */
export function Waveform({ bars, tone }: { bars: number[]; tone: 'light' | 'ink' | 'brand' }) {
  const last = Math.max(1, bars.length - 1);
  return (
    <span className={cx(s.root, s[tone])} style={{ height: Math.max(...bars) }} aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className={s.bar} style={{ height: h, left: `calc(${i / last} * (100% - 6px))` }} />
      ))}
    </span>
  );
}
