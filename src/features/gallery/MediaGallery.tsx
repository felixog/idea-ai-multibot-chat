import type { AudioMedia, ImageMedia, VideoMedia } from '../chat/types';
import { COVER_ID, HOOK_ID, LOOP_ID, newEditCard, seedMedia } from '../chat/script';
import { MediaAudio } from '../../components/rekka/MediaAudio/MediaAudio';
import { MediaImage } from '../../components/rekka/MediaImage/MediaImage';
import { MediaVideo } from '../../components/rekka/MediaVideo/MediaVideo';
import { EditCard } from '../../components/rekka/EditCard/EditCard';
import { Waveform } from '../../components/rekka/Waveform/Waveform';
import { AgentSteps } from '../../components/rekka/AgentSteps/AgentSteps';
import { CUT_4, CUT_8, HOOK_28 } from '../../lib/waveforms';
import { WARM_FILTER } from '../../lib/media';
import { EDITING } from '../chat/steps';
import { Block } from './Block';
import { NOOP_ACTIONS } from './noop';


export function MediaGallery() {
  const seed = seedMedia();
  const hook = seed[HOOK_ID] as AudioMedia;
  const cover = seed[COVER_ID] as ImageMedia;
  const loop = seed[LOOP_ID] as VideoMedia;
  const a = NOOP_ACTIONS;
  const gen = { percent: 33, stepIndex: 1 };
  const trimmedHook: AudioMedia = {
    ...hook, state: 'default', trim: { start: 4, end: 18 },
    changes: [{ id: 'x', icon: 'scissors', title: 'Trimmed to 0:04 to 0:18', detail: '14s kept from the 20s hook', tone: 'user', undone: false }],
  };
  const trimmedLoop: VideoMedia = {
    ...loop, trim: { start: 0.8, end: 5.4 },
    changes: [{ id: 'y', icon: 'scissors', title: 'Trimmed to 4.6s', detail: '0:00.8 to 0:05.4', tone: 'user', undone: false }],
  };
  const imgEdit = newEditCard('e1', 'iris', COVER_ID, 'image');
  const vidEdit = newEditCard('e2', 'iris', LOOP_ID, 'video');
  return (
    <>
      <Block title="Waveform" node="63:216">
        <Waveform bars={CUT_4} tone="brand" />
        <Waveform bars={CUT_8} tone="ink" />
        <Waveform bars={HOOK_28} tone="brand" />
      </Block>
      <Block title="AgentSteps" node="63:348" col>
        <AgentSteps title="Nova is making your hook" percent={33} stepIndex={1} steps={EDITING.image} />
      </Block>
      <Block title="MediaAudio" node="65:499">
        <MediaAudio media={{ ...hook, state: 'default' }} actions={a} />
        <MediaAudio media={{ ...hook, state: 'default' }} actions={a} toolbarLayout="compact" />
        <MediaAudio media={hook} actions={a} />
        <MediaAudio media={{ ...hook, state: 'generating', progress: gen }} actions={a} />
        <MediaAudio media={trimmedHook} actions={a} />
        <MediaAudio media={{ ...hook, state: 'default', current: 7, playing: true }} actions={a} />
      </Block>
      <Block title="MediaImage" node="65:665">
        <MediaImage media={{ ...cover, state: 'default' }} actions={a} />
        <MediaImage media={{ ...cover, state: 'default' }} actions={a} toolbarLayout="compact" />
        <MediaImage media={cover} actions={a} autoFocusEdit={false} />
        <MediaImage media={{ ...cover, state: 'generating', progress: gen }} actions={a} />
        <MediaImage media={{ ...cover, state: 'default', version: 2, filter: WARM_FILTER }} actions={a} />
      </Block>
      <Block title="MediaVideo" node="65:947">
        <MediaVideo media={loop} actions={a} />
        <MediaVideo media={loop} actions={a} layout="compact" />
        <MediaVideo media={{ ...loop, state: 'playing', current: 2 }} actions={a} />
        <MediaVideo media={{ ...loop, state: 'trimming' }} actions={a} />
        <MediaVideo media={{ ...loop, state: 'generating', progress: gen }} actions={a} />
        <MediaVideo media={trimmedLoop} actions={a} />
      </Block>
      <Block title="EditCard" node="66:942">
        <EditCard media={{ ...vidEdit, percent: 33 }} target={loop} actions={a} />
        <EditCard media={{ ...vidEdit, status: 'ready', percent: 100 }} target={loop} actions={a} />
        <EditCard media={{ ...imgEdit, status: 'ready', percent: 100 }} target={cover} actions={a} />
        <EditCard media={{ ...imgEdit, status: 'applied', percent: 100 }} target={{ ...cover, version: 2 }} actions={a} />
      </Block>
    </>
  );
}
