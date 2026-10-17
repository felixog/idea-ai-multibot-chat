import { useRef } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cx } from '../../../lib/cx';
import { startDrag, sliderKey } from '../../../lib/drag';
import { Icon } from '../../../lib/icon';
import { mmss, valueText } from '../../../lib/time';
import { IconButton } from '../IconButton/IconButton';
import s from './VideoPlayer.module.css';

interface VideoPlayerProps {
  poster: string;
  filter?: string | null;
  duration: number;
  current: number;
  playing: boolean;
  size: 'full' | 'compact';
  caption?: string;
  muted: boolean;
  onToggle: () => void;
  onSeek: (sec: number) => void;
  onToggleMute: () => void;
}

export function VideoPlayer(p: VideoPlayerProps) {
  const track = useRef<HTMLDivElement>(null);
  const progress = p.duration > 0 ? Math.min(1, p.current / p.duration) : 0;
  return (
    <div className={cx(s.root, p.size === 'compact' && s.compact)}>
      <div className={s.stage}>
        <span
          className={cx(s.poster, p.playing && s.moving)}
          style={{ backgroundImage: `url(${p.poster})`, filter: p.filter ?? undefined }}
          aria-hidden="true"
        />
        {p.playing ? (
          p.caption && <span className={`body_small_bold ${s.caption}`}>{p.caption}</span>
        ) : (
          <button type="button" className={s.bigPlay} aria-label="Play teaser loop" onClick={p.onToggle}>
            <Icon icon={Play} size={24} />
          </button>
        )}
      </div>
      <div className={s.controls}>
        <IconButton variant="dark" size="sm" icon={p.playing ? Pause : Play} label={p.playing ? 'Pause teaser loop' : 'Play teaser loop'} onClick={p.onToggle} />
        <span className={`body_tiny tabular ${s.time}`}>
          {mmss(p.current)} / {mmss(p.duration)}
        </span>
        <div ref={track} className={s.track} onPointerDown={(e) => startDrag(e, track.current, (f) => p.onSeek(f * p.duration))}>
          <span className={s.fill} style={{ width: `${progress * 100}%` }} />
          <span
            role="slider"
            tabIndex={0}
            aria-label="Loop position"
            aria-valuemin={0}
            aria-valuemax={p.duration}
            aria-valuenow={Math.round(p.current * 10) / 10}
            aria-valuetext={valueText(p.current, p.duration)}
            className={s.playhead}
            style={{ left: `calc(${progress} * (100% - 16px))` }}
            onKeyDown={(e) => {
              const next = sliderKey(e.key, p.current, 0, p.duration, 1);
              if (next !== null) {
                e.preventDefault();
                p.onSeek(next);
              }
            }}
          />
        </div>
        <IconButton variant="dark" size="sm" icon={p.muted ? VolumeX : Volume2} label={p.muted ? 'Unmute' : 'Mute'} aria-pressed={p.muted} onClick={p.onToggleMute} />
      </div>
    </div>
  );
}
