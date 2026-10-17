import { useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { startDrag, sliderKey } from '../../../lib/drag';
import { mmss, valueText } from '../../../lib/time';
import { IconButton } from '../IconButton/IconButton';
import s from './VoicePlayer.module.css';

interface VoicePlayerProps {
  duration: number;
  current: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (sec: number) => void;
}

export function VoicePlayer({ duration, current, playing, onToggle, onSeek }: VoicePlayerProps) {
  const track = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  return (
    <div className={s.root}>
      <div className={s.controls}>
        <IconButton variant="plain" size="sm" icon={playing ? Pause : Play} label={playing ? 'Pause hook' : 'Play hook'} onClick={onToggle} />
        <div ref={track} className={s.track} onPointerDown={(e) => startDrag(e, track.current, (f) => onSeek(f * duration))}>
          <span className={s.fill} style={{ width: `${progress * 100}%` }} />
          <span
            role="slider"
            tabIndex={0}
            aria-label="Hook position"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.round(current)}
            aria-valuetext={valueText(current, duration)}
            className={s.playhead}
            style={{ left: `calc(${progress} * (100% - 24px))` }}
            onKeyDown={(e) => {
              const next = sliderKey(e.key, current, 0, duration, 1);
              if (next !== null) {
                e.preventDefault();
                onSeek(next);
              }
            }}
          />
        </div>
      </div>
      <div className={`body_tiny tabular ${s.times}`}>
        <span>{mmss(current)}</span>
        <span>{mmss(duration)}</span>
      </div>
    </div>
  );
}
