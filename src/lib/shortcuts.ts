const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Display text for a Cmd/Ctrl shortcut: "⌘B" on Apple devices, "Ctrl B" elsewhere. */
export function modKey(key: string): string {
  return isMac ? `⌘${key}` : `Ctrl ${key}`;
}

/** aria-keyshortcuts value for a Cmd/Ctrl shortcut. */
export function modAria(key: string): string {
  return isMac ? `Meta+${key}` : `Control+${key}`;
}

export const SHORTCUTS = { chats: 'B', cast: '.' } as const;
