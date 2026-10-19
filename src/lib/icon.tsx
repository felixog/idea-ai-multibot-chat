import type { LucideIcon, LucideProps } from 'lucide-react';

export type { LucideIcon };

/** Lucide at Rex's stroke width, coloured by currentColor. Decorative unless a label is given. */
export function Icon({ icon: Glyph, size = 16, ...rest }: { icon: LucideIcon; size?: number } & LucideProps) {
  return <Glyph size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" {...rest} />;
}
