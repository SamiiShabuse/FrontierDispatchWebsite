"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

type ContractPreset = {
  id: string;
  title: string;
  towns: string[];
  resources: string[];
  payout: number;
};

export default function LogRunPage() {
  const [contracts, setContracts] = useState<ContractPreset[]>([]);
  const [contractText, setContractText] = useState("Emergency Water & Food");
  const [townsText, setTownsText] = useState("Tombstone,Dodge City");
  const [routeChoice, setRouteChoice] = useState("balanced");
  const [eventsText, setEventsText] = useState("Dust storm");
  const [onTime, setOnTime] = useState(true);
  const [payout, setPayout] = useState(300);
  const [stabilityText, setStabilityText] = useState(
    '{"Tombstone": 2, "Deadwood": -1, "Dodge City": 1}',
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/contracts.json")
      .then((response) => response.json())
      .then((data) => setContracts(data))
      .catch(() => {
        // Keep manual mode.
      });
  }, []);

  async function submitRun() {
    setLoading(true);
    try {
      const stability = JSON.parse(stabilityText) as Record<string, number>;

      const response = await fetch("/api/telemetry/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contracts: contractText
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          towns: townsText
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          route_choice: routeChoice,
          events: eventsText
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          on_time: onTime,
          payout,
          town_stability_delta: stability,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; mode?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to submit run");
      }
      toast.success(
        data.mode === "local-dev-fallback"
          ? "Run logged in local fallback mode (Snowflake not configured)."
          : "Run logged to Snowflake.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(contract: ContractPreset) {
    setContractText(contract.title);
    setTownsText(contract.towns.join(","));
    setPayout(contract.payout);
  }

  return (
    <div className="space-y-5">
      {/* Snowflake track callout for judges */}
      <TrackCallout
        track="Best Use of Snowflake API"
        details="Run telemetry is validated and inserted via /api/telemetry/insert into Snowflake for live operational analytics."
      />
      <JudgeProof
        apiRoute="/api/telemetry/insert"
        codePath="/apps/web/app/log-run + /apps/web/app/api/telemetry/insert/route.ts"
        clickSteps="Fill form, click Submit Run, then open /dashboard to verify updated analytics."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Run Logger</h1>

        <div>
          <p className="text-sm text-[var(--muted)]">Use generated preset:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {contracts.map((contract) => (
              <button
                key={contract.id}
                className="fd-button-secondary"
                onClick={() => applyPreset(contract)}
              >
                {contract.id}
              </button>
            ))}
          </div>
        </div>

        <label className="block space-y-1 text-sm">
          <span>Contract types (comma-separated)</span>
          <input
            className="fd-input"
            value={contractText}
            onChange={(event) => setContractText(event.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Towns served (comma-separated)</span>
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
            onChange={(event) => setRouteChoice(event.target.value)}
          >
            <option value="short-risky">short-risky</option>
            <option value="balanced">balanced</option>
            <option value="long-safe">long-safe</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>Events faced (comma-separated)</span>
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
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onTime}
            onChange={(event) => setOnTime(event.target.checked)}
          />
          On time
        </label>
        <label className="block space-y-1 text-sm">
          <span>Town stability delta JSON</span>
          <textarea
            className="fd-input min-h-20"
            value={stabilityText}
            onChange={(event) => setStabilityText(event.target.value)}
          />
        </label>
        <button onClick={submitRun} disabled={loading} className="fd-button">
          {loading ? "Submitting..." : "Submit Run"}
        </button>
        <Link href="/dashboard" className="fd-button-secondary w-fit">
          View Dashboard
        </Link>
      </section>
    </div>
  );
}
