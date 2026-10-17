import { forwardRef } from 'react';
import { CAST } from '../../../features/chat/cast';
import { GENERATING } from '../../../features/chat/steps';
import type { MediaActions, VideoMedia } from '../../../features/chat/types';
import { details, duration, POSTER_SRC } from '../../../lib/media';
import { AgentSteps } from '../AgentSteps/AgentSteps';
import { ChangeList } from '../ChangeItem/ChangeItem';
import { EditSlot } from '../EditSlot/EditSlot';
import { CardSlot, MediaCard } from '../MediaCard/MediaCard';
import { MediaToolbar } from '../MediaToolbar/MediaToolbar';
import { TrimEditor } from '../TrimEditor/TrimEditor';
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';

interface Props {
  media: VideoMedia;
  actions: MediaActions;
  highlight?: boolean;
  /** Forces compact (gallery); otherwise the card's container query decides. */
  layout?: 'full' | 'compact';
  filter?: string | null;
}

export const MediaVideo = forwardRef<HTMLElement, Props>(function MediaVideo({ media: m, actions: a, highlight, layout, filter }, ref) {
  const gen = GENERATING.video;
  const trimming = m.state === 'trimming';
  return (
    <MediaCard ref={ref} kind="video" title={m.title} details={details(m)} highlight={highlight}>
      {m.state === 'generating' ? (
        <AgentSteps title={gen.title(CAST[m.owner].name)} percent={m.progress.percent} stepIndex={m.progress.stepIndex} steps={gen.steps} />
      ) : (
        <>
          <VideoPlayer
            poster={POSTER_SRC}
            filter={filter}
            duration={trimming ? m.fullDuration : duration(m)}
            current={trimming ? m.pendingTrim.start : m.current}
            playing={m.state === 'playing'}
            size={layout ?? 'full'}
            caption="Late trains, city lights"
            muted={m.muted}
            onToggle={() => a.togglePlay(m.id)}
            onSeek={(sec) => a.seek(m.id, sec)}
            onToggleMute={() => a.toggleVideoMute(m.id)}
          />
          {trimming ? (
            <TrimEditor
              variant="frames"
              duration={m.fullDuration}
              range={m.pendingTrim}
              min={1}
              step={0.1}
              onChange={(r) => a.setPendingTrim(m.id, r)}
              onSave={() => a.saveTrim(m.id)}
              onCancel={() => a.cancelTrim(m.id)}
            />
          ) : (
            <>
              {m.changes.length > 0 && <ChangeList changes={m.changes} onToggle={(cid) => a.toggleChange(m.id, cid)} />}
              {m.state === 'editing' ? (
                <EditSlot
                  prompt={m.prompt}
                  versionLabel={`Used for v${m.version}`}
                  value={m.changeDraft}
                  onChange={(t) => a.setChangeDraft(m.id, t)}
                  onSubmit={() => a.submitEdit(m.id)}
                  onCancel={() => a.cancelEdit(m.id)}
                  onCopy={() => a.copyPrompt(m.id)}
                />
              ) : (
                <CardSlot>
                  <MediaToolbar
                    type="video"
                    layout={layout}
                    onPrimary={() => a.startTrim(m.id)}
                    onEditPrompt={() => a.startEdit(m.id)}
                    onRegenerate={() => a.regenerate(m.id)}
                    onDownload={() => a.download(m.id)}
                  />
                </CardSlot>
              )}
            </>
          )}
        </>
      )}
    </MediaCard>
  );
});
