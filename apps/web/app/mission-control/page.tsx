"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { readRunContext } from "@/lib/run-context";
import { RunContext, RunTelemetryInput } from "@/lib/types";

type RecentRunsResponse = {
  ok: boolean;
  mode?: "snowflake" | "local-dev-fallback";
  configured?: boolean;
  runs?: RunTelemetryInput[];
  error?: string;
};

export default function MissionControlPage() {
  const [context, setContext] = useState<RunContext | null>(null);
  const [recentRuns, setRecentRuns] = useState<RunTelemetryInput[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [mode, setMode] = useState<string>("unknown");

  function refreshContext() {
    setContext(readRunContext());
  }

  async function loadRecentRuns() {
    setLoadingRuns(true);
    try {
      const response = await fetch("/api/telemetry/recent?limit=6");
      const payload = (await response.json()) as RecentRunsResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Failed to load recent telemetry");
      }
      setRecentRuns(payload.runs ?? []);
      setMode(payload.mode ?? "unknown");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoadingRuns(false);
    }
  }

  useEffect(() => {
    refreshContext();
    loadRecentRuns();
  }, []);

  const hasPlan = Boolean(context?.planText?.trim());
  const hasVoice = Boolean(context?.voice?.voiceId);
  const hasLedgerProof = Boolean(context?.ledger?.signature);

  return (
    <div className="space-y-5">
      <section className="fd-card space-y-2">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="text-[var(--muted)]">
          Live run continuity view for development and judge demos. Track current run context,
          then verify fresh telemetry from Snowflake or local fallback mode.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Current Run ID</p>
          <p className="mt-1 break-all text-sm font-semibold">{context?.runId ?? "No active run"}</p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Dispatch Plan</p>
          <p className="mt-1 text-xl font-bold">{hasPlan ? "Ready" : "Missing"}</p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Voice Briefing</p>
          <p className="mt-1 text-xl font-bold">{hasVoice ? "Ready" : "Missing"}</p>
        </div>
        <div className="fd-card">
          <p className="text-xs text-[var(--muted)]">Solana Proof</p>
          <p className="mt-1 text-xl font-bold">{hasLedgerProof ? "Minted" : "Pending"}</p>
        </div>
      </section>

      <section className="fd-card space-y-3">
        <h2 className="text-xl font-semibold">Pipeline Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/dispatch" className="fd-button">
            Open Dispatch
          </Link>
          <Link href="/telegraph" className="fd-button-secondary">
            Open Telegraph
          </Link>
          <Link href="/ledger" className="fd-button-secondary">
            Open Ledger
          </Link>
          <Link href="/dashboard" className="fd-button-secondary">
            Open Dashboard
          </Link>
          <Link href="/proof" className="fd-button-secondary">
            Open Proof Hub
          </Link>
          <button className="fd-button-secondary" onClick={refreshContext}>
            Refresh Context
          </button>
        </div>
        {context?.planText ? (
          <p className="rounded-md border border-black/10 bg-white/80 p-3 text-sm text-[var(--muted)]">
            Latest plan preview: {context.planText.slice(0, 220)}
            {context.planText.length > 220 ? "..." : ""}
          </p>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            No current run context yet. Generate a plan in Dispatch to initialize one.
          </p>
        )}
      </section>

      <section className="fd-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Recent Telemetry Runs</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)]">Mode: {mode}</span>
            <button className="fd-button-secondary" onClick={loadRecentRuns} disabled={loadingRuns}>
              {loadingRuns ? "Refreshing..." : "Refresh Runs"}
            </button>
          </div>
        </div>
        {recentRuns.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No telemetry yet. Mint a ledger proof or submit a manual run.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="py-2">Run</th>
                  <th className="py-2">Route</th>
                  <th className="py-2">On-time</th>
                  <th className="py-2">Payout</th>
                  <th className="py-2">Source</th>
                  <th className="py-2">Proof</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id ?? `${run.created_at}-${run.run_id}`} className="border-b border-black/10">
                    <td className="py-2">{run.run_id ?? run.id ?? "N/A"}</td>
                    <td className="py-2">{run.route_choice}</td>
                    <td className="py-2">{run.on_time ? "Yes" : "No"}</td>
                    <td className="py-2">${run.payout}</td>
                    <td className="py-2">{run.source ?? "manual"}</td>
                    <td className="py-2">{run.solana_signature ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
