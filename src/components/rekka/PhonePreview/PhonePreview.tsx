import { useState, type ReactNode } from 'react';
import { ForcedLayoutContext } from '../../../lib/breakpoints';
import { Button } from '../Button/Button';
import s from './PhonePreview.module.css';

/** Renders the app inside a 390 x 844 frame with the mobile layout forced. */
export function PhonePreview({ onBack, children }: { onBack: () => void; children: (frame: HTMLElement | null) => ReactNode }) {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  return (
    <div className={s.stage}>
      <Button variant="link" size="sm" onClick={onBack}>Back to full view</Button>
      <div ref={setFrame} className={`${s.frame} is-small`} aria-label="Phone preview, 390 by 844" role="region">
        <ForcedLayoutContext.Provider value="mobile">{frame && children(frame)}</ForcedLayoutContext.Provider>
      </div>
    </div>
  );
}
