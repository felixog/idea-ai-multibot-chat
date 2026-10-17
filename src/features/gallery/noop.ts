import type { MediaActions } from '../chat/types';

const noop = () => {};
export const NOOP_ACTIONS = new Proxy({}, { get: () => noop }) as MediaActions;
