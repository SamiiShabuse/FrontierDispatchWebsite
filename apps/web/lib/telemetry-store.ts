import { RunTelemetryInput, TelemetrySummary } from "@/lib/types";
import {
  insertTelemetryToSnowflake,
  queryTelemetrySummaryFromSnowflake,
  snowflakeConfiguredFlag,
} from "@/lib/snowflake";

declare global {
  var __fdTelemetryRuns: RunTelemetryInput[] | undefined;
}

const fallbackRuns = global.__fdTelemetryRuns ?? [];
global.__fdTelemetryRuns = fallbackRuns;

function summarizeRuns(runs: RunTelemetryInput[]): TelemetrySummary {
  const totalRuns = runs.length;
  const onTimeRuns = runs.filter((run) => run.on_time).length;
  const eventCounter = new Map<string, number>();
  const townCounter: Record<string, { sum: number; count: number }> = {};
  const overTimeMap = new Map<string, number>();
  const sourceCounter = new Map<string, number>();
  const routeCounter = new Map<string, number>();
  const withProof = runs.filter((run) => Boolean(run.solana_signature?.trim())).length;
  let riskScoreTotal = 0;
  let riskScoreCount = 0;

  for (const run of runs) {
    for (const event of run.events) {
      eventCounter.set(event, (eventCounter.get(event) ?? 0) + 1);
    }
    Object.entries(run.town_stability_delta).forEach(([town, delta]) => {
      const current = townCounter[town] ?? { sum: 0, count: 0 };
      townCounter[town] = { sum: current.sum + delta, count: current.count + 1 };
    });
    const day = (run.created_at ?? new Date().toISOString()).slice(0, 10);
    overTimeMap.set(day, (overTimeMap.get(day) ?? 0) + 1);
    const source = run.source ?? "manual";
    sourceCounter.set(source, (sourceCounter.get(source) ?? 0) + 1);
    routeCounter.set(run.route_choice, (routeCounter.get(run.route_choice) ?? 0) + 1);
    if (typeof run.risk_score === "number") {
      riskScoreTotal += run.risk_score;
      riskScoreCount += 1;
    }
  }

  const mostCommonEvent =
    [...eventCounter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const townStabilityAverages = Object.fromEntries(
    Object.entries(townCounter).map(([town, stats]) => [
      town,
      stats.count ? Number((stats.sum / stats.count).toFixed(2)) : 0,
    ]),
  );

  const runsOverTime = [...overTimeMap.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => (a.day > b.day ? -1 : 1))
    .slice(0, 15);

  return {
    totalRuns,
    onTimeRate: totalRuns ? (onTimeRuns / totalRuns) * 100 : 0,
    mostCommonEvent,
    townStabilityAverages,
    runsOverTime,
    sourceBreakdown: [...sourceCounter.entries()].map(([source, count]) => ({
      source,
      count,
    })),
    chainProofRate: totalRuns ? Number(((withProof / totalRuns) * 100).toFixed(2)) : 0,
    averageRiskScore: riskScoreCount ? Number((riskScoreTotal / riskScoreCount).toFixed(2)) : 0,
    routeChoiceBreakdown: [...routeCounter.entries()].map(([route, count]) => ({
      route,
      count,
    })),
  };
}

export async function insertRun(input: RunTelemetryInput) {
  const result = await insertTelemetryToSnowflake(input);
  if (!result.configured) {
    fallbackRuns.push(input);
  }
  return result;
}

export async function getTelemetrySummary() {
  const result = await queryTelemetrySummaryFromSnowflake();
  if (!result.configured || !result.summary) {
    return {
      ...result,
      configured: snowflakeConfiguredFlag(),
      summary: summarizeRuns(fallbackRuns),
    };
  }
  return result;
}
