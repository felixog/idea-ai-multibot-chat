import { forwardRef } from 'react';
import { Image } from 'lucide-react';
import { CAST } from '../../../features/chat/cast';
import { GENERATING } from '../../../features/chat/steps';
import type { ImageMedia, MediaActions } from '../../../features/chat/types';
import { Icon } from '../../../lib/icon';
import { details } from '../../../lib/media';
import { AgentSteps } from '../AgentSteps/AgentSteps';
import { ChangeList } from '../ChangeItem/ChangeItem';
import { EditSlot } from '../EditSlot/EditSlot';
import { CardSlot, MediaCard } from '../MediaCard/MediaCard';
import { MediaToolbar } from '../MediaToolbar/MediaToolbar';
import s from './MediaImage.module.css';

export const COVER_ALT = 'Cover art: a rainy night train window looking out on city lights in blue and amber';

interface Props {
  media: ImageMedia;
  actions: MediaActions;
  highlight?: boolean;
  toolbarLayout?: 'full' | 'compact';
  autoFocusEdit?: boolean;
}

export const MediaImage = forwardRef<HTMLElement, Props>(function MediaImage({ media: m, actions: a, highlight, toolbarLayout, autoFocusEdit = true }, ref) {
  const gen = GENERATING.image;
  return (
    <MediaCard ref={ref} kind="image" title={m.title} details={details(m)} highlight={highlight}>
      {m.state === 'generating' ? (
        <>
          <div className={s.skeleton}>
            <Icon icon={Image} size={24} />
          </div>
          <AgentSteps title={gen.title(CAST[m.owner].name)} percent={m.progress.percent} stepIndex={m.progress.stepIndex} steps={gen.steps} />
        </>
      ) : (
        <>
          <img className={s.image} src={m.src} alt={COVER_ALT} style={{ filter: m.filter ?? undefined }} />
          {m.changes.length > 0 && <ChangeList changes={m.changes} onToggle={(cid) => a.toggleChange(m.id, cid)} />}
          {m.state === 'editing' ? (
            <EditSlot
              prompt={m.prompt}
              versionLabel={`Used for v${m.version}`}
              value={m.changeDraft}
              autoFocus={autoFocusEdit}
              onChange={(t) => a.setChangeDraft(m.id, t)}
              onSubmit={() => a.submitEdit(m.id)}
              onCancel={() => a.cancelEdit(m.id)}
              onCopy={() => a.copyPrompt(m.id)}
            />
          ) : (
            <CardSlot>
              <MediaToolbar
                type="image"
                layout={toolbarLayout}
                onPrimary={() => a.startEdit(m.id)}
                onEditPrompt={() => a.startEdit(m.id)}
                onRegenerate={() => a.regenerate(m.id)}
                onDownload={() => a.download(m.id)}
              />
            </CardSlot>
          )}
        </>
      )}
    </MediaCard>
  );
});
