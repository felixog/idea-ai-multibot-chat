import { User, Volume2, VolumeX } from 'lucide-react';
import { Icon } from '../../../lib/icon';
import s from './SystemLine.module.css';

const ICONS = { user: User, mute: VolumeX, unmute: Volume2 };

export function SystemLine({ icon, text }: { icon: 'user' | 'mute' | 'unmute'; text: string }) {
  return (
    <p className={`body_tiny ${s.root}`}>
      <Icon icon={ICONS[icon]} size={12} />
      {text}
    </p>
  );
}
