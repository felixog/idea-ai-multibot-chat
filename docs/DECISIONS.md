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
