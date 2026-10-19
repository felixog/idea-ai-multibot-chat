import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { Scissors } from 'lucide-react';
import type { Range } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { startDrag, sliderKey } from '../../../lib/drag';
import { clamp, mss, secs, snap, valueText } from '../../../lib/time';
import { Button } from '../Button/Button';
import { HOOK_BARS } from '../../../lib/waveforms';
import s from './TrimEditor.module.css';

interface TrimEditorProps {
  variant: 'waveform' | 'frames';
  duration: number;
  range: Range;
  /** Minimum selection length in seconds (2 for audio, 1 for video). */
  min: number;
  /** Keyboard step in seconds (0.5 for audio, 0.1 for video). */
  step: number;
  onChange: (range: Range) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TrimEditor({ variant, duration, range, min, step, onChange, onSave, onCancel }: TrimEditorProps) {
  const track = useRef<HTMLDivElement>(null);
  const tenths = variant === 'frames';
  const pct = (sec: number) => `${(sec / duration) * 100}%`;

  const setStart = (v: number) => onChange({ start: clamp(snap(v, step), 0, range.end - min), end: range.end });
  const setEnd = (v: number) => onChange({ start: range.start, end: clamp(snap(v, step), range.start + min, duration) });

  const handle = (which: 'start' | 'end') => {
    const value = which === 'start' ? range.start : range.end;
    const set = which === 'start' ? setStart : setEnd;
    return {
      role: 'slider',
      tabIndex: 0,
      'aria-label': which === 'start' ? 'Trim start' : 'Trim end',
      'aria-valuemin': which === 'start' ? 0 : range.start + min,
      'aria-valuemax': which === 'start' ? range.end - min : duration,
      'aria-valuenow': Math.round(value * 10) / 10,
      'aria-valuetext': valueText(value, duration, tenths),
      onPointerDown: (e: PointerEvent) => {
        e.stopPropagation();
        startDrag(e, track.current, (f) => set(f * duration));
      },
      onKeyDown: (e: KeyboardEvent) => {
        const next = sliderKey(e.key, value, which === 'start' ? 0 : range.start + min, which === 'start' ? range.end - min : duration, step);
        if (next !== null) {
          e.preventDefault();
          set(next);
        }
      },
    } as const;
  };

  return (
    <div className={s.root}>
      {variant === 'waveform' ? (
        <div ref={track} className={s.wave}>
          {/* One fixed waveform for the whole clip; only the selection and handles move over it. */}
          <span className={s.selection} style={{ left: pct(range.start), width: pct(range.end - range.start) }} />
          <span className={s.bars} aria-hidden="true">
            {HOOK_BARS.map((h, i) => {
              const centre = ((i + 0.5) / HOOK_BARS.length) * duration;
              const inside = centre >= range.start && centre <= range.end;
              // A handle sits just outside each edge of the selection; hide the bar it covers.
              const step = duration / HOOK_BARS.length;
              const covered = (centre < range.start && centre > range.start - step) || (centre > range.end && centre < range.end + step);
              return (
                <span
                  key={i}
                  className={cx(s.bar, inside ? s.barIn : s.barOut, covered && s.barCovered)}
                  style={{ height: h, left: `${((i + 0.5) / HOOK_BARS.length) * 100}%` }}
                />
              );
            })}
          </span>
          <span className={s.handle} style={{ left: `max(0px, calc(${pct(range.start)} - var(--rk_spacing_2x)))` }} {...handle('start')}>
            <span className={s.grip} />
          </span>
          <span className={s.handle} style={{ left: `min(${pct(range.end)}, calc(100% - var(--rk_spacing_2x)))` }} {...handle('end')}>
            <span className={s.grip} />
          </span>
        </div>
      ) : (
        <div className={s.frames}>
          <div ref={track} className={s.strip}>
            {Array.from({ length: 6 }, (_, i) => {
              const centre = ((i + 0.5) / 6) * duration;
              return <span key={i} className={cx(s.cell, i % 2 === 1 && s.cellAlt, (centre < range.start || centre > range.end) && s.cellOut)} />;
            })}
            <span className={s.window} style={{ left: pct(range.start), width: pct(range.end - range.start) }}>
              <span className={cx(s.fhandle, s.fhandleStart)} {...handle('start')} />
              <span className={cx(s.fhandle, s.fhandleEnd)} {...handle('end')} />
            </span>
          </div>
        </div>
      )}
      <div className={`body_tiny tabular ${s.times}`}>
        <span>
          <span className={s.muted}>Start</span> {mss(range.start, tenths || !Number.isInteger(range.start))}
        </span>
        <span className={s.muted}>{secs(range.end - range.start)}s selected</span>
        <span>
          <span className={s.muted}>End</span> {mss(range.end, tenths || !Number.isInteger(range.end))}
        </span>
      </div>
      <div className={s.actions}>
        <Button variant="tertiary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="secondary" size="sm" icon={Scissors} onClick={onSave}>Save trim</Button>
      </div>
    </div>
  );
}
