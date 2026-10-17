import { CAST, type CharacterId } from '../../../features/chat/cast';
import s from './TypingIndicator.module.css';

/** The three dots and their screen-reader text; ChatMessage supplies the avatar and header around them. */
export function TypingDots({ character }: { character: CharacterId }) {
  return (
    <>
      <span className={s.dots} aria-hidden="true">
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
      </span>
      <span className="visually-hidden">{CAST[character].name} is typing</span>
    </>
  );
}
