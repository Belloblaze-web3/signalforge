import { describe, expect, it } from "vitest";
import { buildAgentRun, buildDebate, buildPracticeTrade, scoreNarrative } from "./marketEngine";

describe("SignalForge narrative engine", () => {
  it("promotes a multi-source bullish narrative to a practice buy", () => {
    const result = scoreNarrative("SOL liquidity rotation", 1.5, 3);
    expect(result.sourcesCount).toBe(5);
    expect(result.convergence).toBe(100);
    expect(result.verdict).toBe("practice buy");
    expect(result.ruleTrace.every(rule => rule.passed)).toBe(true);
  });

  it("keeps a weak narrative on watch or pass", () => {
    const result = scoreNarrative("ETH restaking unwind", 1.5, 3);
    expect(result.sourcesCount).toBe(1);
    expect(["watch", "pass"]).toContain(result.verdict);
    expect(result.ruleTrace[0]?.passed).toBe(false);
  });

  it("builds a bounded paper position from the score", () => {
    const score = scoreNarrative("SOL liquidity rotation", 1, 2);
    const trade = buildPracticeTrade(score, 1, 2);
    expect(trade.token).toBe("SOL");
    expect(trade.sizePct).toBeLessThanOrEqual(2);
    expect(trade.maxRiskPct).toBe(1);
    expect(trade.stopLoss).toBeLessThan(trade.entry);
    expect(trade.takeProfit).toBeGreaterThan(trade.entry);
  });

  it("returns a trade only when the rule gate passes", () => {
    const result = buildAgentRun(1.5, 3, "SOL liquidity rotation");
    expect(result.trade?.side).toBe("long");
    expect(result.trade?.rationale).toContain("trusted voices converged");
  });
});


describe("SignalForge bull / bear debate", () => {
  it("argues from shared evidence and produces a judge verdict", () => {
    const result = buildDebate("SOL liquidity rotation");
    expect(result.bull.evidenceIds.length).toBe(4);
    expect(result.bear.evidenceIds.length).toBe(1);
    expect(result.judge.verdict).toBe("bull wins");
    expect(result.judge.ruleTrace.every(rule => rule.passed)).toBe(true);
    expect(result.judge.rationale).toContain("broader independent evidence");
  });
});
