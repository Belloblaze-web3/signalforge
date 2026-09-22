export type Sentiment = "bullish" | "neutral" | "bearish";
export type Urgency = "low" | "medium" | "high";

export type Source = {
  id: string;
  handle: string;
  name: string;
  platform: "X" | "Discord" | "Telegram";
  specialty: string;
  trustScore: number;
  enabled: boolean;
  accent: string;
};

export type Evidence = {
  id: string;
  sourceId: string;
  token: string;
  narrative: string;
  sentiment: Sentiment;
  conviction: number;
  urgency: Urgency;
  excerpt: string;
  age: string;
  url: string;
};

export type RuleTrace = { rule: string; result: string; passed: boolean };

export type NarrativeScore = {
  narrative: string;
  token: string;
  score: number;
  verdict: "practice buy" | "watch" | "pass";
  confidence: number;
  convergence: number;
  conviction: number;
  urgency: number;
  evidenceCount: number;
  sourcesCount: number;
  marketContext: string;
  ruleTrace: RuleTrace[];
};

export const demoSources: Source[] = [
  { id: "src-01", handle: "market_maven", name: "Market Maven", platform: "X", specialty: "macro + flows", trustScore: 94, enabled: true, accent: "#b7f34a" },
  { id: "src-02", handle: "onchain_owl", name: "Onchain Owl", platform: "X", specialty: "wallet intelligence", trustScore: 91, enabled: true, accent: "#65d9ff" },
  { id: "src-03", handle: "protocol_pulse", name: "Protocol Pulse", platform: "X", specialty: "protocol metrics", trustScore: 89, enabled: true, accent: "#ffb870" },
  { id: "src-04", handle: "defi_desk", name: "DeFi Desk", platform: "Discord", specialty: "ecosystem rotations", trustScore: 86, enabled: true, accent: "#d39bff" },
  { id: "src-05", handle: "risk_signal", name: "Risk Signal", platform: "X", specialty: "risk + derivatives", trustScore: 84, enabled: true, accent: "#ff7c9d" },
  { id: "src-06", handle: "builder_alpha", name: "Builder Alpha", platform: "Telegram", specialty: "developer activity", trustScore: 81, enabled: false, accent: "#91a3b0" },
];

export const demoEvidence: Evidence[] = [
  { id: "ev-01", sourceId: "src-01", token: "SOL", narrative: "SOL liquidity rotation", sentiment: "bullish", conviction: 91, urgency: "high", excerpt: "Risk is rotating into high-beta L1s again. SOL has the cleanest liquidity profile on my screen.", age: "8m", url: "https://x.com/market_maven/status/demo-01" },
  { id: "ev-02", sourceId: "src-02", token: "SOL", narrative: "SOL liquidity rotation", sentiment: "bullish", conviction: 88, urgency: "high", excerpt: "Large wallets are adding SOL while exchange balances trend lower. Watching the same bid repeat.", age: "14m", url: "https://x.com/onchain_owl/status/demo-02" },
  { id: "ev-03", sourceId: "src-03", token: "SOL", narrative: "SOL liquidity rotation", sentiment: "bullish", conviction: 82, urgency: "medium", excerpt: "DEX volume is recovering faster than perp open interest. That is healthier rotation, not just leverage.", age: "21m", url: "https://x.com/protocol_pulse/status/demo-03" },
  { id: "ev-04", sourceId: "src-04", token: "SOL", narrative: "SOL liquidity rotation", sentiment: "bullish", conviction: 79, urgency: "medium", excerpt: "Our ecosystem watchlist is narrowing to SOL beta. Waiting for the pullback instead of chasing green candles.", age: "32m", url: "https://discord.gg/demo-signalforge" },
  { id: "ev-05", sourceId: "src-05", token: "SOL", narrative: "SOL liquidity rotation", sentiment: "neutral", conviction: 67, urgency: "low", excerpt: "Funding is not stretched yet, but a 6% flush would reset the setup. Size like volatility is real.", age: "44m", url: "https://x.com/risk_signal/status/demo-05" },
  { id: "ev-06", sourceId: "src-01", token: "ETH", narrative: "ETH restaking unwind", sentiment: "bearish", conviction: 74, urgency: "medium", excerpt: "ETH beta looks heavy until staking outflows stabilize. I would not force a long here.", age: "1h", url: "https://x.com/market_maven/status/demo-06" },
  { id: "ev-07", sourceId: "src-03", token: "ARB", narrative: "L2 fee compression", sentiment: "neutral", conviction: 61, urgency: "low", excerpt: "Usage is solid, but fee compression makes the token catalyst less immediate.", age: "2h", url: "https://x.com/protocol_pulse/status/demo-07" },
];

const urgencyScore: Record<Urgency, number> = { low: 45, medium: 70, high: 92 };

export function scoreNarrative(narrative = "SOL liquidity rotation", riskLimit = 1.5, maxPositionPct = 3): NarrativeScore {
  const evidence = demoEvidence.filter(item => item.narrative === narrative);
  const token = evidence[0]?.token ?? "SOL";
  const uniqueSources = new Set(evidence.map(item => item.sourceId));
  const conviction = evidence.length ? Math.round(evidence.reduce((sum, item) => sum + item.conviction, 0) / evidence.length) : 0;
  const urgency = evidence.length ? Math.round(evidence.reduce((sum, item) => sum + urgencyScore[item.urgency], 0) / evidence.length) : 0;
  const convergence = Math.min(100, Math.round((uniqueSources.size / 5) * 100));
  const bullishShare = evidence.length ? evidence.filter(item => item.sentiment === "bullish").length / evidence.length : 0;
  const score = Math.round(convergence * 0.35 + conviction * 0.35 + urgency * 0.15 + bullishShare * 100 * 0.15);
  const verdict = score >= 75 && evidence.length >= 3 ? "practice buy" : score >= 55 ? "watch" : "pass";
  const confidence = Math.min(97, Math.max(40, Math.round(score * 0.92)));
  const sizePct = Math.min(maxPositionPct, Math.max(0.5, Math.round((score / 100) * maxPositionPct * 10) / 10));
  return {
    narrative, token, score, verdict, confidence, convergence, conviction, urgency,
    evidenceCount: evidence.length, sourcesCount: uniqueSources.size,
    marketContext: token === "SOL" ? "Spot-led rotation; leverage is not yet crowded" : "Mixed tape; wait for cleaner confirmation",
    ruleTrace: [
      { rule: "R1 · Trusted-source convergence", result: `${uniqueSources.size}/5 selected voices agree`, passed: uniqueSources.size >= 3 },
      { rule: "R2 · Conviction floor", result: `${conviction}/100 average conviction`, passed: conviction >= 72 },
      { rule: "R3 · Sentiment majority", result: `${Math.round(bullishShare * 100)}% bullish evidence`, passed: bullishShare >= 0.6 },
      { rule: "R4 · Risk gate", result: `${sizePct}% position ≤ ${maxPositionPct}% cap · ${riskLimit}% max risk`, passed: maxPositionPct <= 5 && riskLimit <= 2 },
    ],
  };
}

export function buildPracticeTrade(score: NarrativeScore, riskLimit = 1.5, maxPositionPct = 3) {
  const entry = score.token === "SOL" ? 186.4 : score.token === "ETH" ? 3540 : 0.44;
  const stopDistance = score.token === "SOL" ? 10.4 : score.token === "ETH" ? 180 : 0.04;
  const takeDistance = score.token === "SOL" ? 18.6 : score.token === "ETH" ? 320 : 0.08;
  const sizePct = Math.min(maxPositionPct, Math.max(0.5, Math.round((score.score / 100) * maxPositionPct * 10) / 10));
  return { token: score.token, side: "long" as const, entry, stopLoss: Math.round((entry - stopDistance) * 100) / 100, takeProfit: Math.round((entry + takeDistance) * 100) / 100, sizePct, maxRiskPct: riskLimit, status: "open" as const, rationale: `Opened because ${score.sourcesCount} trusted voices converged on ${score.narrative.toLowerCase()} with ${score.conviction}/100 average conviction.` };
}

export function buildAgentRun(riskLimit: number, maxPositionPct: number, narrative = "SOL liquidity rotation") {
  const score = scoreNarrative(narrative, riskLimit, maxPositionPct);
  return { score, trade: score.verdict === "practice buy" ? buildPracticeTrade(score, riskLimit, maxPositionPct) : null };
}

export function getDemoSnapshot() {
  const score = scoreNarrative();
  return { sources: demoSources, evidence: demoEvidence, score, trades: [{ id: "trade-demo-01", createdAt: "2026-09-22T18:12:00.000Z", ...buildPracticeTrade(score) }] };
}

export function getNarratives() {
  return [
    { name: "SOL liquidity rotation", token: "SOL", status: "active", score: scoreNarrative("SOL liquidity rotation").score, delta: "+12" },
    { name: "ETH restaking unwind", token: "ETH", status: "watch", score: scoreNarrative("ETH restaking unwind").score, delta: "-6" },
    { name: "L2 fee compression", token: "ARB", status: "watch", score: scoreNarrative("L2 fee compression").score, delta: "+3" },
  ];
}

export const demoStats = { monitored: 6, signalWindow: "24h", evidenceScanned: 184, practiceTrades: 7 };
export const sampleAgentLog = [
  "18:12:02  ingest  5 relevant evidence items",
  "18:12:02  resolve  5 unique source IDs",
  "18:12:03  score   convergence=100 · conviction=81 · urgency=81",
  "18:12:03  gate    size=2.4% · max risk=1.5% · passed",
  "18:12:03  record  practice trade SOL / long",
];
export const demoMethod = [
  "Extract: token, narrative, sentiment, conviction, urgency",
  "Converge: count distinct trusted voices in the same narrative",
  "Gate: enforce user-defined risk and position limits",
  "Record: preserve cause → effect → practice-trade rationale",
];
export const demoLimitNotice = "This build uses seeded evidence to make judging deterministic. Plug in X / Discord / Telegram adapters without changing the scoring contract.";
export const demoTradeHistory = [
  { label: "SOL rotation", score: 82, result: "+4.1%", status: "closed" },
  { label: "ETH restaking", score: 48, result: "passed", status: "skipped" },
  { label: "ARB fee compression", score: 56, result: "watch", status: "held" },
];
export const demoTelemetry = [38, 44, 42, 56, 52, 69, 66, 78, 73, 88, 83, 96];
export const demoAgentSteps = [
  { n: "01", title: "Collect", body: "Capture only structured mentions with a token, narrative, and source." },
  { n: "02", title: "Converge", body: "Require three or more trusted voices before a narrative can graduate." },
  { n: "03", title: "Constrain", body: "Apply the user’s risk budget before sizing the practice position." },
  { n: "04", title: "Explain", body: "Write the evidence chain and invalidation beside the trade." },
];
export const defaultRiskLimit = 1.5;
export const defaultPositionCap = 3;
export const demoDisclaimer = "Practice mode only. Synthetic evidence. No wallet connection or live orders.";
export const demoConfig = { maxSources: 20, connectors: ["X", "Discord", "Telegram"] };
export const clampRisk = (value: number) => Math.min(2, Math.max(0.25, value));
export const clampPosition = (value: number) => Math.min(5, Math.max(0.5, value));


export type DebateArgument = {
  stance: "bull" | "bear";
  thesis: string;
  confidence: number;
  evidenceIds: string[];
  points: string[];
};

export type DebateResult = {
  topic: string;
  bull: DebateArgument;
  bear: DebateArgument;
  judge: { verdict: "bull wins" | "bear wins" | "hold"; confidence: number; rationale: string; ruleTrace: RuleTrace[] };
};

export function buildDebate(topic = "SOL liquidity rotation"): DebateResult {
  const relevant = demoEvidence.filter(item => item.narrative === topic);
  const bullish = relevant.filter(item => item.sentiment === "bullish");
  const bearRisk = relevant.find(item => item.sourceId === "src-05");
  const bullConfidence = bullish.length ? Math.round(bullish.reduce((sum, item) => sum + item.conviction, 0) / bullish.length) : 0;
  const bearConfidence = bearRisk?.conviction ?? 58;
  const bullScore = Math.round(bullConfidence * 0.55 + Math.min(100, bullish.length * 20) * 0.45);
  const bearScore = Math.round(bearConfidence * 0.55 + 42 * 0.45);
  const verdict = bullScore - bearScore >= 12 ? "bull wins" : bearScore - bullScore >= 12 ? "bear wins" : "hold";
  return {
    topic,
    bull: {
      stance: "bull",
      thesis: "Spot-led SOL rotation has breadth, not just leverage.",
      confidence: bullConfidence,
      evidenceIds: bullish.map(item => item.id),
      points: ["5 distinct voices align on the same token narrative", "DEX activity is recovering faster than perp open interest", "Wallet accumulation and lower exchange balances support the bid"],
    },
    bear: {
      stance: "bear",
      thesis: "A crowded high-beta trade can still flush before continuation.",
      confidence: bearConfidence,
      evidenceIds: bearRisk ? [bearRisk.id] : [],
      points: ["Funding can reprice quickly if momentum stalls", "A 6% flush is the stated reset level", "High-beta exposure needs smaller sizing than conviction alone suggests"],
    },
    judge: {
      verdict,
      confidence: Math.min(96, Math.max(54, Math.round(Math.abs(bullScore - bearScore) + 62))),
      rationale: verdict === "bull wins" ? "The bull case has broader independent evidence; the bear case changes sizing and invalidation, not the directional verdict." : verdict === "bear wins" ? "The downside case has enough evidence to block a practice position until confirmation improves." : "The arguments are too close; preserve capital and keep the narrative on watch.",
      ruleTrace: [
        { rule: "J1 · Shared evidence", result: `${relevant.length} mentions evaluated from the same window`, passed: relevant.length >= 3 },
        { rule: "J2 · Independent support", result: `${bullish.length} bullish sources vs ${bearRisk ? 1 : 0} explicit risk source`, passed: bullish.length >= 3 },
        { rule: "J3 · Adversarial risk check", result: "Bear case must state an invalidation or sizing constraint", passed: Boolean(bearRisk) },
        { rule: "J4 · Decision margin", result: `${Math.abs(bullScore - bearScore)} point spread`, passed: Math.abs(bullScore - bearScore) >= 12 },
      ],
    },
  };
}
