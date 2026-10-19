import { Download, PanelRightClose, Plus } from 'lucide-react';
import { madeItems } from '../../../features/chat/logic';
import { useChat } from '../../../features/chat/store';
import { Button } from '../Button/Button';
import { CastCard } from '../CastCard/CastCard';
import { IconButton } from '../IconButton/IconButton';
import { MadeItem } from '../MadeItem/MadeItem';
import s from './CastPanelContent.module.css';

export function CastPanelContent({ showTitle = true, titleId, onCollapse }: { showTitle?: boolean; titleId?: string; onCollapse?: () => void }) {
  const chat = useChat();
  const { muted } = chat.state;
  const rows = madeItems(chat.state);
  return (
    <div className={s.root}>
      {showTitle && (
        <div className={s.headRow}>
          <h2 id={titleId} className={`headline_3 ${s.heading}`}>In this chat</h2>
          {onCollapse && <IconButton variant="plain" size="sm" icon={PanelRightClose} id="hide-cast-button" label="Hide cast" aria-expanded aria-controls="cast-panel" onClick={onCollapse} />}
        </div>
      )}
      <CastCard character="nova" muted={muted.nova} onToggleMute={() => chat.toggleMute('nova')} />
      <CastCard character="iris" muted={muted.iris} onToggleMute={() => chat.toggleMute('iris')} />
      <section className={s.made} aria-labelledby="made-heading">
        <div className={s.madeHead}>
          <h3 id="made-heading" className="body_small_bold">Made in this chat</h3>
          <span className={`body_tiny ${s.count}`}>{rows.length} items</span>
        </div>
        <ul className={s.list}>
          {rows.map(({ media }) => (
            <li key={media.id}>
              <MadeItem media={media} onClick={() => chat.jumpTo(media.id)} />
            </li>
          ))}
        </ul>
        <div>
          <Button variant="link" size="sm" icon={Download} onClick={chat.downloadAll}>Download all</Button>
        </div>
      </section>
      <div>
        <Button variant="secondary" size="md" icon={Plus} onClick={() => chat.toast('The character library is coming soon')}>
          Add a character
        </Button>
      </div>
    </div>
  );
}
