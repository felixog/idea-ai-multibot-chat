import { Volume2, VolumeX } from 'lucide-react';
import { CAST, type CharacterId } from '../../../features/chat/cast';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { CharacterTag } from '../CharacterTag/CharacterTag';
import s from './CastCard.module.css';

export function CastCard({ character, muted, onToggleMute }: { character: CharacterId; muted: boolean; onToggleMute: () => void }) {
  const c = CAST[character];
  return (
    <section id={`cast-card-${character}`} aria-label={c.name} data-character={c.bot} className={s.root}>
      <div className={s.head}>
        <Avatar character={character} size="lg" decorative muted={muted} />
        <div className={s.names}>
          <span className={`body_bold ${s.name}`}>{c.name}</span>
          <CharacterTag character={character} />
        </div>
      </div>
      <p className={`body_small ${s.bio}`}>{c.bio}</p>
      {muted && <p className={`body_tiny ${s.note}`}>Won’t reply until you unmute</p>}
      <div className={s.actions}>
        <Button variant="tertiary" size="sm" icon={muted ? Volume2 : VolumeX} aria-pressed={muted} onClick={onToggleMute}>
          {muted ? `Unmute ${c.name}` : `Mute ${c.name}`}
        </Button>
      </div>
    </section>
  );
}
