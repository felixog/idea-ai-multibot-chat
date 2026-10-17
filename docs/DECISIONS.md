# Decisions

Every place Figma and the brief disagreed, or the brief left something open, and what was chosen.
Rule: Figma wins on visuals; the brief wins on behaviour, copy and accessibility.

## Phase 1: foundations

Source: `get_variable_defs` on node 82:9278 (web-shell), 17 Oct 2026.

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `--border_Functional` | `var(--black-35)` (#b5815f) | `border/border_Functional` = #EBB491 (black-30) | **#ebb491 via `var(--black-30)`** | Visual value, so Figma wins. Affects input borders, tertiary-button hover border, typing dots, handles and the `@all` underline. Flag for Felix: if black-35 was intentional (more contrast on input borders), revert the one line in tokens.css. |
| 2 | Peach / Alt ramp names | `--backgroundElevation_Alt200` = black-20 (#ffd3ba), `_Alt300` = black-30 | `background/backgroundElevation_Alt100` = #FFD3BA, `_Alt200` = #EBB491 | Brief names, same values | Figma names are offset by one step after cleanup; the values match, and the brief says values are what must match. When reading `get_design_context` output: Figma Alt100 → `--backgroundElevation_Alt200`, Figma Alt200 → `--backgroundElevation_Alt300`. |
| 3 | Elevation names | `--backgroundElevation0/1/2` | `background/backgroundElevation` (#FFFAF7), `backgroundElevation100` (#FFFFFF), `backgroundElevation200` (#FFFAF7) | Brief names | Values match. |
| 4 | `--backgroundBlur` | #fffaf7eb (92% alpha) | reported as #FFFAF7 | Brief value | The MCP output drops alpha on this variable; a blur surface needs transparency. Recheck against the header screenshot in phase 5. |
| 5 | Headline tracking | -0.05em | `headline_3-letterSpacing` = -1 (px at 20px) | -0.05em | Identical at 20px. |
| 6 | Character variables | `--character-ring/-tag-bg/-tag-ink` | `character/agent_ring` #4261B8, `agent_tag_bg` #F5F9FF, `agent_tag_ink` #27418A (Nova mode) | Brief names | Values match Nova. Iris mode not exposed on this node; brief gold values used. |

Other phase 1 notes:

- `.is-small .body_tiny` added to typography.css for the phone preview (specified in "Demo affordances", placed in phase 1 so typography lives in one file).
- `CAST` lives in `src/features/chat/cast.ts` (the brief says "beside the tokens" but shows TypeScript; tokens.css cannot hold it).
- lucide-react resolved to 1.59.0 (brief: 0.400 or later). All 31 icons in the icon table exist.
- ESLint pinned to 9 with `@eslint/js@9`; `@eslint/js@10` requires ESLint 10, which `eslint-plugin-react-hooks@5` does not support yet.
- Playwright 1.64 expects a newer headless shell than the container has; `playwright.config.ts` points at the preinstalled `/opt/pw-browsers/chromium` instead of downloading.

## Phase 2: primitives

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 7 | Avatar ring (md, lg) | `box-shadow` ring outside the layout box on a cream pad; md takes 32 in layout | 62:25: 2px `--character-ring` border, 2px padding, `--character-tag-bg` fill; md is 36 in layout, lg 48 | Figma | Visual. md reads 36 exactly as the brief describes, it just occupies 36 in layout, which also fits the 36 avatar column. |
| 8 | Avatar xs, sm | no ring | 1px `--character-ring` border (xs 18, sm 22) | Figma | Visual. The AddresseeChip therefore measures 28 tall, not 26. |
| 9 | Avatar alt text | alt = name | n/a | alt = name by default; `decorative` (alt="") where the name is printed next to it | Avoids "Nova Nova" in screen readers. |
| 10 | TypingIndicator | a bot ChatMessage with dots | n/a | `TypingDots` lives in TypingIndicator/; the full row composes ChatMessage in phase 4 | ChatMessage is a phase 4 component. |
| 11 | Toast on mobile | 16 above the composer dock | n/a | fixed offset `calc(120px + 16px)`, `// TODO(spec)` | Dock height varies with the picker; revisit if it overlaps. |

## Phase 3: media

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 12 | Audio trim track border | not specified | 65:499 trimming: 1px peach hairline around the track | 1px `--border_Decorative` | Visual. |
| 13 | EditCard ready play badge | centred 36 `--backgroundBlur` play badge on the thumbnail | 66:942 ready: no badge | No badge | Visual; Figma ready state has only the duration badge. |
| 14 | EditCard working label | ProgressBar label = title | "Making your video" | "Making your video" / "Making your image" | Visual copy from Figma. |
| 15 | Video stage art | poster SVG | Figma uses a raster with an inner frame | poster SVG | Brief: use the SVG originals. Small visual diff expected inside the stage. |
| 16 | Extra building blocks | not named | n/a | `MediaCard` (shared shell + CardSlot), `TrimEditor` (waveform and frame-strip), `EditSlot` (PromptReference + Describe the change) | Shared by the three cards; the brief describes them inline. |
| 17 | Types | brief's types | n/a | added `progress` to MediaBase, `steps` to EditCardMedia, `shakeKey` to `ui`, `preview` to state | Needed to render AgentSteps, the chip shake and the phone preview from state. |
| 18 | Compact layout | container query < 300px | n/a | `container: mediacard` on the card; toolbar and stage switch at 268px content width | Same rule, card padding accounted for. |
| 19 | Edit prompt on the hook | Nova regenerates in place for 2400ms, v2 | n/a | copy "Reworking the hook with your note. v2 coming up." `// TODO(spec)` | The brief gives no reply copy for this case. |

## Phase 4: conversation and the static desktop

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 20 | Desktop frame height | 1440 x 2159 | Desktop 1440 frame is 2135; its Main component (82:5289) is 2159 | Page is 2159; the visual test checks height against 2159 | The frame clips the composer dock's 24px bottom padding. Measured rows match Figma's message-list (82:5527) to the pixel. |
| 21 | SystemLine role | `role="status"` | n/a | no role; the `role="log"` list announces it | A status region inside a live log would announce twice. |
| 22 | Mention insertion | replaces `@query` with " @Iris  " | n/a | "@Iris " (one trailing space) | Avoids a double space in the sent message. |
| 23 | Addressees from mentions | picking switches; two names address both | n/a | after a pick the addressees are every character named in the draft | Covers both rules in one place. |
| 24 | Re-opening Trim | "seed selection the first time, otherwise the full length" | n/a | re-opens on the current trim (or the seed selection) | Keeps the saved trim visible when adjusting it; Cancel keeps it. |
| 25 | Edit field focus on load | focused when editing opens | desktop shows the cover's field focused | focus only when the person opens editing; capture mode focuses it to match Figma | Stealing focus into the middle of the thread on load would hurt keyboard users. |
| 26 | Reply engine | typing 900 to 1400ms, 600ms between characters | n/a | one global queue; a muted character's queued reply is dropped, even mid-typing | "Replies never overlap" across triggers too. |

## Phase 5: shell and responsive

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 27 | Mobile message list spacing | padding 16, gap 12 | 82:9038: column at x 24, gaps 16, bottom 24 | padding 24, gap 16 (same as desktop) | Visual. Cards span x 72 to 366 at 390, as in Figma. |
| 28 | Compact media threshold | card < 300px | at 390 the card is 294 and Figma keeps the full 236 stage and full toolbar | compact when the card is < 280px (content < 248) | Keeps 390 identical to Figma; a 320px phone (card 224) still gets compact. |
| 29 | Tiny text in the mobile shell | 10/12 only under 577px | Tablet 744 header and system lines use 10/12 | the mobile shell root carries `is-small` at every width | Visual; Figma's mobile shell uses the Small Screen mode. |
| 30 | Bot bubble width on mobile | hug, max 560 | inconsistent: the hook reply hugs; two later bubbles fill the column (overrides) | hug, as in the ChatMessage component | Follows the component, not the per-instance overrides. Costs about 1% in the tablet diff. |
| 31 | Mentioning capture | `@I` filters to Iris | Tablet and Mobile frames show Iris, Nova and @all with "@I" typed | Real typing filters by prefix; `?state=mentioning` reproduces the frame (query empty, draft "@I") | Brief's filter rule is behaviour; the frame is a visual. |
| 32 | Mobile capture height | root height auto | frames are 2159 tall, clipped at the top, anchored to the composer | mobile and tablet captures keep the fixed-height app shell (viewport 2159), scrolled to the newest message | Reproduces the frame geometry. |
| 33 | Drawer focus return | focus returns to the trigger | n/a | Drawer remembers the focused element when it opens and restores it | The store opens drawers, so Radix has no Trigger to return to. |

Visual diff after phase 5 (pixelmatch, threshold 0.1): desktop 0.76%, tablet 4.79%, mobile 6.02%. The tablet and mobile remainder is a 2px taller mention picker title (18 in Figma at 10/12 type) that shifts the bottom-anchored thread, Figma wrapping "Want a 6 second loop for the teaser?" onto two lines where the browser fits one, and the raster video still in Figma vs the SVG poster here.
