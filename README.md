# Rekka · Multi-bot chat prototype

One chat, two characters: Nova makes the music, Iris makes the visuals. An interactive React prototype for Felix Oginni's Creative Fabrica Product Designer (Studio) take-home, built on the Rekka design system.

- Spec: [docs/BRIEF.md](docs/BRIEF.md) · Figma vs brief decisions: [docs/DECISIONS.md](docs/DECISIONS.md) · QA: [docs/QA.md](docs/QA.md)
- Figma: [Felix Oginni | Idea.ai Challenge | Creative Fabrica](https://www.figma.com/design/mXVWjW8DQRoi3pdiBcY0Gi/Felix-Oginni-%7C-Idea.ai-Challenge-%7C-Creative-Fabrica)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # lint, token audit, build, axe + keyboard path, interaction flows, visual diff vs Figma
```

Tests run against `npm run preview` (port 4173) in Chromium. Set `PW_CHROMIUM` if Chromium is not at `/opt/pw-browsers/chromium`.

## Useful URLs

- `/?gallery`: every component in every state, one block per Figma variant.
- `/?capture=full`: the full-length, frozen screen used for the Figma comparison. Add `&state=mentioning` for the Tablet and Mobile frames.

## Try it in two minutes

The "Try the prototype" card at the bottom of the sidebar (inside the chats drawer on mobile) lists the demo path and ticks each step: save the trim on Nova's hook, make and apply changes to Iris's cover, play the loop, mention @Iris, mute a character, and try the phone preview.
