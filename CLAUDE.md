# Rekka multi-bot chat prototype

One-page, interactive React prototype of a web chat where one person directs two AI characters:
Nova (Bot A, Producer, oceanic ring) and Iris (Bot B, Visual director, gold ring).
The spec is docs/BRIEF.md. Read it before any work and re-read the section you are working on.
Visual source of truth: Figma file mXVWjW8DQRoi3pdiBcY0Gi (node IDs in the brief's "Figma map").

## Commands
- npm run dev          local dev server
- npm run build        type-check and build to dist/
- npm run preview      serve dist/ on port 4173 (tests run against this)
- npm run check        lint, token audit, build, axe, visual diff. Must pass before any commit that ends a phase.

## How to work
- Follow the seven phases in the brief, in order. Stop for review at the end of each phase unless told to continue.
- Figma MCP is read-only for this project. Use get_design_context, get_screenshot, get_variable_defs, get_metadata
  on one node at a time (never the whole Components board 83:12440). Never use write tools on the file.
- Figma wins on visuals; the brief wins on behaviour, copy and accessibility. Log every disagreement in docs/DECISIONS.md.
- After building anything visible: screenshot it with Playwright, compare with the Figma PNG, open the diff image and fix.
- Commit at the end of each phase: "phase N: <what>".
- Ask before the first production deploy (vercel --prod).

## Code rules
- Every colour, size, radius, shadow and font comes from src/styles/tokens.css or typography.css. No raw hex, rgb(),
  hsl() or literal font sizes anywhere else. scripts/check-tokens.mjs enforces this.
- Components live in src/components/rekka/<Name>/<Name>.tsx with <Name>.module.css, named exactly as in the brief.
- Character identity comes from data-character="bot-a" | "bot-b" and the --character-* variables; never hard-code
  oceanic or gold in a component.
- State: one reducer and context in src/features/chat/store.tsx. Timers live in simulate.ts and are cleared on unmount
  and on Reset demo. No backend, no network calls at runtime.
- Icons: lucide-react, strokeWidth 1.75, currentColor. Images: the four SVGs in public/assets/.
- Accessibility: every control works by keyboard with a visible --focusRing; icon buttons have aria-labels;
  reduced motion removes transforms and loops.
- Copy: exactly as in the brief, British spelling, no em dashes.
- No new dependencies beyond the brief's list without a note in docs/DECISIONS.md.

## Environment notes
- Playwright uses the preinstalled Chromium at /opt/pw-browsers/chromium (set in playwright.config.ts). Do not run
  `playwright install`. Override with PW_CHROMIUM if needed.
