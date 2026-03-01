"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_TOWN_STATUSES, EVENT_TYPES, RESOURCE_TYPES } from "@/lib/constants";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";
import { writeRunContext } from "@/lib/run-context";

type ContractPreset = {
  id: string;
  title: string;
  towns: string[];
  resources: string[];
  payout: number;
};

type PlanResponse = {
  ok: boolean;
  planText?: string;
  structuredPlan?: Record<string, unknown>;
  error?: string;
};

export default function DispatchPage() {
  const [contracts, setContracts] = useState<ContractPreset[]>([]);
  const [selectedContract, setSelectedContract] = useState("manual");
  const [manualContract, setManualContract] = useState(
    "Deliver Water + Food to Tombstone before noon.",
  );
  const [routeChoice, setRouteChoice] = useState<"short-risky" | "balanced" | "long-safe">(
    "balanced",
  );
  const [playerNotes, setPlayerNotes] = useState("");
  const [planText, setPlanText] = useState("");
  const [loading, setLoading] = useState(false);
  const [townStatuses, setTownStatuses] = useState(DEFAULT_TOWN_STATUSES);
  const [risksConfigured, setRisksConfigured] = useState(false);

  useEffect(() => {
    const loadPresets = async () => {
      try {
        const [contractsRes, risksRes] = await Promise.all([
          fetch("/data/contracts.json"),
          fetch("/data/risks.json"),
        ]);
        if (contractsRes.ok) {
          const contractData = (await contractsRes.json()) as ContractPreset[];
          setContracts(contractData);
        }
        if (risksRes.ok) {
          const riskData = (await risksRes.json()) as {
            towns: Array<{ name: string; biome: string; needs: string[]; stability: number }>;
          };
          if (riskData.towns?.length) {
            setTownStatuses(
              riskData.towns.map((town) => ({
                name: town.name as "Tombstone" | "Deadwood" | "Dodge City",
                biome: town.biome as "desert" | "mountain" | "main",
                needs: town.needs as ("Food" | "Medicine" | "Tools" | "Gold" | "Water")[],
                stability: town.stability,
              })),
            );
            setRisksConfigured(true);
          }
        }
      } catch {
        // Keep default presets if file loading fails.
      }
    };
    loadPresets();
  }, []);

  const selectedPreset = useMemo(
    () => contracts.find((contract) => contract.id === selectedContract),
    [contracts, selectedContract],
  );

  async function generatePlan() {
    setLoading(true);
    setPlanText("");
    try {
      const response = await fetch("/api/gemini/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedContract:
            selectedContract === "manual"
              ? manualContract
              : selectedPreset?.title ?? manualContract,
          manualContract,
          routeChoice,
          townStatuses,
          availableResources: RESOURCE_TYPES,
          knownEvents: EVENT_TYPES,
          playerNotes,
        }),
      });

      const data = (await response.json()) as PlanResponse;
      if (!response.ok || !data.ok || !data.planText) {
        throw new Error(data.error ?? "Failed to generate dispatch plan.");
      }

      setPlanText(data.planText);
      localStorage.setItem("frontier_latest_plan", data.planText);
      const contextTowns = townStatuses.map((town) => town.name);
      writeRunContext({
        runId: `run-${Date.now()}`,
        selectedContract:
          selectedContract === "manual"
            ? manualContract
            : selectedPreset?.title ?? manualContract,
        routeChoice,
        towns: contextTowns,
        events: [...EVENT_TYPES],
        playerNotes,
        planText: data.planText,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Dispatch plan generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function copyPlan() {
    if (!planText) return;
    await navigator.clipboard.writeText(planText);
    toast.success("Plan copied for Roblox briefing.");
  }

  return (
    <div className="space-y-5">
      {/* Gemini track callout for judges */}
      <TrackCallout
        track="Best Use of Gemini API"
        details="This page sends structured game state JSON to /api/gemini/plan and receives a decision-ready dispatch brief rooted in frontier logistics."
      />
      <JudgeProof
        apiRoute="/api/gemini/plan"
        codePath="/apps/web/app/dispatch + /apps/web/app/api/gemini/plan/route.ts"
        clickSteps="Choose a contract + route, click Generate Optimal Dispatch Plan, then copy output."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Dispatch Center</h1>
        <p className="text-sm text-[var(--muted)]">
          Morning Dispatch: choose contracts, weigh route strategy, account for
          Dust storm / Broken bridge / Bandits, and produce an actionable plan.
        </p>

        <label className="block space-y-1 text-sm">
          <span>Contract chooser</span>
          <select
            className="fd-input"
            value={selectedContract}
            onChange={(event) => setSelectedContract(event.target.value)}
          >
            <option value="manual">Manual contract entry</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span>Manual contract text</span>
          <textarea
            className="fd-input min-h-24"
            value={manualContract}
            onChange={(event) => setManualContract(event.target.value)}
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span>Route options</span>
          <select
            className="fd-input"
            value={routeChoice}
            onChange={(event) =>
              setRouteChoice(
                event.target.value as "short-risky" | "balanced" | "long-safe",
              )
            }
          >
            <option value="short-risky">Short + risky</option>
            <option value="balanced">Balanced</option>
            <option value="long-safe">Long + safe</option>
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span>Optional operator notes</span>
          <input
            className="fd-input"
            value={playerNotes}
            onChange={(event) => setPlayerNotes(event.target.value)}
            placeholder="e.g. two wagons available, medicine priority"
          />
        </label>

        <div className="fd-card bg-[var(--card-2)]">
          <h2 className="font-semibold">Town Statuses</h2>
          <p className="text-xs text-[var(--muted)]">
            {risksConfigured ? "Loaded from Smalltalk risk model." : "Using defaults."}
          </p>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {townStatuses.map((town) => (
              <div key={town.name} className="rounded-md border border-black/10 p-2 text-sm">
                <p className="font-medium">{town.name}</p>
                <p className="text-[var(--muted)]">Needs: {town.needs.join(", ")}</p>
                <p className="text-[var(--muted)]">Stability: {town.stability}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={generatePlan} disabled={loading} className="fd-button">
          {loading ? "Generating..." : "Generate Optimal Dispatch Plan"}
        </button>
      </section>

      <section className="fd-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Gemini Plan Output</h2>
          <button onClick={copyPlan} disabled={!planText} className="fd-button-secondary">
            Copy plan
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-[var(--card-2)] p-3 text-sm whitespace-pre-wrap">
          {planText ||
            "Output will include recommended contracts, route rationale, contingencies, and summary."}
        </pre>
        <div className="mt-4">
          <Link href="/telegraph" className="fd-button-secondary">
            Continue to Telegraph Voice
          </Link>
        </div>
      </section>
    </div>
  );
}
