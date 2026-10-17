import { CAST, type CharacterId } from '../../../features/chat/cast';
import s from './CharacterTag.module.css';

export function CharacterTag({ character }: { character: CharacterId }) {
  const c = CAST[character];
  return (
    <span data-character={c.bot} className={`body_tiny ${s.root}`}>
      {c.role}
    </span>
  );
}
