import { ChevronRight, Play } from 'lucide-react';
import { CAST } from '../../../features/chat/cast';
import type { AudioMedia, ImageMedia, VideoMedia } from '../../../features/chat/types';
import { cx } from '../../../lib/cx';
import { Icon } from '../../../lib/icon';
import { madeMeta, POSTER_SRC } from '../../../lib/media';
import { CUT_4 } from '../../../lib/waveforms';
import { Avatar } from '../Avatar/Avatar';
import { Waveform } from '../Waveform/Waveform';
import s from './MadeItem.module.css';

export function MadeItem({ media: m, onClick }: { media: AudioMedia | ImageMedia | VideoMedia; onClick: () => void }) {
  const meta = `${CAST[m.owner].name} · ${madeMeta(m)}`;
  return (
    <button type="button" className={s.root} onClick={onClick}>
      <span className={cx(s.thumb, m.kind === 'audio' && s.audio)} data-visual-mask={m.kind === 'audio' ? undefined : true}>
        {m.kind === 'audio' && <Waveform bars={CUT_4} tone="light" />}
        {m.kind === 'image' && <img className={s.art} src={m.src} alt="" style={{ filter: m.filter ?? undefined }} />}
        {m.kind === 'video' && (
          <>
            <img className={s.art} src={POSTER_SRC} alt="" style={{ filter: m.filter ?? undefined }} />
            <span className={s.play}>
              <Icon icon={Play} size={12} />
            </span>
          </>
        )}
      </span>
      <span className={s.text}>
        <span className={`body_small_bold ${s.title}`}>{m.title}</span>
        <span className={`body_tiny ${s.meta}`}>
          <Avatar character={m.owner} size="xs" decorative />
          {meta}
        </span>
      </span>
      <span className="visually-hidden">, show in chat</span>
      <Icon icon={ChevronRight} size={16} className={s.chevron} />
    </button>
  );
}
