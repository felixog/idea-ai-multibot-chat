import { Lightbulb, MessagesSquare, SquarePen } from 'lucide-react';
import { useChat } from '../../../features/chat/store';
import { DEMO_HIDDEN_KEY, writeFlag } from '../../../lib/storage';
import { DEMO_ROW_KEYS } from '../DemoCard/rows';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';
import s from './SidebarRail.module.css';

/** The chats sidebar collapsed to icons. Each icon expands the sidebar or acts directly. */
export function SidebarRail({ onExpand }: { onExpand: () => void }) {
  const chat = useChat();
  const doneCount = DEMO_ROW_KEYS.filter((k) => chat.state.demo.done.includes(k)).length;
  const tips = `Try the prototype · ${doneCount} of ${DEMO_ROW_KEYS.length} done`;
  return (
    <div className={s.root}>
      <Tooltip label="New chat">
        <IconButton variant="plain" size="md" icon={SquarePen} label="New chat" onClick={chat.startNewChat} />
      </Tooltip>
      <Tooltip label="Chats">
        <IconButton variant="plain" size="md" icon={MessagesSquare} label="Chats" onClick={onExpand} />
      </Tooltip>
      <Tooltip label={tips}>
        <IconButton
          variant="plain"
          size="md"
          icon={Lightbulb}
          label={tips}
          onClick={() => {
            writeFlag(DEMO_HIDDEN_KEY, false);
            chat.setDemoDismissed(false);
            onExpand();
          }}
        />
      </Tooltip>
    </div>
  );
}
