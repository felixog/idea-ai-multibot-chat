import { forwardRef } from 'react';
import { CAST } from '../../../features/chat/cast';
import { GENERATING } from '../../../features/chat/steps';
import type { AudioMedia, MediaActions } from '../../../features/chat/types';
import { details, duration } from '../../../lib/media';
import { AgentSteps } from '../AgentSteps/AgentSteps';
import { ChangeList } from '../ChangeItem/ChangeItem';
import { EditSlot } from '../EditSlot/EditSlot';
import { CardSlot, MediaCard } from '../MediaCard/MediaCard';
import { MediaToolbar } from '../MediaToolbar/MediaToolbar';
import { TrimEditor } from '../TrimEditor/TrimEditor';
import { VoicePlayer } from '../VoicePlayer/VoicePlayer';

interface Props {
  media: AudioMedia;
  actions: MediaActions;
  highlight?: boolean;
  toolbarLayout?: 'full' | 'compact';
}

export const MediaAudio = forwardRef<HTMLElement, Props>(function MediaAudio({ media: m, actions: a, highlight, toolbarLayout }, ref) {
  const gen = GENERATING.audio;
  return (
    <MediaCard ref={ref} kind="audio" title={m.title} details={details(m)} highlight={highlight}>
      {m.state === 'generating' ? (
        <AgentSteps title={gen.title(CAST[m.owner].name)} percent={m.progress.percent} stepIndex={m.progress.stepIndex} steps={gen.steps} />
      ) : m.state === 'trimming' ? (
        <TrimEditor
          variant="waveform"
          duration={m.fullDuration}
          range={m.pendingTrim}
          min={2}
          step={0.5}
          onChange={(r) => a.setPendingTrim(m.id, r)}
          onSave={() => a.saveTrim(m.id)}
          onCancel={() => a.cancelTrim(m.id)}
        />
      ) : (
        <>
          <VoicePlayer duration={duration(m)} current={m.current} playing={m.playing} onToggle={() => a.togglePlay(m.id)} onSeek={(sec) => a.seek(m.id, sec)} />
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
                type="audio"
                layout={toolbarLayout}
                onPrimary={() => a.startTrim(m.id)}
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
