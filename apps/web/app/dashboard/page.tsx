"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

type SummaryResponse = {
  ok: boolean;
  summary?: {
    totalRuns: number;
    onTimeRate: number;
    mostCommonEvent: string;
    townStabilityAverages: Record<string, number>;
    runsOverTime: Array<{ day: string; count: number }>;
    sourceBreakdown: Array<{ source: string; count: number }>;
    chainProofRate: number;
    averageRiskScore: number;
    routeChoiceBreakdown: Array<{ route: string; count: number }>;
  };
  mode?: "snowflake" | "local-dev-fallback";
  configured?: boolean;
  error?: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadSummary() {
    setLoading(true);
    try {
      const response = await fetch("/api/telemetry/summary");
      const payload = (await response.json()) as SummaryResponse;
      if (!response.ok || !payload.ok || !payload.summary) {
        throw new Error(payload.error ?? "Failed to load summary");
      }
      setData(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="space-y-5">
      {/* Snowflake track callout for judges */}
      <TrackCallout
        track="Best Use of Snowflake API"
        details="Dashboard metrics are queried from /api/telemetry/summary and refresh after each logged run."
      />
      <JudgeProof
        apiRoute="/api/telemetry/summary"
        codePath="/apps/web/app/dashboard + /apps/web/app/api/telemetry/summary/route.ts"
        clickSteps="Log a run, open dashboard, click Refresh Data, and verify stats changed."
      />

      <section className="fd-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Operations Dashboard</h1>
          <button className="fd-button-secondary" onClick={loadSummary} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
        {!data?.configured && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">
            Snowflake not configured. Running in local development fallback mode.
          </p>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Total Runs</p>
          <p className="mt-1 text-2xl font-bold">{data?.summary?.totalRuns ?? 0}</p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">On-time Rate</p>
          <p className="mt-1 text-2xl font-bold">
            {data?.summary?.onTimeRate?.toFixed(1) ?? "0.0"}%
          </p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Most Common Event</p>
          <p className="mt-1 text-2xl font-bold">{data?.summary?.mostCommonEvent ?? "N/A"}</p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Mode</p>
          <p className="mt-1 text-xl font-bold">{data?.mode ?? "unknown"}</p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Chain-Proof Rate</p>
          <p className="mt-1 text-2xl font-bold">
            {data?.summary?.chainProofRate?.toFixed(1) ?? "0.0"}%
          </p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Average Risk Score</p>
          <p className="mt-1 text-2xl font-bold">
            {data?.summary?.averageRiskScore?.toFixed(1) ?? "0.0"}
          </p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Telemetry Sources</p>
          <ul className="mt-1 text-sm text-[var(--muted)]">
            {(data?.summary?.sourceBreakdown ?? []).map((row) => (
              <li key={row.source}>
                {row.source}: {row.count}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Town Stability Averages</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {Object.entries(data?.summary?.townStabilityAverages ?? {}).map(([town, value]) => (
            <div key={town} className="rounded-md border border-black/10 p-2 text-sm">
              <p className="font-medium">{town}</p>
              <p className="text-[var(--muted)]">Average delta: {value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Runs Over Time</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/20">
                <th className="py-2">Day</th>
                <th className="py-2">Runs</th>
              </tr>
            </thead>
            <tbody>
              {(data?.summary?.runsOverTime ?? []).map((row) => (
                <tr key={row.day} className="border-b border-black/10">
                  <td className="py-2">{row.day}</td>
                  <td className="py-2">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Route Choice Breakdown</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(data?.summary?.routeChoiceBreakdown ?? []).map((row) => (
            <div key={row.route} className="rounded-md border border-black/10 p-2 text-sm">
              <p className="font-medium">{row.route}</p>
              <p className="text-[var(--muted)]">Runs: {row.count}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
