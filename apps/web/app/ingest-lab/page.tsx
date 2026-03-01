"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { readRunContext } from "@/lib/run-context";

type IngestResponse = {
  ok?: boolean;
  error?: string;
  mode?: "snowflake" | "local-dev-fallback";
};

export default function IngestLabPage() {
  const [sharedSecret, setSharedSecret] = useState("");
  const [runId, setRunId] = useState(`run-${Date.now()}`);
  const [contract, setContract] = useState("Emergency medicine escort");
  const [townsText, setTownsText] = useState("Tombstone,Deadwood");
  const [routeChoice, setRouteChoice] = useState<"short-risky" | "balanced" | "long-safe">(
    "balanced",
  );
  const [eventsText, setEventsText] = useState("Dust storm");
  const [onTime, setOnTime] = useState(true);
  const [payout, setPayout] = useState(320);
  const [riskScore, setRiskScore] = useState(58);
  const [stabilityText, setStabilityText] = useState('{"Tombstone": 1, "Deadwood": 2}');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const context = readRunContext();
    if (!context) return;
    setRunId(context.runId);
    setContract(context.selectedContract);
    setTownsText(context.towns.join(","));
    setRouteChoice(context.routeChoice);
    setEventsText(context.events.join(","));
    setRiskScore(
      context.routeChoice === "short-risky"
        ? 82
        : context.routeChoice === "long-safe"
          ? 35
          : 55,
    );
  }, []);

  const payload = {
    runId,
    contract,
    towns: townsText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    routeChoice,
    events: eventsText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    onTime,
    payout,
    townStabilityDelta: (() => {
      try {
        return JSON.parse(stabilityText) as Record<string, number>;
      } catch {
        return {};
      }
    })(),
    riskScore,
    timestamp: new Date().toISOString(),
  };

  async function sendIngest() {
    setLoading(true);
    try {
      if (!sharedSecret.trim()) {
        throw new Error("Enter ROBLOX_INGEST_SHARED_SECRET first.");
      }
      if (Object.keys(payload.townStabilityDelta).length === 0) {
        throw new Error("Town stability JSON is invalid.");
      }

      const response = await fetch("/api/roblox/telemetry/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-frontier-ingest-secret": sharedSecret.trim(),
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as IngestResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Ingest failed");
      }
      toast.success(
        data.mode === "local-dev-fallback"
          ? "Ingest accepted (local fallback mode)."
          : "Ingest accepted and written to Snowflake.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="fd-card">
        <h1 className="text-3xl font-bold">Roblox Ingest Lab</h1>
        <p className="mt-2 text-[var(--muted)]">
          Test the Roblox Open Cloud telemetry endpoint directly from UI. This page helps prove
          signed ingest requests without leaving your demo flow.
        </p>
      </section>

      <section className="fd-card space-y-3">
        <h2 className="text-xl font-semibold">Ingest Request Builder</h2>
        <label className="block space-y-1 text-sm">
          <span>Shared secret (matches ROBLOX_INGEST_SHARED_SECRET)</span>
          <input
            className="fd-input"
            type="password"
            value={sharedSecret}
            onChange={(event) => setSharedSecret(event.target.value)}
            placeholder="Enter secret only for local test"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Run ID</span>
          <input className="fd-input" value={runId} onChange={(event) => setRunId(event.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Contract</span>
          <input
            className="fd-input"
            value={contract}
            onChange={(event) => setContract(event.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Towns (comma-separated)</span>
          <input
            className="fd-input"
            value={townsText}
            onChange={(event) => setTownsText(event.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Route choice</span>
          <select
            className="fd-input"
            value={routeChoice}
            onChange={(event) =>
              setRouteChoice(event.target.value as "short-risky" | "balanced" | "long-safe")
            }
          >
            <option value="short-risky">short-risky</option>
            <option value="balanced">balanced</option>
            <option value="long-safe">long-safe</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>Events (comma-separated)</span>
          <input
            className="fd-input"
            value={eventsText}
            onChange={(event) => setEventsText(event.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Payout</span>
          <input
            className="fd-input"
            type="number"
            value={payout}
            onChange={(event) => setPayout(Number(event.target.value))}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Risk score (0-100)</span>
          <input
            className="fd-input"
            type="number"
            value={riskScore}
            onChange={(event) => setRiskScore(Number(event.target.value))}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onTime} onChange={(event) => setOnTime(event.target.checked)} />
          On-time completion
        </label>
        <label className="block space-y-1 text-sm">
          <span>Town stability delta JSON</span>
          <textarea
            className="fd-input min-h-20"
            value={stabilityText}
            onChange={(event) => setStabilityText(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button onClick={sendIngest} disabled={loading} className="fd-button">
            {loading ? "Sending..." : "Send Ingest Request"}
          </button>
          <Link href="/dashboard" className="fd-button-secondary">
            Open Dashboard
          </Link>
          <Link href="/proof" className="fd-button-secondary">
            Open Proof Hub
          </Link>
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Payload Preview</h2>
        <pre className="mt-2 overflow-x-auto rounded-md border border-black/10 bg-white p-3 text-xs text-[var(--muted)]">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </section>
    </div>
  );
}
