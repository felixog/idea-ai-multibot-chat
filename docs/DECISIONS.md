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

## Phase 6: interactions

| # | Topic | Brief | Figma | Chosen | Why |
| --- | --- | --- | --- | --- | --- |
| 34 | Visual diff masking | compare whole screens | Figma renders raster image fills for the art | the visual test blanks `[data-visual-mask]` regions (avatars, cover, video stage, Made in this chat thumbnails) in both images | The brief requires the SVG originals, so the art can never match the rasters pixel for pixel; the test measures the UI around it. |
| 35 | Waveform layout | flex, gap 4 | bars keep 6px and overlap in tight regions | bars positioned edge to edge by index | Visual; at 390 the selection is narrower than 28 bars need. |
| 36 | Picker label on small type | 4 8 padding | 18 tall in the Tablet and Mobile frames | 3px 8px under `.is-small` | Visual (2px). |
| 37 | Mentioning capture focus | n/a | message box shown focused | `?state=mentioning` focuses the message box | Visual. |
| 38 | Segmented | EditCard pair and demo pair styled alike | n/a | one `Segmented` component used by both | Same visual, one implementation. |
| 39 | Checklist row 5 (mute) | scroll to and highlight | n/a | web: focuses the first Mute button in the cast panel; narrower: opens the cast drawer or sheet | The panel is always visible at 1280 and up. |
| 40 | Extra test file | a11y + visual | n/a | `tests/interactions.spec.ts` (6 flows) added to `npm run check` | Covers states the keyboard path does not: video trim undo/redo, video EditCard, regenerate, last chip, muted replies, phone preview, Reset. |

Visual diff after phase 6 (artwork masked): desktop 0.63%, tablet 1.92%, mobile 1.87%, heights 2159 / 2159 / 2159.
| 41 | Compact video time label | n/a | n/a | hidden when the card is under 280px; the scrubber keeps a 48px minimum | At 320 the label left no room for the scrubber. The slider's aria-valuetext still gives the time. |

## After launch: Felix's review (19 Oct 2026)

| # | Topic | Before | Chosen | Why |
| --- | --- | --- | --- | --- |
| 42 | Composer tray background | `--backgroundElevation0` (cream, as in Figma and the brief) | `--backgroundElevation1` (white) | Felix: the input area must read clearly as separate from the thread. |
| 43 | Space under the last message | list padding-bottom 24, but at full scroll the last message sat flush on the composer | the message column sizes to its content (`align-self: flex-start`) and carries the 24 bottom padding | The column was stretched to the viewport height, so its content overflowed and the padding landed mid-thread. Captures are unchanged. |
| 44 | Product name | Rekka | Rex in every piece of UI copy, metadata (title, Open Graph, Twitter), README, CLAUDE.md and code comments | Felix's rename. Left unchanged: `src/components/rekka/` folder, the `rekka-multibot-chat` package, repo, Vercel project and URL (renaming those breaks the live link), and docs/BRIEF.md and earlier rows here, which record the brief as written. |
| 45 | Composer dock bottom spacing | desktop dock padding 0 24 24; mobile dock 8 16 16 (Figma) | the tray sits flush on the bottom edge on every layout; the tray's own 16 bottom padding grows by `env(safe-area-inset-bottom)` | Felix: no gap under the input card. Desktop page height is now 2135, the Figma frame's own height. The mobile capture (`?capture=full`) restores Figma's 16 so the tablet and mobile diffs keep measuring everything else. |
| 46 | Collapsible sidebars | not in the brief | chats sidebar and cast panel collapse on web layouts (≥ 1024): "Hide chats" / "Hide cast" in each panel header; "Show chats" in the thread header; the avatar stack becomes "Show cast" (with a panel icon) at ≥ 1280 and still opens the drawer at 1024 to 1279 | Felix's request. 200ms width transition; collapsed panels are `visibility: hidden` so they leave the tab order; focus moves to the matching toggle; the choice is remembered per viewer in localStorage and survives Reset demo. |
| 47 | Sidebar collapse model (replaces #46) | panels hidden to 0; a separate "Show chats" button in the thread header; avatar stack reopens the cast | **Rails.** Each side is a `SidePanel` that collapses to a 64px icon rail (`--layout-rail`). One toggle per panel in its top row (PanelLeft/Right Close/Open icons), the same element in both states so focus stays on it. Tooltips on hover and keyboard focus with the shortcut: ⌘/Ctrl+B chats, ⌘/Ctrl+. cast (`aria-keyshortcuts`). Left: "Rex" wordmark + toggle, then "New chat" and "Try the prototype" (progress n/6, toggles the demo card) as nav rows, then a "Chats" section label; rail: New chat, Chats, Try the prototype. Right: "In this chat" + toggle; rail: Nova and Iris (muted badge), Made in this chat with a count, Add a character; a rail icon expands the panel and focuses that card or list. 1024 to 1279: the cast is always a rail and opens the drawer. Top rows are 75 tall so they line up with the thread header. | Felix asked for a significantly better model, referencing ChatGPT's sidebar. The left sidebar no longer follows Figma's "Chats + plus" header, so the desktop visual test masks it (desktop 1.30%). |
| 48 | Muted owner and direct edits | a muted character never replies | a request on a character's own media (Make changes, Edit prompt) is delivered even while that character is muted; muting still silences chat replies, trim reactions and the "Love the amber" reaction | Bug from Felix's review: with Iris muted, Make changes on the cover was swallowed, so no EditCard arrived and row 2 could never tick. Row 2 now also shows a "started" state once changes are requested. |
| 49 | Audio trim track | three regions each with its own waveform (cut-start, selection, cut-end), stretched to the region | one fixed waveform for the whole clip (`HOOK_BARS`, 40 bars = 2 a second, the seed's three sets joined), with the orange selection and the handles moving over it; bars inside the selection are light, outside are ink at 45%, and the bar under each handle hides | Felix's review: moving a handle squashed or spread the bars, so the audio looked different at every position. A real trim editor never redraws the audio. |
| 50 | Other chats | placeholders: rows for "Sunday market vlog" and "Album cover ideas" that only showed a toast | **Three real chats.** Each chat has its own messages, addressees and draft (`ThreadData`); media and the cast stay shared. Switching remounts the thread at the newest message and pauses playback. Replies keep the chat they were asked in, so a reply that lands while you are elsewhere goes into that chat and marks it unread (orange dot, primary-ink preview). The first message today in an older chat adds a Today divider. Plain replies and "make another" art and sound come from a per-chat script (`CHAT_SCRIPTS`). Checklist rows and Made in this chat jump across chats. **Sunday market vlog** (yesterday): Nova's 15s acoustic intro, Iris's three thumbnails. **Album cover ideas** (Monday, unread): a night-radio EP cover, Nova's station sting, and Iris's darker, grainier v2 ready to apply. | Felix: make the prototype richer. New art in `public/assets/` (market-flower-stall, market-coffee-cart, market-string-lights, night-radio, night-radio-grain), same flat style and palette as the original four. Supporting types: `AudioMedia.tags`, `ImageMedia.alt` / `beforeSrc`, `EditCardMedia.afterSrc` / `afterFilter`, ChangeItem icon `film`. |
