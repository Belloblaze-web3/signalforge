# SignalForge

**SignalForge** is a transparent, replayable Multi-KOL Narrative Agent built for **BLI Legal Tech Hackathon 2**. It monitors a roster of trusted market voices, extracts structured token mentions, measures narrative convergence, applies user-defined risk limits, and records a practice position with the full cause → effect → constraint chain beside it.

> **Practice mode only.** The preview uses synthetic, deterministic evidence. It never connects a wallet or submits live orders.

## Why this entry is different

Most market-intelligence demos stop at sentiment. SignalForge makes the reasoning trail the product:

1. **Collect** evidence with token, narrative, sentiment, conviction, urgency, source, and timestamp.
2. **Converge** independent voices into one narrative only when trusted-source agreement clears the gate.
3. **Constrain** the decision with a maximum risk-per-trade and maximum position-size cap.
4. **Explain** the verdict, position size, invalidation, and every rule that passed or held.
5. **Replay** the same evidence through the same policy so a judge can reproduce the result.

## Demo

Open the live preview and click **Run agent replay**. Adjust the risk sliders, rerun the policy, inspect the evidence stream, and open the decision trace. The initial replay intentionally produces a SOL liquidity-rotation paper position because five distinct voices converge above the conviction floor.

## Transparent scoring policy

The score is a weighted 0–100 composite:

- 35% trusted-source convergence
- 35% average conviction
- 15% urgency
- 15% bullish-evidence share

A practice buy requires at least three distinct sources and a score of 75 or more. Before a position is recorded, the risk gate enforces a maximum 2% risk-per-trade and a maximum 5% position cap in the demo configuration. The UI writes the result as a trace rather than hiding it in a model response.

## Architecture

- **React + TypeScript + Tailwind** for the responsive signal desk.
- **tRPC** for typed `market.snapshot`, `market.narratives`, `market.config`, and `market.run` procedures.
- **Pure TypeScript scoring engine** in `server/marketEngine.ts` so the decision is deterministic, unit-testable, and easy to replay.
- **Managed full-stack hosting** with room to add Drizzle-backed workspaces and scheduled ingestion.

## Live adapter seam

The seeded `Evidence` contract is intentionally shaped for live connectors. Replace the deterministic corpus with verified adapters for X, Discord, and Telegram while keeping the scoring contract stable. Recommended production additions are source-level ingestion timestamps, deduplication by post ID, raw payload retention, API backoff, user-owned source rosters, and database-backed replay history.

## Local development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm check
pnpm test
pnpm build
```

## Submission pitch

> SignalForge turns distributed social conviction into a decision you can audit. It shows who said what, when voices converged, how the risk budget constrained the action, and what would invalidate the practice trade — without pretending a black-box prediction is a strategy.

## Disclaimer

This software is educational and for hackathon demonstration purposes only. It is not financial advice. All preview evidence and prices are synthetic.
