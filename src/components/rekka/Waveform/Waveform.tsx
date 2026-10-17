import { cx } from '../../../lib/cx';
import s from './Waveform.module.css';


export function Waveform({ bars, tone }: { bars: number[]; tone: 'light' | 'ink' | 'brand' }) {
  return (
    <span className={cx(s.root, s[tone])} aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className={s.bar} style={{ height: h }} />
      ))}
    </span>
  );
}
