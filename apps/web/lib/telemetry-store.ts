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
