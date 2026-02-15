# Design Parity Loop

Automated ten loop minimum parity runner for the local viewer.

Each loop captures local states, tries live Factify capture for the same states, falls back to frozen references when live capture is not usable, then runs strict judge scoring.

## Required states per loop

1. clean viewer shell
2. Ask AI drawer open
3. Comments drawer open with add comment flow visible

## Prerequisites

1. local dev server running
2. `OPENAI_API_KEY` exported
3. fallback baselines available
   1. `reference_screenshots/11_clean_document_view.png`
   2. `reference_screenshots/13_ai_chat_sidebar_open.png`
   3. `reference_screenshots/15_comments_drawer_open.png`

## Usage

Default run uses local `3001`, minimum ten loops, and keeps running after loop ten until all states pass.

```bash
npm run parity-loop
```

Explicit run with options:

```bash
node scripts/design-parity-loop.mjs --port 3001 --min-loops 10 --max-iterations 20
```

Optional URL override:

```bash
node scripts/design-parity-loop.mjs --factify-url "https://d.factify.com/documents/019c4c80-fa38-7662-95b8-27c427e6e686"
```

To stop right after minimum loops even if not passed:

```bash
node scripts/design-parity-loop.mjs --stop-after-min
```

## Judge contract

Per screenshot pair, judge returns JSON with:

1. `match`
2. `scores.layout`
3. `scores.spacing`
4. `scores.typography`
5. `scores.colors`
6. `scores.controls`
7. `differences` entries with `area`, `issue`, `severity`, `fixHint`

A view passes only when:

1. `match` is true
2. all five scores are at least 98
3. no high severity difference exists

A loop passes only when all three required views pass.

## Output

Per loop report:

1. `parity-runs/iter-X/judge-results.json`
2. local captures
3. live reference captures when available

Run summary:

1. `parity-runs/run-summary.json`
