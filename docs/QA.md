# QA report

Run on 17 Oct 2026 against `npm run preview` in headless Chromium (Playwright 1.64). Legend: **Pass** (verified by an automated test or a screenshot I opened), **Pass, manual** (verified by screenshot only), **Not verified here** (needs a tool or browser this container does not have).

## Automated checks (`npm run check`)

| Check | Result |
| --- | --- |
| ESLint | Pass, 0 warnings |
| Token audit (`check:tokens`) | Pass: no hex, rgb(), hsl() or literal font sizes outside tokens.css and typography.css |
| TypeScript strict build | Pass, no `any` |
| axe at 1440 (load, picker open), 1100 (cast drawer), 390 (load, chats drawer, cast sheet), 320 (More menu open) | Pass: 0 serious or critical |
| Keyboard demo path (trim, edit and apply, play, mention, mute, checklist) | Pass |
| Interaction flows (7) incl. no console errors or warnings, reduced motion | Pass |
| Visual diff, artwork masked (see DECISIONS #34) | Desktop 1440: 0.63%, Tablet 744: 1.92%, Mobile 390: 1.87% (all under 2%); heights 2159 |

## Acceptance criteria

**Visual match**

- [x] 1440 x 900: sidebar edge x 280, message column x 320 to 1080, cast panel from x 1120, header 75 tall, cast border full height. Measured in the browser.
- [x] 744 and 390: header 61 tall, composer dock padding 8 16 16, tiny text 10/12. List padding is 24, not 16: Figma's mobile column uses 24 (DECISIONS #27).
- [x] `?capture=full&state=mentioning` reproduces the Figma mentioning frames. Real typing of `@I` filters to Iris per the brief's filter rule (DECISIONS #31).
- [x] Radii, padding and shadows per spec; cards cap at 480 (400 for images); bubbles wrap at 560.
- [x] Fonts load (Karla 800, DM Sans 400/500/700, Caveat) with `display=swap`.

**Tokens and code hygiene**

- [x] `check:tokens` passes.
- [x] Every text element uses a typography class.
- [x] Component names and folders match the brief (plus the shared parts listed in DECISIONS #16 and #38); TypeScript strict, no `any`.

**States reachable by interaction**

- [x] MediaAudio: default, playing, trimming (live times while dragging or arrowing), generating (Regenerate, Edit prompt), trimmed with ChangeItem, undo and redo.
- [x] MediaImage: default, editing (PromptReference read-only, Copy with toast, field focused), generating (Regenerate), v2 after apply.
- [x] MediaVideo: default, playing with caption, trimming, generating, editing via Edit prompt, compact with the More menu under 280px card width (320 window).
- [x] EditCard image and video: working with advancing steps, ready with Before / After, applied, Undo apply, Refine.
- [x] Composer: idle (mic), typing (send), mentioning (picker), chips, last-chip protection (shake + toast).
- [x] Cast: mute and unmute with SystemLines and the muted CastCard; muted characters never reply; Made in this chat rows jump and highlight.
- [x] 1024 to 1279 cast drawer; below 1024 chats drawer and cast sheet (swipe down on the handle closes); Phone 390 preview.
- [x] Toasts for every row of the Toasts table.

**Accessibility and keyboard**

- [x] Whole demo path works with the keyboard, focus ring at every step.
- [x] axe: no serious or critical issues. Lighthouse: **Not verified here** (Lighthouse is not installed in this container).
- [x] New messages are announced through the `role="log"` list; steps through a polite live list. Screen-reader listening test: **Not verified here**.
- [x] Reduced motion removes loops and transforms (tested on the video poster and typing dots; global rule covers the rest).

**Copy and behaviour**

- [x] Copy matches the brief, British spelling, no em dashes (grep).
- [x] Replies wait for the typing indicator and never overlap (single queue); addressee rules followed.
- [x] Reset demo restores the seed (trim and edit states included) and clears every timer.
- [x] No console errors or warnings in Chromium. Safari and Firefox: **Not verified here** (only Chromium is installed).

## Known gaps

- The Figma Tablet frame shows two bot bubbles stretched full width while the hook reply hugs its text; the build follows the component (hug). DECISIONS #30.
- Figma wraps "Want a 6 second loop for the teaser?" onto two lines at 744 where the browser fits one line.
- The video stage and cover are the SVG originals, not Figma's raster fills, so artwork is masked in the visual test.
