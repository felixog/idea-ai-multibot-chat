# Rekka Multi-Bot Chat: Claude Code build brief

Oct 17, 2026 · Felix Oginni

> Saved from the brief pasted into Claude Code on 17 Oct 2026. Only change: the four SVG source blocks are not repeated here; they are saved verbatim in `public/assets/`. The canonical token values are in `src/styles/tokens.css` (see `docs/DECISIONS.md` for the one Figma override).

## How to run this brief in Claude Code

Claude Code builds a single-page, fully interactive React prototype straight from the Figma file through the Figma MCP server, checks every screen against Figma screenshots, then deploys it free to Vercel. This brief supplies the node IDs, exact values, behaviour, copy and checks; Figma supplies the pixels.

**Setup (about five minutes)**

1. Create an empty folder, for example `rekka-multibot-chat`, and start Claude Code in it.
2. Connect Figma, if it is not already connected. Recommended: `claude plugin install figma@claude-plugins-official`, restart Claude Code, open `/plugin`, choose `figma` and sign in. Manual alternative: `claude mcp add --transport http figma https://mcp.figma.com/mcp`, then `/mcp`, choose figma, Authenticate.
3. Export this doc as Markdown and save it as `docs/BRIEF.md`. Save the "CLAUDE.md" section at the end as `CLAUDE.md` in the folder root.
4. Optional fallback: put the seven reference PNGs (`desktop-1440.png`, `tablet-744.png`, `mobile-390.png`, `components-chat-message.png`, `components-media.png`, `components-composer.png`, `edit-card.png`) in `docs/reference/`, for when the Figma MCP is rate-limited.
5. First prompt: *Read CLAUDE.md and docs/BRIEF.md. Confirm Figma access with `whoami` and `get_metadata` on node 82:10705, then do phase 1 and stop for my review.*

**Phases.** Each phase ends with the "Verification loop" for what it built and a git commit (`phase N: <what>`). Stop after each phase for a quick review unless told to continue.

1. **Foundations.** Scaffold the app ("Tech stack"), write `tokens.css` and `typography.css` from this brief, cross-check them with `get_variable_defs` on node 82:9278, load the fonts, save the four SVGs.
2. **Primitives.** Avatar, CharacterTag, AddresseeChip, Button, IconButton, StatusBadge, TypingIndicator, Toast. For each: `get_design_context` on its Figma node, build, then compare with `get_screenshot`.
3. **Media.** Waveform, VoicePlayer, VideoPlayer, ProgressBar, AgentSteps, Menu, MediaToolbar, PromptReference, MediaAudio, MediaImage, MediaVideo, ChangeItem, EditCard.
4. **Conversation and the static desktop.** ChatMessage, SystemLine, DayDivider, MentionPicker, Composer, the seed script, and the full Desktop 1440 layout without interactions. Compare against node 82:10705 at 1440 wide.
5. **Shell and responsive.** Sidebar, ThreadHeader, CastPanelContent, the 1024 collapse, the mobile shell with chats drawer and cast sheet. Compare against 82:10706 at 744 and 82:10707 at 390.
6. **Interactions.** Everything in "Interactions and state model", then "Motion, accessibility and keyboard" and "Demo affordances".
7. **QA and deploy.** Tick every box in "Acceptance criteria", run all automated checks, then follow "Deploy to Vercel" and report the live URL.

**Using the Figma MCP well**

- Call `get_design_context` on one component set or screen at a time, never on the whole Components board (83:12440 is too large for one call). Treat its output as a reference for structure and values: map every colour, space, radius and text style to the tokens in this brief and reuse this repo's components; never paste generated code that carries raw hex or one-off sizes.
- Call `get_variable_defs` to map Figma variable names to `tokens.css` names. Some Figma styles were renamed during cleanup (for example `background/backgroundElevation` is the cream ground, `--backgroundElevation0` here); the values are what must match.
- Call `get_screenshot` on the same node to compare visually against a Playwright screenshot of the local build at the same width.
- The Figma file is read-only for this job: no write tools (`use_figma`, `generate_figma_design`, Code Connect writes).
- Use the SVG sources in "Icons and image assets" rather than the raster image fills in Figma; they are the originals and stay sharp.
- When Figma and this brief disagree: Figma wins on visuals (size, spacing, colour, type), this brief wins on behaviour, copy and accessibility. Note every disagreement in `docs/DECISIONS.md`.

**Non-negotiable rules**

- Never invent a colour, font size, spacing, radius or shadow. Every value comes from a custom property in `tokens.css`. No raw hex in components.
- Use the component names in this brief as React component names (PascalCase), one folder per component under `src/components/rekka/` with its `.tsx` and `.module.css`.
- British spelling in all UI copy. No em dashes in UI copy.
- No backend, no auth, no external API at runtime. All state lives in React (a reducer plus context). Simulate AI work with timers.
- Light mode only. The only dark surfaces are the video stage and toasts.
- When something is not specified anywhere, choose the closest existing token and leave a `// TODO(spec)` comment.

## Figma map

File key `mXVWjW8DQRoi3pdiBcY0Gi` ([open in Figma](https://www.figma.com/design/mXVWjW8DQRoi3pdiBcY0Gi/Felix-Oginni-%7C-Idea.ai-Challenge-%7C-Creative-Fabrica)). Pass the file key and a node ID to `get_design_context`, `get_screenshot`, `get_metadata` or `get_variable_defs`. Pages: Cover (58:2), :: Screens (24:6495), Design System (0:1), Archive (24:6494, ignore it).

**Screens** (page :: Screens)

| Screen | Node | Size | Use |
| --- | --- | --- | --- |
| Desktop 1440 | 82:10705 | 1440 x 2159, full-length capture | Phase 4 target |
| Tablet 744 | 82:10706 | 744 x 2159, mobile shell | Phase 5 target |
| Mobile 390 | 82:10707 | 390 x 2159, mobile shell, picker open | Phase 5 target |
| screen-template (set) | 82:9279 | web-shell 82:9278, mobile-shell 82:9277 | The two shells as components; `get_variable_defs` on 82:9278 lists every token the screens use |
| \_Read me | 83:11015 | 1440 wide | Context only: target user, decisions, inspiration |

**Shell parts** (Design System page, section-shell and section-navigation)

| Part | Node |
| --- | --- |
| Main (thread header, message list, composer dock) | 82:5289 |
| message-list | 82:5527 |
| cast-panel | 82:4565 |
| sidebar | 82:8220 |
| sidebar-header | 82:4957 |
| chat-list | 82:4904 |
| made-in-this-chat | 82:4707 |

**Components** (Design System page, board 83:12440)

| Component | Node | Variants in Figma | Spec in this brief |
| --- | --- | --- | --- |
| ChatMessage | 66:1065 | sender = User, Bot A (Nova), Bot B (Iris); props Message, Time, Show header, Show media, Media (swap) | Part 4 |
| Composer | 67:1220 | state = idle, typing, mentioning x layout = desktop, mobile | Part 4 |
| MentionPicker | 67:918 | single | Part 4 |
| MentionOption | 67:917 | character = Iris, Nova, All x selected | Part 4 |
| MediaAudio | 65:499 | default full, default compact, trimming, generating | Part 3 |
| MediaImage | 65:665 | default full, default compact, editing, generating | Part 3 |
| MediaVideo | 65:947 | default full, default compact, playing, trimming, generating | Part 3 |
| EditCard | 66:942 | status = working, ready | Part 3 |
| ChangeItem | 66:750 | single | Part 3 |
| PromptReference | 65:271 | single | Part 2 |
| MediaToolbar | 63:643 | primary = Trim, Edit x layout = full, compact x menu | Part 2 |
| MenuItem | 63:395 | state = default, hover | Part 2 |
| AgentSteps | 63:348 | single (three exposed AgentStep rows) | Part 2 |
| AgentStep | 63:347 | state = done, active, pending | Part 2 |
| VideoPlayer | 63:321 | state = paused, playing x size = full, compact | Part 2 |
| VoicePlayer | 63:220 | single | Part 2 |
| Waveform | 63:216 | bars = 4, 8, 28 x tone = light, ink, brand | Part 2 |
| ChatListItem | 67:1234 | state = active, default | Part 5 |
| ThreadHeader | 67:1260 | layout = desktop, mobile | Part 5 |
| CastCard | 67:1303 | character = Nova, Iris | Part 5 |
| MadeItem | 67:1342 | type = audio, image, video | Part 5 |
| SystemLine | 67:1343 | single | Part 4 |
| DayDivider | 67:1348 | single | Part 4 |
| Button | 62:129 | variant = primary, secondary, tertiary, ai, link x size = sm, md | Part 1 |
| IconButton | 62:193 | variant = plain, outline, secondary, primary, dark x size = sm, md, lg | Part 1 |
| Avatar | 62:25 | character = Nova, Iris x size = xs, sm, md, lg | Part 1 |
| CharacterTag | 62:33 | character = Nova, Iris | Part 1 |
| AddresseeChip | 62:45 | character = Nova, Iris | Part 1 |

**Tokens** (Design System page): Color Tokens 79:3380, Typography Tokens 47:1149, Utility Tokens 79:3381 (includes the Character card). Variable collections: Colors & Utilities, Typography / Foundational, Typography / Semantic (modes Large, Medium, Small Screen; Mobile 390 uses Small Screen), Character (modes Nova, Iris). The Lucide icon set is node 24:535; use `lucide-react` in code instead.

States that exist only in this brief (not drawn in Figma): MediaAudio and MediaVideo `editing` and `trimmed`, EditCard `applied` and the image EditCard, the TypingIndicator, Toasts, drawers, the cast sheet and the demo card. Build them from the same parts and tokens.

## Product context

The prototype proves one idea: a person can direct two AI characters in one chat and always know who is talking, who answers next, and what they can change. It accompanies Felix Oginni's Creative Fabrica Product Designer (Studio) take-home, presented as a product of Rekka, a design system he built.

**The brief.** Design the main web chat for one user talking to two AI character bots. Characters reply with text, images, video, music and voice, and the user edits that media inline (edit image, trim audio, modify prompt). Required: a multimodal message component with Bot A and Bot B identity, a 1440 desktop screen, a 390 mobile screen, and design tokens.

**The person: Ada.** 24, makes music and short videos in the evenings, on a laptop at home and her phone on the train. Job to be done: turn a rough idea into a shareable teaser (hook, cover art, short loop) without opening four tools. She wants characters that feel like collaborators with opinions, not a settings panel.

**The cast.**

| Character | Bot | Role | Makes | Voice | Identity colour |
| --- | --- | --- | --- | --- | --- |
| Nova | Bot A | Producer | Music hooks, voice previews | Warm, quick, a bit cheeky | Oceanic blue ring and tag |
| Iris | Bot B | Visual director | Cover art, images, short video loops | Calm, precise, asks one sharp question | Gold ring and tag |

**Design principles the prototype must express**

1. **Identity never relies on colour alone.** Every character group starts with avatar, name and role tag. The character hue appears only on the avatar ring, the role tag and the @mention underline. Bubbles keep Rekka's meaning: white is a character, peach is you.
2. **Purple means a character acted.** Dreams purple marks anything a character does on its own: AgentSteps progress, the EditCard border, the ai button (Make changes, Apply edits). Purple is never a character's identity.
3. **Orange is time and voice.** Rekka orange marks the playhead, waveform selection and trim handles.
4. **Who answers next is always visible.** Addressee chips above the composer show who will reply. They default to the character who spoke last; @mention adds or switches; @all asks both.
5. **Edits are visible and undoable.** Trims apply in place, then appear as one ChangeList line. Generative edits go through the EditCard: working, then ready with Before and After, Apply edits and Refine. Nothing replaces the original until you apply.
6. **The thread is the work.** On narrower screens the cast panel collapses first, then the layout switches to the mobile shell with a chats drawer and a cast sheet.

**Goals for the prototype**

- Pixel match of the Figma screens at 1440, 744 and 390 wide.
- Every component state from the Figma Design System page is reachable by interacting, not only by reading.
- A reviewer can complete the demo path in under two minutes: mention Iris, trim the hook, edit the cover, apply the edit, play the loop, mute a character.

**Non-goals**

- Real AI, real audio or video files, uploads, accounts, persistence across reloads (a Reset demo button replaces it), dark mode, other chats beyond a placeholder.

## Tech stack, structure and global rules

One page, one route, client-only React with all styling driven by CSS custom properties.

**Stack**

- Node 20 or later. React 18, Vite 5, TypeScript (strict).
- Styling: CSS Modules (one `.module.css` per component) on top of the global `tokens.css` and `typography.css`. No Tailwind, no CSS-in-JS: every value in a module is a `var(--token)`, which keeps the token audit trivial.
- `lucide-react` (0.400 or later, so `WandSparkles`, `ScrollText`, `Repeat2`, `LoaderCircle` and `Droplets` exist). Icons render at `strokeWidth={1.75}` and `currentColor`.
- `@radix-ui/react-dialog` (unstyled) for the focus trap in the chats drawer, cast drawer and cast sheet. No other UI kit, no animation library.
- Dev only: `@playwright/test`, `pixelmatch` and `pngjs` (visual diff), `@axe-core/playwright` (accessibility), ESLint with `typescript-eslint`, Prettier.

**package.json scripts**

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview --port 4173",
  "lint": "eslint .",
  "check:tokens": "node scripts/check-tokens.mjs",
  "test:a11y": "playwright test tests/a11y.spec.ts",
  "test:visual": "playwright test tests/visual.spec.ts",
  "check": "npm run lint && npm run check:tokens && npm run build && npm run test:a11y && npm run test:visual"
}
```

**Fonts** (add to `index.html` head)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,500&family=Karla:wght@500;800&display=swap" rel="stylesheet">
```

**Folder structure**

```text
CLAUDE.md                    // project rules for Claude Code (last section of this brief)
docs/BRIEF.md                // this brief, exported as Markdown
docs/DECISIONS.md            // every place Figma and the brief disagreed, and what was chosen
docs/reference/              // optional fallback PNGs
src/
  styles/tokens.css          // every custom property in "Design tokens"
  styles/typography.css      // the type classes in "Typography"
  styles/global.css          // resets, html/body, focus ring, reduced motion; imports the two above
  lib/breakpoints.ts         // 577, 1024, 1280 and the layout hook
  components/rekka/<Name>/   // <Name>.tsx + <Name>.module.css, PascalCase names from this brief
  features/chat/types.ts     // types from "Interactions and state model"
  features/chat/script.ts    // the seed conversation and copy
  features/chat/store.tsx    // reducer, context, actions
  features/chat/simulate.ts  // timers for typing, generating, playback
  App.tsx                    // the one page: AppShell
public/assets/               // avatar-nova.svg, avatar-iris.svg, cover-late-trains.svg, poster-teaser-loop.svg
scripts/check-tokens.mjs     // fails on raw colours or px font sizes in src (see "Verification loop")
tests/visual.spec.ts         // Playwright screenshots vs Figma
tests/a11y.spec.ts           // axe scans and the keyboard demo path
tests/figma/                 // Figma reference PNGs saved from get_screenshot
vercel.json                  // build settings for Vercel
```

**Global rules**

- `html, body`: background `var(--backgroundElevation0)`, colour `var(--contentPrimary)`, font `var(--font-body)`, `-webkit-font-smoothing: antialiased`, `font-optical-sizing: auto`, margin 0.
- `*, *::before, *::after { box-sizing: border-box; }`.
- Focus: every interactive element shows `box-shadow: var(--focusRing)` on `:focus-visible` and no outline. Never remove focus without replacing it.
- Breakpoints: 577 (tiny type), 1024 (web shell starts), 1280 (cast panel visible). Below 1024 the app uses the mobile shell; the Tablet 744 screen is the mobile shell at 744 wide. The layout is chosen in JS by a `useLayout()` hook (so the phone preview in "Demo affordances" can force it); CSS media queries are used only for the tiny type rule.
- Respect `prefers-reduced-motion: reduce` by removing all transitions and looping animations.
- Images use `object-fit: cover` and carry real alt text from the seed content.

## Design tokens

Copy this file verbatim to `src/styles/tokens.css`; it is the only place a raw colour, size or shadow may appear. Names follow Rekka's tokens.json and match the WEB code syntax on the Figma variables (for example `var(--rk_spacing_4x)`, `var(--character-ring)`).

```css
:root {
  /* Fonts */
  --font-heading: "Karla", system-ui, sans-serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --font-quote: "Caveat", cursive;

  /* Primitives: black ramp (warm browns) */
  --pureBlack: #0d0500;
  --pureWhite: #ffffff;
  --black-80: #1c0e07;
  --black-70: #381e10;
  --black-60: #613e29;
  --black-40: #915f3d;
  --black-35: #b5815f;
  --black-30: #ebb491;
  --black-20: #ffd3ba;
  --black-10: #fff1eb;
  --black-5: #fffaf7;

  /* Primitives: hues */
  --sunsetDark: #8a4700;   --sunsetMain: #ab5800;   --sunsetLight: #f49644;   --sunsetLightest: #fffaf5;
  --earthyDark: #2a7340;   --earthyMain: #3e9c5d;   --earthyLight: #86ebba;   --earthyLightest: #f5fffb;
  --mariamDark: #780e43;   --mariamMain: #b5246a;   --mariamLight: #f2509c;   --mariamLightest: #fff5fa;
  --dreamsDark: #432961;   --dreamsMain: #794ea3;   --dreamsLight: #ce91eb;   --dreamsLightest: #fff7ff;
  --turquoiseDark: #276e8a; --turquoiseMain: #4296b8; --turquoiseLight: #92e6f0; --turquoiseLightest: #f5feff;
  --oceanicDark: #27418a;  --oceanicMain: #4261b8;  --oceanicLightest: #f5f9ff;
  --goldDark: #6e5200;     --goldMain: #c4930f;     --goldLight: #f0d58c;     --goldLightest: #fff9e6; /* new for Iris */

  /* Semantic: background */
  --backgroundElevation0: var(--black-5);        /* the cream ground */
  --backgroundElevation1: var(--pureWhite);      /* character bubbles, cards */
  --backgroundElevation2: var(--black-5);        /* inputs */
  --backgroundElevation_Alt: var(--black-10);
  --backgroundElevation_Alt200: var(--black-20); /* peach: you, selected */
  --backgroundElevation_Alt300: var(--black-30);
  --backgroundBlur: #fffaf7eb;
  --backgroundBlur200: #fffaf7e0;
  --backgroundOverlay: #0d050066;
  --backgroundDark: var(--black-80);             /* video stage, toasts */
  --backgroundBrand: var(--sunsetLight);         /* Rekka orange */
  --backgroundAction_Default: var(--dreamsMain); /* purple: a character acts */
  --backgroundAction_Light: var(--dreamsLight);
  --backgroundAction_onBrand: var(--turquoiseMain);
  --backgroundAction_onBrand_dark: var(--turquoiseDark); /* primary buttons, send */
  --backgroundAction_onBrand_Lightest: var(--turquoiseLightest);
  --backgroundConstructive: var(--earthyLightest);
  --backgroundWarning: var(--mariamLightest);
  --backgroundCallout: var(--sunsetLightest);

  /* Semantic: content */
  --contentPrimary: var(--black-70);
  --contentSecondary: var(--black-60);
  --contentTetiary: var(--black-40);            /* Rekka's spelling, keep it */
  --contentPrimary_onColor: var(--black-10);
  --contentSecondary_onColor: var(--black-20);
  --contentTetiary_onColor: var(--black-30);
  --content_Disabled: var(--black-30);
  --content_Disabled_onColor: var(--black-40);
  --contentWarning: var(--mariamDark);
  --contentAction_Default: var(--dreamsMain);
  --contentAction_onBrand: var(--turquoiseDark); /* link buttons */
  --contentConstructive: var(--earthyDark);
  --contentCallout: var(--sunsetDark);

  /* Semantic: border */
  --border_Functional: var(--black-35);
  --border_Decorative: var(--black-20);
  --border_Focus: var(--black-40);
  --border_Disabled: var(--black-20);
  --borderAction_Default: var(--dreamsLight);
  --borderAction_Focus: var(--dreamsDark);
  --borderActionOnBrand_Default: var(--turquoiseLight);
  --borderActionOnBrand_Focus: var(--turquoiseDark);
  --borderWarning_Default: var(--mariamLight);
  --borderWarning_Focus: var(--mariamMain);
  --borderConstructive_Default: var(--earthyLight);
  --borderCallout_Default: var(--sunsetLight);

  /* Space (4px base), size, radius, border width */
  --rk_spacing_half: 2px;  --rk_spacing_1x: 4px;   --rk_spacing_2x: 8px;   --rk_spacing_3x: 12px;
  --rk_spacing_4x: 16px;   --rk_spacing_6x: 24px;  --rk_spacing_8x: 32px;  --rk_spacing_12x: 48px;
  --rk_spacing_16x: 64px;  --rk_spacing_20x: 80px;
  --rk_size_1x: 10px; --rk_size_2x: 12px; --rk_size_3x: 14px; --rk_size_4x: 16px; --rk_size_5x: 20px;
  --rk_size_6x: 24px; --rk_size_7x: 32px; --rk_size_8x: 48px; --rk_size_9x: 64px; --rk_size_10x: 80px;
  --radius-none: 0px; --radius-50: 2px; --radius-100: 4px; --radius-200: 8px; --radius-300: 12px; --radius-full: 9999px;
  --borderWidth-M: 1px; --borderWidth-L: 2px;

  /* Elevation, focus, blur */
  --elevation_0: 0 0 0 0 #00000040;
  --elevation_half: 1px 1px 4px 0 #00000014;
  --elevation_1: 2px 2px 8px 0 #00000029;
  --elevation_2: 2px 4px 16px 0 #0000003d;
  --elevation_3: 2px 4px 32px 0 #00000047;
  --elevation_4: 4px 8px 64px 0 #00000052;
  --elevation_focus: 0 0 0 4px #ffd3baa3;          /* focused inputs */
  --focusRing: 0 0 0 2px #fffaf7, 0 0 0 4px #915f3d; /* keyboard focus */
  --rk_bg_blur_default: 8px;

  /* Layout constants for this prototype (from the Figma screens) */
  --layout-sidebar: 280px;
  --layout-cast: 320px;
  --layout-thread-column: 760px;
  --layout-bubble-max: 560px;
  --layout-bubble-text-max: 528px;
  --layout-media-max: 480px;
  --layout-image-max: 400px;
  --layout-avatar-column: 36px;
  --layout-touch: 44px;
}

/* Character identity: set data-character on any element; everything inside follows. */
[data-character="bot-a"] { --character-ring: var(--oceanicMain); --character-tag-bg: var(--oceanicLightest); --character-tag-ink: var(--oceanicDark); }
[data-character="bot-b"] { --character-ring: var(--goldMain);    --character-tag-bg: var(--goldLightest);    --character-tag-ink: var(--goldDark); }
[data-character="user"]  { --character-ring: var(--border_Decorative); --character-tag-bg: var(--backgroundElevation_Alt); --character-tag-ink: var(--contentSecondary); }
```

**Character data lives beside the tokens.** In Figma the Character collection has two modes (Nova, Iris) holding these values; in code they are one constant:

```ts
export const CAST = {
  nova: { id: 'nova', bot: 'bot-a', name: 'Nova', role: 'Producer', specialty: 'Music hooks, voice previews',
          bio: 'Writes music hooks and voice previews. Warm and quick.', avatar: '/assets/avatar-nova.svg' },
  iris: { id: 'iris', bot: 'bot-b', name: 'Iris', role: 'Visual director', specialty: 'Cover art, images, video loops',
          bio: 'Makes cover art, images and short video loops. Calm and precise.', avatar: '/assets/avatar-iris.svg' },
} as const;
```

**Using tokens in CSS Modules.** Every declaration in a component module reads a variable; the only literal numbers allowed are layout geometry from this brief (for example a 36px avatar column, a 236px video stage) and those should prefer the `--layout-*` constants.

```css
/* src/components/rekka/Button/Button.module.css (excerpt) */
.root { display: inline-flex; align-items: center; justify-content: center; gap: var(--rk_spacing_1x);
  height: var(--rk_size_7x); padding: 0 var(--rk_spacing_3x); border: var(--borderWidth-M) solid transparent;
  border-radius: var(--radius-200); white-space: nowrap; cursor: pointer;
  transition: background-color .15s, box-shadow .15s, border-color .15s; }
.primary { background: var(--backgroundAction_onBrand_dark); color: var(--contentPrimary_onColor); box-shadow: var(--elevation_half); }
.primary:hover { box-shadow: var(--elevation_1); }
.root:focus-visible { outline: none; box-shadow: var(--focusRing); }
```

## Typography

Three families, one scale: Karla for headings, DM Sans for everything people read in the chat, Caveat only for handwritten notes. Every text element in the prototype uses exactly one of these classes; never set font size, weight or line height inline.

```css
/* src/styles/typography.css */
.display_1 { font: 800 96px/112px var(--font-heading); letter-spacing: -5.76px; }
.display_2 { font: 800 64px/80px var(--font-heading); letter-spacing: -5.76px; }
.display_3 { font: 800 48px/64px var(--font-heading); letter-spacing: -3.6px; }
.headline_1 { font: 800 32px/48px var(--font-heading); letter-spacing: -0.05em; }
.headline_2 { font: 800 24px/32px var(--font-heading); letter-spacing: -0.05em; }
.headline_3 { font: 800 20px/24px var(--font-heading); letter-spacing: -0.05em; }
.headline_4 { font: 800 16px/24px var(--font-heading); letter-spacing: -0.05em; }
.subtitle_display { font: 500 32px/40px var(--font-heading); letter-spacing: -1.28px; }
.subtitle_headline { font: 500 16px/24px var(--font-heading); letter-spacing: -0.04em; }
.subtitle_headline_4 { font: 500 14px/20px var(--font-heading); letter-spacing: -0.04em; }
.body { font: 400 16px/24px var(--font-body); }
.body_em { font: italic 500 16px/24px var(--font-body); }
.body_bold { font: 700 16px/24px var(--font-body); }
.body_small { font: 400 14px/20px var(--font-body); }
.body_small_em { font: italic 500 14px/20px var(--font-body); }
.body_small_bold { font: 700 14px/20px var(--font-body); }
.body_tiny { font: 500 12px/16px var(--font-body); }
.quote_heading_1 { font: 700 32px/48px var(--font-quote); }
.quote_heading_2 { font: 700 24px/32px var(--font-quote); }
.quote_body { font: 400 16px/24px var(--font-quote); }
.quote_body_bold { font: 700 20px/24px var(--font-quote); }
.quote_body_large { font: 400 20px/24px var(--font-quote); }
@media (max-width: 576px) { .body_tiny { font-size: 10px; line-height: 12px; } }
```

| Figma text style | Class | Size / line height | Where it is used in the prototype |
| --- | --- | --- | --- |
| Headline/3 | `headline_3` | 20/24, Karla 800 | "Chats", desktop thread title, "In this chat" |
| Body/Bold | `body_bold` | 16/24, DM Sans 700 | Mobile thread title, cast card name, md button labels |
| Body/Default | `body` | 16/24, DM Sans 400 | Message bubbles, composer draft, Describe the change field |
| Small/Bold | `body_small_bold` | 14/20, DM Sans 700 | Names in message headers, media titles, sm button labels, chat titles, field labels, chip names, Made in this chat titles, ChangeItem titles |
| Small/Default | `body_small` | 14/20, DM Sans 400 | Menu items, prompt text, cast bio, AgentStep labels |
| Tiny/Default | `body_tiny` | 12/16 (10/12 under 577px), DM Sans 500 | Times, role tags, media specs, chat previews, "Replying to", day divider, system lines, step details, progress labels, trim times |
| Display/2, Quote/Heading/2 | `display_2`, `quote_heading_2` | 64/80, 24/32 | Only the optional intro card in "Demo affordances" |

Notes: Rekka's headline tracking is -0.05em and subtitle tracking -0.04em (the Figma file was corrected to these values). Body copy never uses Karla. Numbers in timers use `font-variant-numeric: tabular-nums` so they do not jitter.

## Icons and image assets

All icons are Lucide at `strokeWidth={1.75}`, coloured with `currentColor` so they inherit the text token of their container. All imagery is four original SVGs: save each block below as a file in `public/assets/` exactly as written.

| Use | lucide-react icon | Size |
| --- | --- | --- |
| New chat, Add a character | `Plus` | 16 (button), 20 (icon button) |
| Open chats (mobile) | `Menu` | 20 |
| Audio card meta | `Music` | 16 |
| Image card meta, image skeleton | `Image` | 16, 24 |
| Video card meta | `Film` | 16 |
| Trim, Save trim, trimmed ChangeItem | `Scissors` | 16 |
| Edit (image), EditCard header, Refine | `WandSparkles` | 16 |
| Edit prompt, prompt reference, menu | `ScrollText` | 16 |
| Regenerate | `RotateCcw` | 16 |
| Download, Download all | `Download` | 16 |
| More actions (compact toolbar) | `Ellipsis` | 16 |
| Copy prompt | `Copy` | 16 |
| Make changes, Editing badge, warmer-grade ChangeItem | `Sparkles` | 16, 12 in badge |
| Apply edits, Ready badge | `Check` | 16, 12 in badge |
| AgentStep done / active / pending | `CircleCheck` / `LoaderCircle` (spins) / `Circle` | 16 |
| Play, pause | `Play`, `Pause` | 16 (controls), 24 (big play), 12 (thumbnail badge) |
| Volume, mute character | `Volume2`, `VolumeX` | 16 |
| Mention, @all | `AtSign` | 16 (button), 20 (mobile icon button) |
| Attach, voice, send | `Paperclip`, `Mic`, `Send` | 20 |
| Undo a change | `Undo2` | 16 |
| Seamless loop ChangeItem | `Repeat2` | 16 |
| Made in this chat row | `ChevronRight` | 16 |
| System line (joined, muted) | `User`, `VolumeX` | 12 |
| Close drawer or sheet | `X` | 20 |

**public/assets/avatar-nova.svg** (Nova: blue blob with headphones, shown in a circle). Source saved verbatim in `public/assets/avatar-nova.svg`.

**public/assets/avatar-iris.svg** (Iris: gold blob with a beret, eyes closed in calm arcs). Source saved verbatim in `public/assets/avatar-iris.svg`.

**public/assets/cover-late-trains.svg** (1:1 cover art: rainy night-train window, bokeh city lights). Source saved verbatim in `public/assets/cover-late-trains.svg`.

**public/assets/poster-teaser-loop.svg** (16:9 video poster: light streaks past the train window). Source saved verbatim in `public/assets/poster-teaser-loop.svg`.

The hex values inside these four files are illustration, not UI, and are the only allowed exception to the no-raw-hex rule. The "v2" image after Apply edits reuses `cover-late-trains.svg` with `filter: saturate(1.15) sepia(0.18) hue-rotate(-8deg) brightness(1.04)` to read as warmer; the trimmed video loop reuses the poster.

## Layout and responsive shell

Three layouts from one component tree: the full web shell at 1280 and up, the web shell without the cast panel from 1024 to 1279, and the mobile shell below 1024. The Figma screens are full-length captures; the prototype is a real app: the viewport is fixed at `100dvh`, the message list scrolls, the composer stays docked, and the list opens scrolled to the newest message.

| Width | Shell | Columns | Cast | Chats |
| --- | --- | --- | --- | --- |
| 1280 and up (reference 1440) | Web | Sidebar 280, thread fluid, cast panel 320 | Panel always visible | Sidebar always visible |
| 1024 to 1279 | Web | Sidebar 280, thread fluid | Avatar stack opens the cast panel as a right drawer, 320 wide | Sidebar always visible |
| Below 1024 (references 744 and 390) | Mobile | One column | Avatar stack opens the cast bottom sheet | Menu button opens the chats drawer from the left |

**Web shell (AppShell, `lg` and up)**

- Root: `display:flex; height:100dvh; background: var(--backgroundElevation0)`.
- **Sidebar** (`<nav aria-label="Chats">`): width `var(--layout-sidebar)`, flex none, padding 24 16, column gap 16, `border-right: 1px solid var(--border_Decorative)`, `overflow-y:auto`.
  - Header row: padding 0 8, space-between, centred: "Chats" (`headline_3`) and IconButton secondary sm `Plus` labelled "Start a new chat".
  - Chat list: column gap 4 with three ChatListItem rows (seed content).
- **Thread** (`<main>`): flex 1, min-width 0, column.
  - ThreadHeader desktop, flex none.
  - Message list: flex 1, `overflow-y:auto`, padding 24, `display:flex; justify-content:center`. Inner column: `width:100%; max-width: var(--layout-thread-column)`, column gap 16, `align-items:center` (so DayDivider and SystemLine centre while messages stretch to full width).
  - Composer dock: flex none, padding 0 24 24, centred column with `max-width: var(--layout-thread-column)`.
- **Cast panel** (`<aside aria-label="Cast">`), `xl` and up only: width `var(--layout-cast)`, flex none, padding 24, column gap 16, `border-left: 1px solid var(--border_Decorative)`, `overflow-y:auto`, full height (the border must run the full height of the viewport).
  - "In this chat" (`headline_3`), CastCard Nova, CastCard Iris, the Made in this chat block, then a Button secondary md `Plus` "Add a character" (hugs its content, left aligned).
  - Made in this chat block: column gap 12. Header row space-between with "Made in this chat" (`body_small_bold`) and "3 items" (`body_tiny`, `--contentTetiary`); the list card: white `--backgroundElevation1`, radius 12, `--elevation_half`, overflow hidden, rows separated by a 1px `--border_Decorative` top border on every row after the first; under it a Button link sm `Download` "Download all".
- **1024 to 1279:** the cast panel is not rendered in the flex row. The header avatar stack becomes a button ("Open cast: Nova and Iris") that opens the same panel content in a right drawer: 320 wide, full height, `--backgroundElevation0`, `box-shadow: var(--elevation_3)`, scrim `--backgroundOverlay`, slides in over 200ms.

**Mobile shell (below `lg`)**

- Root: column, `height:100dvh`, `--backgroundElevation0`. Tiny text drops to 10/12 by the media query in "Typography", not by a class.
- ThreadHeader mobile (flex none, sticky): padding 8 12, gap 8, bottom border 1px `--border_Decorative`, background `--backgroundBlur` with `backdrop-filter: blur(var(--rk_bg_blur_default))`.
- Message list: flex 1, `overflow-y:auto`, padding 16, column gap 12, `justify-content:flex-end` when content is shorter than the viewport, items centred like desktop.
- Composer dock: flex none, padding 8 16 16, top border 1px `--border_Decorative`, background `--backgroundBlur` with the same blur. Holds Composer `layout="mobile"`.
- Chats drawer: from the left, width `min(320px, 85vw)`, full height, `--backgroundElevation0`, `--elevation_3`, scrim `--backgroundOverlay`. Content = the Sidebar plus an IconButton plain lg `X` "Close chats" in the header row. Closes on scrim click, Esc, X, or choosing a chat.
- Cast sheet: bottom sheet, full width up to 480 (centred above 480), max height 92dvh, `--backgroundElevation1`, top corners radius 12, `--elevation_3`, scrim `--backgroundOverlay`. Handle 32x4 radius 2 `--border_Functional`, 12 from the top. Head: "In this chat" `headline_3`, centred, padding 16 24 8. Body: padding 8 24 24, column gap 16, scrolls: CastCard Nova, CastCard Iris, Made in this chat block, Add a character. Closes on scrim, Esc, swipe down 80px or more on the handle.

**Stacking:** sticky headers z 10, drawers and sheets z 50, mention picker z 40 (inside the composer, opens upward), toasts z 60.

**Pixel targets at 1440 x 900** (measure in the browser): sidebar right edge at x 280; thread header bottom border at y 75 (16 + 42 + 16 + 1); mobile header 61 tall (8 + 44 + 8 + 1); message column 760 wide centred between x 280 and x 1120, so its left edge is at x 320; cast panel left edge at x 1120; composer tray left edge at x 320.

## Component specs, part 1: primitives

Each spec lists props, anatomy with exact values, and states. Measurements are in CSS pixels; every colour, radius and shadow is the named token. "Character scope" means the element carries `data-character="bot-a"` (Nova) or `"bot-b"` (Iris) so `--character-*` resolves.

### Avatar

- Props: `character: 'nova' | 'iris'`, `size: 'xs' | 'sm' | 'md' | 'lg'`, `ring?: boolean` (default true for md and lg, false for xs and sm).
- Image sizes: xs 16, sm 20, md 28, lg 40. `<img>` with `border-radius: var(--radius-full)`, `object-fit: cover`, alt = the character's name.
- Ring (md, lg): wrapper `<span>` in character scope, `display:inline-flex; padding: var(--rk_spacing_half); border-radius: var(--radius-full); background: var(--backgroundElevation0); box-shadow: 0 0 0 2px var(--character-ring)`. The ring sits outside the layout box: md takes 32x32 in layout and reads 36 wide; lg takes 44 and reads 48.
- AvatarStack (thread header): two md ringed avatars, Nova then Iris, Iris overlapping by 6px on desktop (`margin-left:-6px`) and 8px on mobile. Iris sits on top.

### CharacterTag

- Props: `character`. Renders the role ("Producer" or "Visual director").
- `<span>` in character scope: `display:inline-flex; align-items:center; padding: 2px 8px; border-radius: var(--radius-100); border: 1px solid var(--character-ring); background: var(--character-tag-bg); color: var(--character-tag-ink)`, class `body_tiny`. Height 22 (20 at 10px type on small screens).

### AddresseeChip

- Props: `character`, `onRemove()`. A `<button>` in character scope, aria-label "Stop replying to Nova".
- `display:inline-flex; align-items:center; gap: var(--rk_spacing_1x); padding: 2px 8px 2px 2px; border-radius: var(--radius-full); border: 1px solid var(--character-ring); background: var(--character-tag-bg); color: var(--character-tag-ink)`, class `body_small_bold`. Contents: Avatar sm (20, no ring) then the name. Height 26.
- Hover: `box-shadow: 0 0 0 1px var(--character-ring)` (reads as a 2px border). Focus: `--focusRing`. Pressed: removes the chip with a 120ms fade and width collapse.

### Button

- Props: `variant: 'primary' | 'secondary' | 'tertiary' | 'ai' | 'link'`, `size: 'sm' | 'md'`, `icon?: LucideIcon`, `children` (label), `disabled?`.
- Base: `display:inline-flex; align-items:center; justify-content:center; white-space:nowrap; border: 1px solid transparent; border-radius: var(--radius-200); cursor:pointer; transition: background-color .15s, box-shadow .15s, border-color .15s`.
- Sizes: sm height 32 (`--rk_size_7x`), padding 0 12, gap 4, label `body_small_bold`, icon 16. md height 40, padding 0 16, gap 8, label `body_bold`, icon 16.

| Variant | Background | Text and icon | Border | Shadow | Hover |
| --- | --- | --- | --- | --- | --- |
| primary | `--backgroundAction_onBrand_dark` | `--contentPrimary_onColor` | none | `--elevation_half` | shadow `--elevation_1`; active: no shadow |
| secondary | `--backgroundElevation_Alt200` | `--contentPrimary` | none | none | background `--backgroundElevation_Alt300` |
| tertiary | `--backgroundElevation0` | `--contentPrimary` | `--border_Decorative` | none | border `--border_Functional`, background `--backgroundElevation_Alt` |
| ai | `--backgroundAction_Default` | `--contentPrimary_onColor` | none | `--elevation_half` | background `--dreamsDark`; active: no shadow |
| link | none | `--contentAction_onBrand` | none | none | underline; padding 0 4, height auto, min-height 24 |

- Disabled (all): background `--backgroundElevation_Alt`, border `--border_Disabled`, text `--content_Disabled`, no shadow, `cursor:not-allowed` (link keeps no background).
- Use rule: ai only when a character does the work (Make changes, Apply edits). Primary is the person's own action (Send).

### IconButton

- Props: `variant: 'plain' | 'outline' | 'secondary' | 'primary' | 'dark'`, `size: 'sm' | 'md' | 'lg'`, `icon`, `label` (required: aria-label and `title`).
- Square, `display:inline-grid; place-items:center; border: 1px solid transparent; border-radius: var(--radius-200)`. Sizes: sm 32 (icon 16), md 40 (icon 20), lg 44 (icon 20, the mobile touch size).

| Variant | Background | Icon | Border | Hover |
| --- | --- | --- | --- | --- |
| plain | none | `--contentPrimary` | none | background `--backgroundElevation_Alt` |
| outline | `--backgroundElevation0` | `--contentPrimary` | `--border_Decorative` | border `--border_Functional` |
| secondary | `--backgroundElevation_Alt200` | `--contentPrimary` | none | background `--backgroundElevation_Alt300` |
| primary | `--backgroundAction_onBrand_dark` | `--contentPrimary_onColor` | none | shadow `--elevation_1` |
| dark (video stage) | `--black-70` | `--contentPrimary_onColor` | none | background `--black-60` |

### StatusBadge

- Props: `icon`, `children`. Used in the EditCard header ("Editing", "Ready to review").
- `display:inline-flex; align-items:center; gap: var(--rk_spacing_1x); padding: 2px 8px; border-radius: var(--radius-100); background: var(--dreamsLightest); border: 1px solid var(--borderAction_Default); color: var(--contentAction_Default)`, class `body_tiny`, icon 12.

### TypingIndicator

- Props: `character`. Renders as a bot ChatMessage (avatar, header with name and role tag, no time) whose bubble holds three dots instead of text.
- Dots: `display:inline-flex; gap: var(--rk_spacing_2x); padding: 8px 0`; each dot 8x8, `border-radius: var(--radius-full); background: var(--border_Functional)`, animation `rk-typing 1.2s infinite`, delays 0, 0.2s, 0.4s.
- Keyframes: `0%, 60%, 100% { background: var(--border_Functional); transform: none } 30% { background: var(--contentTetiary); transform: translateY(-2px) }`.
- Visually hidden text for screen readers: "Iris is typing". Static dots under reduced motion.

### Toast

- Props: `message`, `action?: { label, onClick }`. One at a time; a new toast replaces the old.
- Fixed, centred horizontally, bottom 24 (mobile: 16 above the composer dock). `background: var(--backgroundDark); color: var(--contentPrimary_onColor)`, class `body_small`, padding 12 16, `border-radius: var(--radius-300)`, `box-shadow: var(--elevation_2)`, max-width 360, gap 12 between message and action. Action is a text button in `--contentSecondary_onColor`, underlined.
- `role="status"`, `aria-live="polite"`. Enters with opacity 0 to 1 and translateY 8px to 0 over 160ms; auto-dismiss after 3000ms; hover pauses the timer.

## Component specs, part 2: media building blocks

These are the parts the media cards are made of. Audio and video playback is simulated with timers; no media files exist.

### Waveform

- Props: `bars: number[]` (heights in px), `tone: 'light' | 'ink' | 'brand'`. Stretches to its container: `display:flex; align-items:center; justify-content:space-between; gap: var(--rk_spacing_1x); width:100%`.
- Each bar: width 6, `border-radius: var(--radius-full)`, its height from the array. Tones: light `--backgroundElevation_Alt200` (on orange), ink `--contentPrimary` (cut regions), brand `--backgroundBrand` (on light surfaces).
- Presets: `HOOK_28 = [10,18,26,14,22,30,16,24,12,28,20,32,14,26,18,30,12,22,28,16,24,10,20,26,14,18,22,12]`, `CUT_8 = [8,14,20,12,22,16,10,18]`, `CUT_4 = [12,24,18,28]`.

### VoicePlayer

- Props: `duration` (seconds), `current`, `playing`, `onToggle()`, `onSeek(sec)`.
- Column, gap 4.
- Controls row, gap 8, centred: IconButton plain sm with `Play` or `Pause` ("Play hook" / "Pause hook"), then the scrubber.
- Scrubber: flex 1, height 32 (`--rk_size_7x`), `border-radius: var(--radius-300)`, background `--backgroundElevation_Alt300`, `position:relative`, no overflow clipping. Played fill: `--backgroundBrand`, same radius, width = progress. Playhead: 24x40 pill, `border-radius: var(--radius-full)`, background `--sunsetDark`, vertically centred so it overhangs the track by 4 top and bottom, `left: calc(progress * (100% - 24px))`.
- Times row: `padding-left:40px`, space-between, `body_tiny`, `--contentPrimary`, tabular numbers, format `mm:ss` ("00:00", "00:20").
- Playhead is `role="slider"` with `aria-valuemin=0`, `aria-valuemax=duration`, `aria-valuenow`, `aria-valuetext="0:04 of 0:20"`; arrows move 1s, Home and End jump. Pointer down on the track seeks; drag scrubs.

### VideoPlayer

- Props: `poster`, `duration` (6), `current`, `playing`, `size: 'full' | 'compact'`, `caption?`, `muted`.
- Container: column, gap 12, padding 12, `border-radius: var(--radius-300)`, background `--backgroundDark`, colour `--contentPrimary_onColor`.
- Stage: width 100%, height 236 (full) or 160 (compact), `border-radius: var(--radius-200)`, overflow hidden, poster as a cover background image, content centred.
  - Paused: big play button 56x56, `border-radius: var(--radius-full)`, background `--backgroundBlur`, `Play` 24 in `--contentPrimary`, centred, label "Play teaser loop".
  - Playing: no big play. Caption chip centred 24 from the bottom: padding 2 8, `border-radius: var(--radius-100)`, background `--backgroundElevation_Alt200`, `body_small_bold`, `--contentPrimary`, text "Late trains, city lights". The poster slowly scales from 1 to 1.06 over the loop (linear, repeats) to suggest motion; static under reduced motion.
- Controls row: gap 12, centred: IconButton dark sm `Play`/`Pause`; time `body_tiny` in `--contentSecondary_onColor`, tabular, "00:00 / 00:06"; slim scrubber (flex 1, height 8, radius full, background `--backgroundElevation_Alt300`, played fill `--backgroundBrand`, playhead 16x20 pill in `--sunsetDark`, same slider semantics as VoicePlayer); IconButton dark sm `Volume2`/`VolumeX` ("Mute" / "Unmute", visual only).
- Playback loops: at the end it returns to 0 and keeps playing until paused.

### ProgressBar (ai)

- Props: `label`, `percent`.
- Column, gap 4. Label row space-between: label and "33%", both `body_tiny` in `--contentSecondary`.
- Track: height 4, `border-radius: var(--radius-50)`, background `--backgroundElevation_Alt200`, overflow hidden. Fill: background `--backgroundAction_Default`, same radius, width = percent, `transition: width .3s`.

### AgentStep and AgentSteps

- AgentStep props: `state: 'done' | 'active' | 'pending'`, `label`, `detail?`.
- Row, gap 8, `align-items:flex-start`. Icon 16 with `margin-top:2px`: done `CircleCheck` in `--contentConstructive`; active `LoaderCircle` in `--contentAction_Default`, spinning 0.9s linear; pending `Circle` in `--contentTetiary`.
- Body column: label `body_small` (active: `body_small_bold` in `--contentPrimary`; done and pending: `--contentSecondary`), then detail `body_tiny` in `--contentSecondary`. Text wraps; it never overflows the card.
- AgentSteps props: `title`, `percent`, `steps[]`. Column, gap 12: ProgressBar (label = title), then the step list, column gap 8. The list is a polite live region so each finished step is announced.

### Menu and MenuItem

- Menu: `role="menu"`, column, padding 4, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `box-shadow: var(--elevation_3)`, width 220. Anchored under its trigger, right edges aligned, 8 below; flips upward when there is no room.
- MenuItem: `role="menuitem"` button, height 44, padding 0 12, gap 8, `border-radius: var(--radius-200)`, `body_small`, `--contentPrimary`, icon 16. Hover and keyboard focus: background `--backgroundElevation_Alt`. The first item is focused on open.
- Keyboard: Up and Down move, Enter or Space activates, Esc closes and returns focus to the trigger, Tab closes. Click outside closes.

### MediaToolbar

- Props: `type: 'audio' | 'video' | 'image'`, `layout: 'full' | 'compact'`, `onPrimary`, `onEditPrompt`, `onRegenerate`, `onDownload`.
- Row, space-between, centred, gap 8, width 100%.
- Left: the one always-visible primary action, a Button tertiary sm: `Scissors` "Trim" for audio and video, `WandSparkles` "Edit" for images.
- Right group, gap 4. Full: Button link sm `ScrollText` "Edit prompt", IconButton plain sm `RotateCcw` "Regenerate", IconButton plain sm `Download` "Download". Compact: IconButton outline sm `Ellipsis` "More actions" (`aria-haspopup="menu"`, `aria-expanded`) opening a Menu with Edit prompt, Regenerate, Download, same icons.

  Layout choice: full everywhere the Figma screens show it (desktop, 744 and 390). Compact applies through a container query when the card is narrower than 300px, for audio, image and video alike.
- In a card the toolbar sits in a slot: padding-top 12, `border-top: 1px solid var(--border_Decorative)`.

### PromptReference

- Props: `prompt`, `versionLabel` ("Used for v1"), `onCopy()`.
- A read-only record, not an input: no border, no focus ring on the box, no caret, text is selectable.
- `<section aria-labelledby>`: column, gap 4, padding 8 8 12 12, `border-radius: var(--radius-300)`, background `--backgroundElevation_Alt`.
- Header row, gap 8, centred: `ScrollText` 16 in `--contentSecondary`; `<h4>` "Original prompt" (`body_small_bold`, flex 1); "Used for v1" (`body_tiny`, `--contentSecondary`); IconButton plain sm `Copy` "Copy prompt".
- Prompt text: `<p>` `body_small`, `--contentSecondary`, padding-right 8.
- Copy writes the prompt to the clipboard, swaps the icon to `Check` for 1500ms and shows the toast "Prompt copied".

## Component specs, part 3: media cards and EditCard

Every media reply is a card under the character's bubble. Each card owns its own state machine; the cards are what reviewers will click most, so every state below must be reachable.

### MediaCard (shared shell)

- `<article role="group" aria-label="Audio: Late trains hook">`: column, gap 12, padding 16, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `box-shadow: var(--elevation_half)`, width 100%, `max-width: var(--layout-media-max)` (480) for audio and video, `var(--layout-image-max)` (400) for images.
- Meta row, gap 8, centred: type icon 16 in `--contentPrimary` (`Music`, `Image`, `Film`); title `body_small_bold`, flex 1, one line with ellipsis; details `body_tiny` in `--contentTetiary` ("0:20 · 92 BPM · lo-fi").

### MediaAudio

| State | Body under the meta row |
| --- | --- |
| default | VoicePlayer (duration 20), then the toolbar slot with MediaToolbar `type="audio"` |
| trimming | Trim editor (below); no toolbar |
| generating | AgentSteps: title "Nova is making your hook", steps "Wrote a four-chord loop" (done), "Recording a voice preview" with detail "92 BPM, lo-fi" (active), "Mixing and levelling" (pending) |
| trimmed | default, with duration 14, details "0:14 · 92 BPM · lo-fi", and one ChangeItem (`tone="user"`, `Scissors`, "Trimmed to 0:04 to 0:18", detail "14s kept from the 20s hook") between the player and the toolbar slot |

Trim editor (column, gap 8):

- Track: row, height 48, `border-radius: var(--radius-200)`, overflow hidden, background `--backgroundElevation_Alt`. Three regions sized by the selection: cut-start (width = start / duration), selection (between handles), cut-end (the rest).
- Cut regions: padding 12 4, opacity 0.45, Waveform `tone="ink"` (CUT\_8 at the start, CUT\_4 at the end).
- Selection: padding 8, background `--backgroundBrand`, Waveform `tone="light"` HOOK\_28.
- Handles: 8 wide, full height, background `--backgroundDark`, a centred grip 2x16, `border-radius: var(--radius-50)`, `--backgroundBrand`. Each handle is `role="slider"` ("Trim start", "Trim end"), draggable with the pointer, arrows move 0.5s, minimum selection 2s. `cursor: ew-resize`.
- Times row, space-between, `body_tiny`: "Start" in `--contentSecondary` + "0:04" in `--contentPrimary`; "14s selected" in `--contentSecondary`; "End" + "0:18". Values update live while dragging.
- Actions row, end-aligned, gap 8: Button tertiary sm "Cancel" (no icon), Button secondary sm `Scissors` "Save trim".
- Initial selection: 4s to 18s of 20s, matching the Figma screen.

### MediaImage

| State | Body under the meta row |
| --- | --- |
| default | Image, then the toolbar slot with MediaToolbar `type="image"` |
| editing | Image, then the edit slot (below) |
| generating | Skeleton (1:1, `border-radius: var(--radius-200)`, background `--backgroundElevation_Alt`, `Image` 24 in `--contentTetiary` centred), then AgentSteps: "Iris is painting your cover", steps "Listened to Nova's hook" (done), "Painting the cover" with detail "1:1, night tones" (active), "Checking contrast for small screens" (pending) |

- Image: `<img src="/assets/cover-late-trains.svg">`, width 100%, `aspect-ratio: 1 / 1`, `object-fit: cover`, `border-radius: var(--radius-200)`, background `--backgroundDark`, alt "Cover art: a rainy night train window looking out on city lights in blue and amber". After an applied edit it carries the warm filter from "Icons and image assets" and the details read "1:1 · v2".
- Edit slot: column, gap 12, padding-top 12, `border-top: 1px solid var(--border_Decorative)`:
  1. PromptReference with the original prompt.
  2. Field: label "Describe the change" (`body_small_bold`, gap 4 above the input), then a textarea: padding 12 16, `border-radius: var(--radius-300)`, background `--backgroundElevation2`, `border: 1px solid var(--border_Functional)`; focused: border `--border_Focus` plus `box-shadow: var(--elevation_focus)`; class `body`, min-height 72, grows to 5 lines, `resize:none`. It is focused automatically when editing opens.
  3. Actions, end-aligned, gap 8: Button tertiary sm "Cancel", Button ai sm `Sparkles` "Make changes" (disabled while the field is empty). Ctrl or Cmd + Enter submits; Esc cancels.

### MediaVideo

| State | Body under the meta row |
| --- | --- |
| default | VideoPlayer paused, then the toolbar slot with MediaToolbar `type="video"` |
| playing | VideoPlayer playing (caption visible), toolbar slot |
| trimming | VideoPlayer paused at the trim start, then the frame-strip trim editor (below) |
| generating | AgentSteps: "Iris is making your loop", steps "Matched the cover palette" (done), "Animating the window lights" with detail "6 seconds, 16:9" (active), "Looping the last frame" (pending) |
| trimmed | default with duration 4.6, details "0:05 · 16:9", and a ChangeItem (`tone="user"`, `Scissors`, "Trimmed to 4.6s", detail "0:00.8 to 0:05.4") above the toolbar slot |

- The Figma tablet and mobile screens keep the full layout: full toolbar and the 236 stage, exactly as on desktop. Use `layout="compact"` (VideoPlayer `size="compact"`, the More menu) only when the card itself is narrower than 300px, with a container query on the card (for example a 320px phone).
- Frame-strip editor: row, height 40, padding 2, gap 2, `border-radius: var(--radius-200)`, background `--backgroundDark`. Six equal frame cells (`border-radius: var(--radius-50)`), fills alternating `--black-70` and `--black-60`; cells outside the selection at opacity 0.4. Handles: 6 wide, `--backgroundBrand`, `border-radius: var(--radius-50)`, sliders as in audio with 0.1s steps. The selection has a 2px `--backgroundBrand` border on top and bottom only.
- Times: "Start 0:00.8", "4.6s selected", "End 0:05.4"; actions as in audio. Initial selection 0.8s to 5.4s of 6s.

Edit prompt on the audio or video card opens state `editing` on that card: the same edit slot as MediaImage (PromptReference with that card's prompt, Describe the change, Cancel and Make changes), placed under the player.

### ChangeItem

- Props: `icon`, `title`, `detail`, `tone: 'ai' | 'user'`, `undone`, `onUndo()`.
- Row, gap 8, centred, padding 8 0. Rows after the first in a list: `border-top: 1px solid var(--border_Decorative)`.
- Icon tile 28x28, `border-radius: var(--radius-200)`, icon 16. `ai`: background `--dreamsLightest`, icon `--contentAction_Default` (a character made the change). `user`: background `--backgroundElevation_Alt`, icon `--contentPrimary` (Ada made it).
- Body column, flex 1: title `body_small_bold`, detail `body_tiny` in `--contentSecondary`.
- IconButton plain sm `Undo2` ("Undo: Trimmed to 4.6s"). Undone: title `--contentTetiary` with line-through, tile background `--backgroundElevation_Alt` with icon `--contentTetiary`, and the button becomes `RotateCcw` "Redo".

### EditCard

- Props: `status: 'working' | 'ready' | 'applied'`, `media: 'image' | 'video'`, `title`, `version`, `before`, `after`, `duration?`, `steps`, `changes`.
- Container: column, gap 12, padding 12, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `border: 1px solid var(--borderAction_Default)`; applied: border `--borderConstructive_Default`. Width 100%, max-width 480.
- Header row, gap 8, centred: `WandSparkles` 16 in `--contentAction_Default`; title `body_small_bold`, flex 1 ("Teaser loop", ready: "Teaser loop · v2"); StatusBadge: working `Sparkles` "Editing", ready `Check` "Ready to review". Applied uses a constructive badge: background `--backgroundConstructive`, border `--borderConstructive_Default`, text `--contentConstructive`, `CircleCheck` "Applied".
- Media row, gap 12, `align-items:flex-start`:
  - Thumbnail: 132 wide; 196 tall for video, 132 for images; `border-radius: var(--radius-200)`, overflow hidden, the art as a cover background. Video adds a duration badge 8 from the bottom-right corner (padding 2 4, `border-radius: var(--radius-100)`, `--backgroundOverlay`, `body_tiny` in `--contentPrimary_onColor`, "0:06" or "0:05"); ready adds a centred 36 circular `--backgroundBlur` play badge with `Play` 16.
  - Side column, gap 8, flex 1. Working: AgentSteps. Ready and applied: a Before / After segmented pair, then the ChangeList of ChangeItems (`tone="ai"`).
- Segmented pair: two buttons, gap 4, padding 4 12, `border-radius: var(--radius-200)`, `body_small_bold`. Selected: background `--backgroundElevation_Alt200`, no border. Unselected: background `--backgroundElevation1`, border 1px `--border_Decorative`. `role="radiogroup"`; selecting swaps the thumbnail between before and after. After is selected when ready.
- Actions (ready), wrapping row, gap 8, centred: Button ai sm `Check` "Apply edits", Button tertiary sm `WandSparkles` "Refine", Button link sm "Open in editor". Applied: a single Button link sm `Undo2` "Undo apply".
- Video changes (from Figma): `Sparkles` "Warmer grade" / "Matched to the cover"; `Scissors` "Trimmed to 4.6s" / "0:00.8 to 0:05.4"; `Repeat2` "Seamless loop" / "Last frame blends into the first". Image changes: `Sparkles` "Warmer lights" / "Lamps and windows shifted to amber"; `Droplets` "Rain on the window" / "Streaks added to the glass".

## Component specs, part 4: conversation

ChatMessage is the hero component: one component for all senders, with media swapped into a slot. The composer always shows who will answer next.

### ChatMessage

- Props: `sender: 'user' | 'nova' | 'iris'`, `showHeader`, `text` (may contain mentions), `time`, `media?: MediaRef`, `highlight?: boolean`.
- **User (Ada):** row, `justify-content:flex-end`, `padding-left: var(--rk_spacing_12x)` (48). Bubble `<p>`: padding 12 16, `border-radius: var(--radius-300)`, background `--backgroundElevation_Alt200`, colour `--contentPrimary`, class `body`, `max-width: var(--layout-bubble-max)` (560, so text wraps at 528). No shadow, no avatar, no name.
- **Mentions in text:** `@Iris` renders as `<span data-character="bot-b" class="body_bold">` with `text-decoration: underline; text-decoration-color: var(--character-ring); text-decoration-thickness: 2px; text-underline-offset: 3px`. Same for `@Nova` (bot-a). `@all` is bold with a `--border_Functional` underline.
- **Bot (Nova or Iris):** row in character scope, gap 12, `align-items:flex-start`.
  - Avatar column: width `var(--layout-avatar-column)` (36), flex none, avatar centred. Avatar md ringed when `showHeader`, otherwise an empty column so text stays aligned.
  - Body column: flex 1, `min-width:0`, gap 8, `align-items:flex-start`.
  - Header (when `showHeader`): row, gap 8, centred, wraps, min-height 24: name (`body_small_bold`), CharacterTag, time (`body_tiny`, `--contentTetiary`).
  - Bubble: `align-self:flex-start`, padding 12 16, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `box-shadow: var(--elevation_half)`, class `body`, max-width 560.
  - Media slot (optional): width 100%; the card limits itself to 480 or 400.
- **Grouping:** a bot message within 2 minutes of the same bot's previous message, with nothing between, hides its header and avatar.
- **Highlight** (jumping from Made in this chat): the media card gets `box-shadow: 0 0 0 2px var(--character-ring)`, fading out over 1200ms after scroll ends.
- Each message is an `<article>` with an accessible name such as "Iris, Visual director, 21:06".

### SystemLine and DayDivider

- SystemLine: `role="status"`, row, gap 4, centred, `body_tiny`, `--contentTetiary`, icon 12. Uses: `User` "Iris joined the chat"; `VolumeX` "Nova is muted and won't reply"; `Volume2` "Nova is back".
- DayDivider: pill, padding 2 12, `border-radius: var(--radius-full)`, background `--backgroundElevation_Alt`, `body_tiny`, `--contentSecondary`, text "Today".

### MentionPicker and MentionOption

- MentionPicker: `role="listbox"`, `aria-label="Mention a character"`, column, gap 2, padding 8, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `box-shadow: var(--elevation_3)`, full width of the composer column. First child: "Mention a character" (`body_tiny`, `--contentTetiary`, padding 4 8).
- MentionOption: `role="option"` with `aria-selected`; row, gap 12, centred, min-height 52, padding 8, `border-radius: var(--radius-200)`, `border: 1px solid transparent`. Selected: background `--backgroundElevation_Alt`, border `--border_Focus`.
  - Character option (character scope): Avatar md ringed; text column (flex 1): name `body_small_bold`, specialty `body_tiny` in `--contentSecondary` (wraps, never runs under the tag); CharacterTag on the right.
  - @all option: a 32 circle, background `--backgroundElevation_Alt200`, `AtSign` 16 centred; "@all" and "Both characters reply"; no tag.
  - Muted character: specialty replaced by "Muted" in `--contentTetiary`; choosing it unmutes and addresses them (toast "Nova unmuted").
- Order: the character who did not speak last comes first, then the other, then @all. With the seed, Nova spoke last, so Iris is first and selected, matching Figma.
- Filtering: the text typed after `@` filters by name prefix, case-insensitive ("i" keeps Iris, "a" keeps @all). No match shows one disabled row: "No character called ‘x’".
- Keyboard: Up and Down move the selection (wrapping), Enter or Tab inserts, Esc closes and keeps the text. Hover moves the selection.
- Inserting replaces `@query` with ` @Iris  ` (trailing space) and switches the addressee to Iris. `@all` sets both. Two names in one draft address both.

### Composer

- Props: `layout: 'desktop' | 'mobile'`. Draft, picker and addressees come from the store.
- Column, gap 8, width 100%. The picker renders in flow above the addressee row, so the composer grows upward and the message list shrinks (as in the Figma mentioning state).
- **Addressee row:** space-between, centred, gap 8, wraps.
  - Left group, gap 8, centred: "Replying to" (`body_tiny`, `--contentTetiary`), then one AddresseeChip per addressee, Nova before Iris.
  - Right: desktop Button tertiary md `AtSign` "Mention"; mobile IconButton outline lg `AtSign` "Mention a character". It inserts `@` at the caret, opens the picker and focuses the input.
  - The last chip cannot be removed: it does a 4px horizontal shake (none under reduced motion) and shows the toast "Pick at least one character to reply".
- **Tray:** column, gap 8, padding 8 16 16, background `--backgroundElevation0`, top corners `--radius-300`, bottom corners 0, `box-shadow: var(--elevation_half)`, children centred.
  - Handle: 32x4, `border-radius: var(--radius-50)`, `--border_Functional`.
  - Input row (full width): gap 8, `align-items:flex-end`.
    - IconButton outline md `Paperclip` "Attach a file" (toast "Attachments aren't part of this prototype").
    - Input box: flex 1, min-height 40, padding 0 12, `border-radius: var(--radius-200)`, background `--backgroundElevation1`, `border: 1px solid var(--border_Functional)`; `:focus-within` border `--border_Focus` plus `box-shadow: var(--elevation_focus)`. Inside: a transparent textarea, class `body` (16px on every screen, so iOS does not zoom), padding 8 0, placeholder "Type your request here" in `--contentTetiary`, grows to a max height of 168 then scrolls.
    - Trailing: draft empty: IconButton plain md `Mic` "Record a voice note" (toast "Voice notes aren't part of this prototype"). Draft not empty: IconButton primary md `Send` "Send".
- Keys: Enter sends, Shift + Enter adds a line, Enter picks an option while the picker is open. Sending clears the draft and keeps focus in the input.

## Component specs, part 5: shell

The shell frames the thread and gives way to it on smaller screens. CastPanelContent is written once and rendered in the aside, the 1024 drawer and the mobile sheet.

### ChatListItem

- Props: `title`, `time`, `preview`, `active`. A `<button>` (active one has `aria-current="page"`).
- Column, gap 2, padding 12, `border-radius: var(--radius-300)`, full width. Active: background `--backgroundElevation_Alt200`. Default: transparent; hover background `--backgroundElevation_Alt`.
- Title row, space-between, gap 8: title `body_small_bold`; time `body_tiny` (active `--contentSecondary`, default `--contentTetiary`).
- Preview: `body_tiny`, one line with ellipsis, active `--contentSecondary`, default `--contentTetiary`. The active preview updates to the latest message ("Nova: That palette fits the synth pad…").

### ThreadHeader

- Desktop: `<header>` row, gap 12, centred, padding 16 24, `border-bottom: 1px solid var(--border_Decorative)`. Title block, flex 1, column, gap 2: `<h1>` "Late trains teaser" (`headline_3`) and the subtitle "You, Nova and Iris" (`body_tiny`, `--contentTetiary`); when someone is muted the subtitle reads "You, Nova and Iris · Nova muted". Right: AvatarStack. From 1024 to 1279 the stack is a button "Open cast: Nova and Iris" (radius 8, hover background `--backgroundElevation_Alt`) that opens the cast drawer.
- Mobile: row, gap 8, centred, padding 8 12, bottom border, background `--backgroundBlur` with blur. IconButton plain lg `Menu` "Open chats"; title block (flex 1, `min-width:0`): `<h1>` `body_bold`, one line with ellipsis, and the subtitle; AvatarStack inside a button (min-height 44, padding 0 4, `border-radius: var(--radius-200)`, overlap 8) "Open cast: Nova and Iris".

### CastCard

- Props: `character`, `muted`, `onToggleMute()`. `<section aria-label="Nova">` in character scope.
- Column, gap 12, padding 16, `border-radius: var(--radius-300)`, background `--backgroundElevation1`, `box-shadow: var(--elevation_half)`.
- Header row, gap 12, centred: Avatar lg ringed; name block (column, gap 2, `align-items:flex-start`): name `body_bold`, CharacterTag.
- Bio: `body_small`, `--contentSecondary` ("Writes music hooks and voice previews. Warm and quick." / "Makes cover art, images and short video loops. Calm and precise.").
- Actions row: Button tertiary sm `VolumeX` "Mute Nova". Muted: label "Unmute Nova" with `Volume2`, the avatar shows `filter: grayscale(1); opacity: .6`, and a line "Won't reply until you unmute" (`body_tiny`, `--contentTetiary`) sits above the actions.

### MadeItem

- Props: `type: 'audio' | 'image' | 'video'`, `title`, `meta`, `character`, `messageId`. A `<button>` row, gap 12, centred, padding 12, hover background `--backgroundElevation_Alt`.
- Thumbnail 56x56, `border-radius: var(--radius-200)`, overflow hidden. Audio: background `--backgroundBrand`, padding 12, Waveform CUT\_4 `tone="light"`. Image: the cover art (with the warm filter once v2 is applied). Video: the poster, with a centred 24 circle in `--backgroundBlur` holding `Play` 12.
- Text column, flex 1, `min-width:0`, gap 4: title `body_small_bold`, one line with ellipsis; meta row (gap 4, centred, `body_tiny`, `--contentSecondary`): Avatar xs + "Nova · Audio · 0:20".
- `ChevronRight` 16 at the end.
- Click scrolls the thread to that message (smooth, centred) and highlights its card; on mobile it closes the sheet first.
- Seed rows: "Late trains hook" / "Nova · Audio · 0:20"; "Cover art, late trains" / "Iris · Image · v1"; "Teaser loop" / "Iris · Video · 0:06". Meta follows state ("0:14" after a trim, "v2" after an applied edit), and new media adds rows (the count updates: "4 items").

### CastPanelContent

- Column, gap 16: "In this chat" (`headline_3`, hidden in the sheet where the sheet head shows it), CastCard Nova, CastCard Iris, the Made in this chat block (header, list card, Download all), Button secondary md `Plus` "Add a character" (toast "The character library is coming soon").
- Download all shows the toast "Downloading 3 files" and downloads the three SVG assets.

### Drawers and sheet

- ChatsDrawer (mobile), CastDrawer (1024 to 1279), CastSheet (mobile): each is a modal dialog (`role="dialog"`, `aria-modal="true"`, labelled by its title) with a focus trap. Focus moves to the first interactive element on open and returns to the trigger on close. Scrim click and Esc close it. Body scroll is locked while open.
- Motion: drawers slide 100% to 0 on the x axis over 200ms `cubic-bezier(.2,.8,.2,1)`; the sheet slides up the same way; the scrim fades over 200ms. No motion under reduced motion.

## Seed content and copy

On load the thread is exactly the Figma desktop screen: the hook open in its trim state, the cover open in its edit state, the loop paused, and both characters addressed. Copy is final; use it character for character (curly apostrophes included).

**Thread header:** "Late trains teaser", subtitle "You, Nova and Iris".

**Seed thread, top to bottom**

| # | Sender | Header | Time | Text | Media and state |
| --- | --- | --- | --- | --- | --- |
| 1 | DayDivider |  |  | Today |  |
| 2 | Ada (user) |  | 21:03 | Chorus idea: late trains, city lights, feeling far from home. Can you sketch a 20s hook? |  |
| 3 | Nova | shown | 21:04 | Here’s a 20s hook at 92 BPM, lo-fi. | MediaAudio "Late trains hook", "0:20 · 92 BPM · lo-fi", state trimming, selection 4s to 18s |
| 4 | Ada (user) |  | 21:05 | @Iris can you make cover art that matches this? |  |
| 5 | SystemLine |  |  | Iris joined the chat |  |
| 6 | Iris | shown | 21:06 | On it. Here’s a first pass in Nova’s night tones. Tell me what to change. | MediaImage "Cover art, late trains", "1:1 · v1", state editing, prompt "Night train window, city lights blurred, lo-fi album cover, soft grain, deep blue and amber", change field prefilled "Warmer lights and rain on the window" |
| 7 | Iris | hidden | 21:06 | Want a 6 second loop for the teaser? | MediaVideo "Teaser loop", "0:06 · 16:9", state default (paused at 0:00), prompt "Six second loop of the window lights, rain streaks, seamless, 16:9" |
| 8 | Nova | shown | 21:08 | That palette fits the synth pad, warming up the mix. |  |

Addressees on load: Nova and Iris. Composer: idle, empty draft.

**Sidebar:** "Chats" with three rows: "Late trains teaser", "21:08", "Nova: That palette fits the synth pad…" (active); "Sunday market vlog", "Yesterday", "Iris: Three thumbnails to pick from."; "Album cover ideas", "Mon", "You: Darker, with more grain please".

**Scripted replies.** Every reply is preceded by the TypingIndicator for 900 to 1400ms (random in that range). When both characters reply, Nova goes first and Iris starts 600ms after Nova's message lands. Muted characters never reply.

| Trigger | Who replies | Reply text | Media |
| --- | --- | --- | --- |
| Save trim on the hook | Nova | Tighter. The hook lands on the downbeat now. | none |
| Make changes on the cover | Iris | Warming the lights and adding rain. Here’s v2 to review. | EditCard (image): working, steps "Read your note" (done), "Warming the street lights" with detail "Matching Nova’s amber" (active), "Adding rain to the glass" (pending); ready after 3600ms |
| Apply edits on the cover | Nova, 1500ms later | Love the amber. I’ll nudge the pad warmer to match. | none |
| Make changes on the loop (from Edit prompt) | Iris | Grading it to the cover and tightening the loop. | EditCard (video): working, steps "Read your note" (done), "Warming the grade to match the cover" with detail "3 of 5 shots" (active), "Rendering" (pending); ready after 3600ms with the three video changes |
| A sent message mentioning cover, art, image or thumbnail, Iris addressed | Iris | Here’s another direction. | MediaImage "Cover art, take 2" generating 3000ms, then default "1:1 · v1" with `filter: hue-rotate(14deg) saturate(1.1)` |
| A sent message mentioning loop, video, teaser or clip, Iris addressed | Iris | Here’s a new loop. | MediaVideo "Teaser loop, take 2" generating 3000ms, then default |
| A sent message mentioning hook, beat, music, song, voice, melody or BPM, Nova addressed | Nova | New take coming up. | MediaAudio "Late trains hook, take 2" generating 3000ms, then default |
| Any other sent message | Each addressed character | Nova rotates: "On it. I’ll keep it at 92 BPM so it sits under the loop.", "Got it. Want me to try a warmer bassline?", "Nice. I’ll sketch a version with more space in the chorus." Iris rotates: "Noted. One question: should the rain read as soft or heavy?", "Got it. I’ll keep the palette in deep blue and amber.", "Understood. I’ll match the grain on the cover." | none |

New messages use the current clock time (`HH:mm`, 24-hour).

**Toasts**

| Trigger | Toast |
| --- | --- |
| Copy prompt | Prompt copied |
| Download (image, video) | Downloading Cover art, late trains (downloads the SVG) |
| Download (audio) | Audio files aren’t part of this prototype |
| Download all | Downloading 3 files |
| Regenerate | Iris made a new version / Nova made a new version |
| Removing the last addressee | Pick at least one character to reply |
| Attach, voice note | Attachments aren’t part of this prototype / Voice notes aren’t part of this prototype |
| New chat, other chats | This prototype has one chat: Late trains teaser |
| Add a character | The character library is coming soon |
| Open in editor | The full editor isn’t part of this prototype |
| Choosing a muted character in the picker | Nova unmuted |
| Undo apply | Back to v1 |

## Interactions and state model

One reducer owns the conversation, the media and the UI; components dispatch actions and render state. Timers live in `simulate.ts` and are cleared on unmount and on Reset demo.

**Types** (`features/chat/types.ts`)

```ts
type CharacterId = 'nova' | 'iris';
type Sender = 'user' | CharacterId;

interface Change { id: string; icon: 'scissors' | 'sparkles' | 'droplets' | 'repeat'; title: string; detail: string;
  tone: 'ai' | 'user'; undone: boolean; }

interface MediaBase { id: string; owner: CharacterId; title: string; version: number; prompt: string;
  changeDraft: string; changes: Change[]; }
interface AudioMedia extends MediaBase { kind: 'audio'; state: 'default' | 'trimming' | 'generating' | 'editing';
  fullDuration: number; trim: { start: number; end: number } | null; pendingTrim: { start: number; end: number };
  current: number; playing: boolean; }
interface ImageMedia extends MediaBase { kind: 'image'; state: 'default' | 'editing' | 'generating';
  src: string; filter: string | null; }
interface VideoMedia extends MediaBase { kind: 'video'; state: 'default' | 'playing' | 'trimming' | 'editing' | 'generating';
  fullDuration: number; trim: { start: number; end: number } | null; pendingTrim: { start: number; end: number };
  current: number; muted: boolean; }
interface EditCardMedia { id: string; kind: 'edit'; owner: CharacterId; targetId: string; targetKind: 'image' | 'video';
  status: 'working' | 'ready' | 'applied'; percent: number; stepIndex: number; view: 'before' | 'after'; changes: Change[]; }
type Media = AudioMedia | ImageMedia | VideoMedia | EditCardMedia;

type ThreadItem =
  | { id: string; kind: 'day'; label: string }
  | { id: string; kind: 'system'; icon: 'user' | 'mute' | 'unmute'; text: string }
  | { id: string; kind: 'typing'; character: CharacterId }
  | { id: string; kind: 'message'; sender: Sender; text: string; time: string; mediaId?: string };

interface ChatState {
  items: ThreadItem[]; media: Record<string, Media>;
  addressees: CharacterId[]; muted: Record<CharacterId, boolean>;
  draft: string; picker: { open: boolean; query: string; index: number };
  ui: { chatsOpen: boolean; castOpen: boolean; toast: { id: number; message: string } | null; highlightId: string | null };
  demo: { done: string[]; dismissed: boolean };
}
```

Show the header on a bot message by derivation (grouping rule), never by storing it.

**Addressees and mentions**

- On load: Nova and Iris (as in Figma). In the product a new chat defaults to whoever spoke last.
- Typing `@` at the start of the draft or after a space opens the picker; the query is the text after `@` up to the caret. Typing a space or deleting the `@` closes it.
- Picking a character switches the addressees to that character; `@all` sets both. On send, every `@Nova`, `@Iris` or `@all` in the text (case-insensitive) sets the addressees for that message and they stay set.
- Removing a chip narrows the addressees; the last one cannot be removed.
- Muting a character removes it from the addressees; if none remain, the other character becomes the addressee. Unmuting does not re-add it. A muted character never replies, its CastCard shows the muted state, and a SystemLine is added ("Nova is muted and won't reply", then "Nova is back").

**Sending**

1. Trim the draft; ignore empty sends. Append a user message with the current time; clear the draft; close the picker.
2. Work out the responders: the addressees minus muted characters, Nova first.
3. For each responder in turn: add a typing item, wait 900 to 1400ms, replace it with the reply from the "Scripted replies" table. Media replies start in `generating` and switch to `default` after 3000ms with AgentSteps advancing (step 2 active at 0ms, step 3 active at 1500ms, 100% at 3000ms).
4. Update the active chat row preview to the last message ("Iris: …").

**Playback**

- One thing plays at a time: starting any playback pauses the rest.
- Ticks every 100ms. Audio stops at the end and returns to 0:00; video loops until paused.
- Entering trimming or editing pauses that card.

**Trimming (audio and video)**

- Trim enters `trimming` with `pendingTrim` = the seed selection (hook 4 to 18, loop 0.8 to 5.4) the first time, otherwise the full length.
- Dragging or arrowing a handle updates `pendingTrim` live; minimum length 2s for audio and 1s for video.
- Save trim: `trim = pendingTrim`, the card returns to `default` with the trimmed duration, a `user` ChangeItem is added ("Trimmed to 0:04 to 0:18" / "Trimmed to 4.6s"), details and the MadeItem meta update. Saving a hook trim triggers Nova's reply.
- Cancel returns to `default` with nothing changed. Undo on the ChangeItem restores the full duration and marks the change undone; Redo re-applies it.

**Editing (image, and Edit prompt on any card)**

- Edit on the image, or Edit prompt on any card, opens `editing`: the edit slot from MediaImage, with PromptReference showing that card's prompt and the field prefilled from `changeDraft` (the seed cover has "Warmer lights and rain on the window").
- Make changes: the card returns to `default`; the owner replies (Iris for the image and loop, Nova for the hook). Image and video get an EditCard that runs `working` for 3600ms (percent 0, 33, 66, 100; steps advance every 1200ms), then `ready` with view After. The hook regenerates in place for 2400ms and comes back as v2.
- Before / After swaps the EditCard thumbnail only.
- Apply edits: the target card updates (image: warm filter, "1:1 · v2"; loop: trimmed to 0.8 to 5.4, "0:05 · 16:9 · v2"), the MadeItem meta updates, the EditCard becomes `applied`, and for the cover Nova reacts 1500ms later.
- Refine reopens the target card's edit slot with the same text and scrolls to it. Undo apply restores v1 and returns the EditCard to `ready`.

**Other actions**

- Regenerate: `generating` for 2400ms, then `default` with the version bumped and the toast "Iris made a new version" (or Nova).
- Made in this chat rows scroll to and highlight the source message. Thread header avatar stack opens the cast (drawer or sheet).
- Auto-scroll: new items scroll the list to the bottom only when the reader is within 120px of it; otherwise a Button secondary sm "New messages" pill appears centred 16 above the composer and scrolls down when pressed.
- Reset demo restores the seed exactly, closes every overlay and clears all timers.

## Motion, accessibility and keyboard

Motion is quiet and functional, every control works from the keyboard, and the thread reads correctly in a screen reader.

**Motion**

| Use | Duration | Easing |
| --- | --- | --- |
| Hover and pressed colour changes | 150ms | ease |
| Chip removal, new message entrance (opacity 0 to 1, translateY 4px to 0) | 120 to 160ms | `cubic-bezier(.2,.8,.2,1)` |
| Toast in and out | 160ms | same |
| Drawers, sheet, scrim | 200ms | same |
| Progress fill | 300ms | ease |
| LoaderCircle spin | 900ms per turn | linear |
| Typing dots | 1200ms loop, 200ms stagger | ease-in-out |
| Highlight ring fade | 1200ms | ease-out |

Under `prefers-reduced-motion: reduce`: no transforms, no loops (spinner and dots static, video poster still), colour changes only.

**Accessibility**

- Landmarks: `<nav aria-label="Chats">`, `<main>` with the thread title as the only `<h1>`, `<aside aria-label="Cast">`. A visually hidden "Skip to message box" link is the first focusable element.
- The message list is `role="log"` with `aria-live="polite"`; each new message is announced as "Iris: Here’s another direction. Image, Cover art, take 2." Typing indicators are announced once ("Iris is typing").
- Identity is never colour alone: name and role text always accompany the ring.
- Every IconButton has an aria-label; toggles use `aria-pressed` (Mute) or `aria-expanded` (More actions, Mention); sliders use `role="slider"` with value text; the picker is a listbox with `aria-activedescendant` driven from the textarea.
- Contrast: body text `--contentPrimary` on `--backgroundElevation0` and on peach meets WCAG AA; `--contentTetiary` is only used for 12px-and-up supporting text, never for actions.
- Touch targets on mobile are at least 44x44. Chips and small buttons extend their hit area with a transparent pseudo-element when they are smaller.
- Images have the alt text given in the seed; decorative waveforms are `aria-hidden`.

**Keyboard**

| Where | Key | Result |
| --- | --- | --- |
| Composer | Enter / Shift + Enter | Send / new line |
| Composer | `@` | Open the mention picker |
| Mention picker | Up, Down / Enter, Tab / Esc | Move / insert / close |
| Edit field | Ctrl or Cmd + Enter / Esc | Make changes / cancel |
| Trim handles, scrubbers | Left, Right / Home, End | Step / jump to the ends |
| Menu | Up, Down / Enter / Esc | Move / choose / close and return focus |
| Drawers, sheet | Esc | Close and return focus to the trigger |
| Anywhere | Esc | Closes the topmost layer only: picker, then menu, then drawer or sheet |

## Demo affordances for reviewers

A reviewer should find the interesting states in two minutes without reading anything else. Add two things built from the same components: a "Try the prototype" checklist and a phone preview.

**Try the prototype card**

- Placement: inside the sidebar, pinned to its bottom (`margin-top:auto`), so it never covers the thread. On mobile it sits at the bottom of the chats drawer.
- Card: background `--backgroundElevation1`, `border-radius: var(--radius-300)`, `box-shadow: var(--elevation_half)`, padding 16, column gap 8.
- Title "Try the prototype" (`body_small_bold`) with a note in `quote_body` and `--contentAction_Default`: "Nova makes the music. Iris makes the visuals."
- Checklist, column gap 8, each row an AgentStep-style line (`Circle` in `--contentTetiary`, becoming `CircleCheck` in `--contentConstructive` when done), `body_small`:
  1. Save the trim on Nova’s hook
  2. Make changes to Iris’s cover, then apply them
  3. Play the teaser loop
  4. Mention @Iris or @all in the message box
  5. Mute a character in the cast
  6. Try the phone preview, or make the window narrower
- Each row is a button that scrolls to and highlights the place to act (row 4 focuses the composer and inserts `@`).
- Footer row, space-between: Button link sm `RotateCcw` "Reset demo"; Button link sm "Hide" (stores the dismissal in `localStorage`, wrapped in try/catch; a "Show tips" link in the sidebar header brings it back).
- Credit line under the card: "Rekka · prototype by Felix Oginni" (`body_tiny`, `--contentTetiary`) linking to the Figma file in a new tab.

**Phone preview**

- In the card, a segmented pair (styled like the EditCard Before / After pair): "Fit window" and "Phone 390".
- Phone 390 renders the whole app inside a centred 390x844 frame on the cream ground: 1px `--border_Decorative` border, `--radius-300` corners, `box-shadow: var(--elevation_3)`, overflow hidden, with a Button link sm "Back to full view" above it.
- The layout must therefore come from a context value, not only from media queries: `layout = forced ?? (width >= 1280 ? 'web' : width >= 1024 ? 'web-collapsed' : 'mobile')`. In the phone frame, add the class `is-small` on the app root so `body_tiny` uses 10/12 exactly as the 576px media query does (`.is-small .body_tiny { font-size:10px; line-height:12px }`).
- Using the phone preview or crossing a breakpoint ticks checklist row 6.

## Acceptance criteria and QA checklist

The prototype is done when every box below is ticked; Claude Code works through it in the final phase, alongside the automated checks in "Verification loop".

**Visual match (1px tolerance)**

- [ ] At 1440 x 900 the screen matches `desktop-1440.png`: sidebar edge x 280, message column x 320 to 1080, cast panel from x 1120, header 75 tall, cast panel border running the full height.
- [ ] At 744 and 390 wide the mobile shell matches `tablet-744.png` and `mobile-390.png`: header 61 tall, list padding 16, composer dock padding 8 16 16, tiny text 10/12 at 390.
- [ ] Typing `@I` on mobile reproduces the Figma mentioning state: picker with Iris selected, Nova, @all; only the Iris chip.
- [ ] Every bubble, card, chip and button uses the radius, padding and shadow in its spec; the media cards cap at 480 (400 for images); bubbles wrap at 560.
- [ ] Fonts load (Karla, DM Sans, Caveat) with no fallback flash longer than the first paint.

**Tokens and code hygiene**

- [ ] `npm run check:tokens` passes: no hex, `rgb(`, `hsl(` or px font sizes anywhere in `src` outside `tokens.css` and `typography.css`.
- [ ] Every text element uses one class from "Typography".
- [ ] Component names and files match this brief; no unused components; TypeScript strict passes with no `any`.

**States reachable by interaction**

- [ ] MediaAudio: default, playing, trimming (live times while dragging), generating, trimmed with ChangeItem, undo and redo.
- [ ] MediaImage: default, editing (PromptReference read-only, Copy works, field focused), generating (Regenerate), v2 after apply.
- [ ] MediaVideo: default, playing with caption, trimming, generating, editing via Edit prompt, and the compact layout with the More menu when the card is under 300px wide (try a 320px window).
- [ ] EditCard image and video: working with advancing steps, ready with Before / After, applied, undo apply, Refine.
- [ ] Composer: idle (mic), typing (send), mentioning (picker), addressee chips, last-chip protection.
- [ ] Cast: mute and unmute with SystemLines and the muted CastCard; muted characters never reply; Made in this chat rows jump and highlight.
- [ ] 1024 to 1279: cast drawer from the avatar stack. Below 1024: chats drawer and cast sheet. Phone 390 preview works on a laptop.
- [ ] Toasts appear for every row of the Toasts table.

**Accessibility and keyboard**

- [ ] The whole demo path (trim, edit and apply, play, mention, mute) works with the keyboard only, with a visible focus ring at every step.
- [ ] axe DevTools reports no serious or critical issues; Lighthouse accessibility 95 or higher.
- [ ] Screen reader announces new messages and step changes once each.
- [ ] Reduced motion removes every transform and loop.

**Copy and behaviour**

- [ ] All copy matches "Seed content and copy", in British spelling, with no em dashes.
- [ ] Replies wait for the typing indicator, never overlap, and follow the addressee rules.
- [ ] Reset demo restores the seed exactly, including trim and edit states, and clears every timer.
- [ ] No console errors or warnings; no layout shift when messages arrive; works in current Chrome, Safari and Firefox.

## Verification loop

Every phase ends with the same loop: build, screenshot, compare with Figma, look at the diff, fix, repeat until the numbers below pass. Claude Code must open and look at the diff images, not only read the percentages.

**1. Figma references.** For each target node, call `get_screenshot` with `maxDimension` equal to the node's long edge and save the PNG (the tool returns a download URL) to `tests/figma/`:

| File | Node | Viewport for the local shot |
| --- | --- | --- |
| `desktop-1440.png` | 82:10705 | 1440 wide, full length |
| `tablet-744.png` | 82:10706 | 744 wide, full length |
| `mobile-390.png` | 82:10707 | 390 wide, full length |
| `<component>.png` | the component's node from "Figma map" | the component gallery (below) |

**2. Capture mode.** The Figma screens are full-length captures, but the app is a fixed-height chat. Add two query parameters, not linked anywhere in the UI:

- `?capture=full`: the root height becomes auto, the message list stops scrolling and shows every message, sticky positioning is off, the composer sits at the end, and timers and animations are paused. The page then has the same geometry as the Figma frame.
- `&state=mentioning`: the draft is `@I`, the picker is open with Iris selected, and only Iris is addressed (the Figma Tablet and Mobile frames). Desktop is captured without it.
- `?gallery`: a plain page that renders every component in every state from the Figma map, one labelled block per Figma variant, for component-level comparison.

**3. Local screenshots and diff** (`tests/visual.spec.ts`): run against `npm run preview`, wait for `document.fonts.ready` and all images, set the viewport width, take a full-page screenshot, compare with the Figma PNG using `pixelmatch` (threshold 0.1), and write the diff to `tests/output/`.

| Target | Pass |
| --- | --- |
| Desktop 1440, Tablet 744, Mobile 390 | Under 2% of pixels differ, and no region of difference larger than 24x24 except antialiasing along text |
| Each component in the gallery against its Figma node | Under 1% of pixels differ |
| Page height | Within 8px of the Figma frame height |

**4. Tokens** (`scripts/check-tokens.mjs`): scan every `.ts`, `.tsx` and `.css` file in `src`. Fail on `#` followed by 3 to 8 hex digits, `rgb(`, `rgba(`, `hsl(`, and `font-size` or `line-height` with a literal value, except in `src/styles/tokens.css` and `src/styles/typography.css`. Print file, line and match.

**5. Accessibility** (`tests/a11y.spec.ts`): run axe at 1440 and 390 on load, with the picker open, with the More menu open, and with each drawer and the sheet open. Zero serious or critical violations. Then drive the demo path with the keyboard only (Tab, Enter, arrows, Esc): save the trim, make and apply the cover edit, play the loop, mention @Iris, mute Nova. Assert the visible result of each step.

**6. Report.** At the end of each phase, print a table of mismatch percentages per target, the token check result, the axe result, and anything parked in `docs/DECISIONS.md`.

## Deploy to Vercel

Deploy to Vercel on the free Hobby plan. The prototype is a static Vite build, so it only uses CDN bandwidth, which the free plan covers.

**Why Vercel, not Railway**

|  | Vercel Hobby | Railway |
| --- | --- | --- |
| Price | Free | Free plan: $1 of usage credit a month; Hobby plan: $5 a month |
| Fit for a static site | Native: Vite preset, global CDN, preview URL per push | Runs a server process, which spends credit continuously |
| Limits that matter here | 100 GB data transfer and 100 deployments a day included; personal, non-commercial use only | 0.5 GB RAM and 1 vCPU per service on the free plan |

A take-home prototype for a job application is personal, non-commercial use. Sources: [Vercel Hobby plan](https://vercel.com/docs/plans/hobby), [Railway plans](https://docs.railway.com/pricing/plans).

**Before deploying**

- `npm run check` passes and every box in "Acceptance criteria" is ticked.
- Add sharing metadata to `index.html`: `<title>Rekka · Multi-bot chat prototype</title>`, a description ("One chat, two characters: Nova makes the music, Iris makes the visuals. Prototype by Felix Oginni."), Open Graph and Twitter tags, and `public/og.png` (1200x630, cropped from `tests/figma/desktop-1440.png`), so the link previews well in Greenhouse and email.
- Add `vercel.json`:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

**Steps (Claude Code runs these, asking before the first production deploy)**

1. Commit everything. Create the GitHub repo and push: `gh repo create rekka-multibot-chat --public --source=. --push` (use `--private` if Felix prefers; Vercel works with either).
2. Install and sign in: `npm i -g vercel`, then `vercel login` (Felix completes the browser step).
3. Link and deploy a preview: `vercel` (accept the detected Vite settings; project name `rekka-multibot-chat`). Open the preview URL and repeat the visual check at 1440 and 390 against it.
4. Deploy production: `vercel --prod`. The URL is `https://rekka-multibot-chat.vercel.app` if the name is free, otherwise the one Vercel prints.
5. Make sure reviewers can open it without a Vercel login: in the project's Settings, Deployment Protection, keep Vercel Authentication on preview deployments only (the standard setting), never on production.
6. Optional: connect the GitHub repo in the Vercel dashboard so every push to `main` redeploys automatically.
7. Report the production URL, the preview URL, and the final check table. Felix adds the production link to the Greenhouse submission and the Read me frame in Figma.

## CLAUDE.md

Saved as `CLAUDE.md` in the repo root.

Linear issue: https://linear.app/lixef/issue/LIX-5/multi-bot-chat-claude-code
