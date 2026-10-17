import { createContext, useContext, useEffect, useState } from 'react';

export const BREAKPOINTS = { tiny: 577, lg: 1024, xl: 1280 } as const;

export type Layout = 'web' | 'web-collapsed' | 'mobile';

export function layoutForWidth(width: number): Layout {
  if (width >= BREAKPOINTS.xl) return 'web';
  if (width >= BREAKPOINTS.lg) return 'web-collapsed';
  return 'mobile';
}

/** Set by the phone preview to force a layout regardless of window width. */
export const ForcedLayoutContext = createContext<Layout | null>(null);

export function useLayout(): Layout {
  const forced = useContext(ForcedLayoutContext);
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? BREAKPOINTS.xl : window.innerWidth));

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return forced ?? layoutForWidth(width);
}
