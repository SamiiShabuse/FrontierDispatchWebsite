import snowflake from "snowflake-sdk";
import { RunTelemetryInput, TelemetrySummary } from "@/lib/types";

type SnowflakeResult = {
  configured: boolean;
  reason?: string;
  mode: "snowflake" | "local-dev-fallback";
};

const requiredEnvVars = [
  "SNOWFLAKE_ACCOUNT",
  "SNOWFLAKE_USERNAME",
  "SNOWFLAKE_PASSWORD",
  "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE",
  "SNOWFLAKE_SCHEMA",
];

function isSnowflakeConfigured(): boolean {
  return requiredEnvVars.every((name) => Boolean(process.env[name]));
}

function envRequired(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function createConnection() {
  return snowflake.createConnection({
    account: envRequired("SNOWFLAKE_ACCOUNT"),
    username: envRequired("SNOWFLAKE_USERNAME"),
    password: envRequired("SNOWFLAKE_PASSWORD"),
    warehouse: envRequired("SNOWFLAKE_WAREHOUSE"),
    database: envRequired("SNOWFLAKE_DATABASE"),
    schema: envRequired("SNOWFLAKE_SCHEMA"),
    role: process.env.SNOWFLAKE_ROLE,
  });
}

function execute<T = unknown>(
  sqlText: string,
  binds: Array<string | number | boolean | null> = [],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const connection = createConnection();
    connection.connect((connectErr) => {
      if (connectErr) {
        reject(connectErr);
        return;
      }
      connection.execute({
        sqlText,
        binds,
        complete: (err, _stmt, rows) => {
          connection.destroy((destroyErr) => {
            if (destroyErr) {
              // no-op: cleanup failed after query completion
            }
          });
          if (err) {
            reject(err);
            return;
          }
          resolve((rows ?? []) as T[]);
        },
      });
    });
  });
}

export async function insertTelemetryToSnowflake(
  input: RunTelemetryInput,
): Promise<SnowflakeResult> {
  if (!isSnowflakeConfigured()) {
    return {
      configured: false,
      reason: "Snowflake not configured",
      mode: "local-dev-fallback",
    };
  }

  await execute(
    `INSERT INTO RUNS
      (id, created_at, run_id, contracts, towns, route_choice, events, on_time, payout, town_stability_delta, source, solana_signature, voice_id, plan_preview, risk_score)
      SELECT ?, TO_TIMESTAMP_NTZ(?), ?, PARSE_JSON(?), PARSE_JSON(?), ?, PARSE_JSON(?), ?, ?, PARSE_JSON(?), ?, ?, ?, ?, ?`,
    [
      input.id ?? "",
      input.created_at ?? new Date().toISOString(),
      input.run_id ?? "",
      JSON.stringify(input.contracts),
      JSON.stringify(input.towns),
      input.route_choice,
      JSON.stringify(input.events),
      input.on_time,
      input.payout,
      JSON.stringify(input.town_stability_delta),
      input.source ?? "manual",
      input.solana_signature ?? "",
      input.voice_id ?? "",
      input.plan_preview ?? "",
      input.risk_score ?? null,
    ],
  );

  return { configured: true, mode: "snowflake" };
}

export async function queryTelemetrySummaryFromSnowflake(): Promise<
  SnowflakeResult & { summary?: TelemetrySummary }
> {
  if (!isSnowflakeConfigured()) {
    return {
      configured: false,
      reason: "Snowflake not configured",
      mode: "local-dev-fallback",
    };
  }

  const totalRows = await execute<{ TOTAL: number }>(
    "SELECT COUNT(*) AS TOTAL FROM RUNS",
  );
  const onTimeRows = await execute<{ ON_TIME_RATE: number }>(
    "SELECT COALESCE(AVG(IFF(on_time, 1, 0)), 0) * 100 AS ON_TIME_RATE FROM RUNS",
  );
  const eventRows = await execute<{ EVENT: string; CNT: number }>(
    `SELECT f.value::string AS EVENT, COUNT(*) AS CNT
     FROM RUNS, LATERAL FLATTEN(input => events) f
     GROUP BY EVENT
     ORDER BY CNT DESC
     LIMIT 1`,
  );
  const stabilityRows = await execute<{ TOWN: string; AVG_DELTA: number }>(
    `SELECT f.key::string AS TOWN, AVG(f.value::float) AS AVG_DELTA
     FROM RUNS, LATERAL FLATTEN(input => town_stability_delta) f
     GROUP BY TOWN`,
  );
  const overTimeRows = await execute<{ DAY: string; COUNT: number }>(
    `SELECT TO_VARCHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS DAY, COUNT(*) AS COUNT
     FROM RUNS
     GROUP BY 1
     ORDER BY 1 DESC
     LIMIT 15`,
  );
  const sourceRows = await execute<{ SOURCE: string; COUNT: number }>(
    `SELECT COALESCE(source, 'manual') AS SOURCE, COUNT(*) AS COUNT
     FROM RUNS
     GROUP BY 1
     ORDER BY 2 DESC`,
  );
  const chainProofRows = await execute<{ RATE: number }>(
    `SELECT COALESCE(COUNT_IF(solana_signature IS NOT NULL AND solana_signature <> '') / NULLIF(COUNT(*), 0), 0) * 100 AS RATE
     FROM RUNS`,
  );
  const avgRiskRows = await execute<{ AVG_RISK: number }>(
    "SELECT COALESCE(AVG(risk_score), 0) AS AVG_RISK FROM RUNS WHERE risk_score IS NOT NULL",
  );
  const routeRows = await execute<{ ROUTE: string; COUNT: number }>(
    `SELECT route_choice AS ROUTE, COUNT(*) AS COUNT
     FROM RUNS
     GROUP BY ROUTE
     ORDER BY COUNT DESC`,
  );

  const townStabilityAverages = stabilityRows.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.TOWN] = Number(row.AVG_DELTA ?? 0);
      return acc;
    },
    {},
  );

  return {
    configured: true,
    mode: "snowflake",
    summary: {
      totalRuns: Number(totalRows[0]?.TOTAL ?? 0),
      onTimeRate: Number(onTimeRows[0]?.ON_TIME_RATE ?? 0),
      mostCommonEvent: eventRows[0]?.EVENT ?? "N/A",
      townStabilityAverages,
      runsOverTime: overTimeRows.map((row) => ({
        day: row.DAY,
        count: Number(row.COUNT ?? 0),
      })),
      sourceBreakdown: sourceRows.map((row) => ({
        source: row.SOURCE,
        count: Number(row.COUNT ?? 0),
      })),
      chainProofRate: Number(chainProofRows[0]?.RATE ?? 0),
      averageRiskScore: Number(avgRiskRows[0]?.AVG_RISK ?? 0),
      routeChoiceBreakdown: routeRows.map((row) => ({
        route: row.ROUTE,
        count: Number(row.COUNT ?? 0),
      })),
    },
  };
}

export function snowflakeConfiguredFlag() {
  return isSnowflakeConfigured();
}
