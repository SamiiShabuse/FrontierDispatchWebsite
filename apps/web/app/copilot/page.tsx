"use client";

import { useState } from "react";
import { toast } from "sonner";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

type LuauResponse = {
  ok: boolean;
  luauText?: string;
  model?: string;
  error?: string;
};

export default function CopilotPage() {
  const [missionName, setMissionName] = useState("Resupply Tombstone Outpost");
  const [townsInvolved, setTownsInvolved] = useState("Tombstone,Deadwood");
  const [objective, setObjective] = useState(
    "Deliver medicine crate and return with ore shipment before sunset.",
  );
  const [routeChoice, setRouteChoice] = useState<"short-risky" | "balanced" | "long-safe">(
    "balanced",
  );
  const [includeServerModule, setIncludeServerModule] = useState(true);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateLuau() {
    setLoading(true);
    try {
      const response = await fetch("/api/gemini/luau", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionName,
          townsInvolved: townsInvolved
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          objective,
          routeChoice,
          includeServerModule,
        }),
      });
      const data = (await response.json()) as LuauResponse;
      if (!response.ok || !data.ok || !data.luauText) {
        throw new Error(data.error ?? "Failed to generate Luau scripts");
      }
      setOutput(data.luauText);
      toast.success("Luau mission scripts generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Luau code copied.");
  }

  return (
    <div className="space-y-5">
      <TrackCallout
        track="Roblox dev productivity"
        details="Use Gemini to transform mission design notes into practical Luau scaffolding for Roblox server/client mission flows."
      />
      <JudgeProof
        apiRoute="/api/gemini/luau"
        codePath="/apps/web/app/copilot + /apps/web/app/api/gemini/luau/route.ts"
        clickSteps="Set mission parameters, click Generate Luau, then copy and paste output into Roblox Studio scripts."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Luau Mission Copilot</h1>
        <label className="block space-y-1 text-sm">
          <span>Mission name</span>
          <input className="fd-input" value={missionName} onChange={(e) => setMissionName(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Towns involved (comma-separated)</span>
          <input
            className="fd-input"
            value={townsInvolved}
            onChange={(e) => setTownsInvolved(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Objective</span>
          <textarea
            className="fd-input min-h-24"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Route profile</span>
            <select
              className="fd-input"
              value={routeChoice}
              onChange={(e) =>
                setRouteChoice(e.target.value as "short-risky" | "balanced" | "long-safe")
              }
            >
              <option value="short-risky">short-risky</option>
              <option value="balanced">balanced</option>
              <option value="long-safe">long-safe</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-sm pt-7">
            <input
              type="checkbox"
              checked={includeServerModule}
              onChange={(e) => setIncludeServerModule(e.target.checked)}
            />
            Include server module scaffold
          </label>
        </div>

        <button className="fd-button" disabled={loading} onClick={generateLuau}>
          {loading ? "Generating..." : "Generate Luau"}
        </button>
      </section>

      <section className="fd-card">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Generated Script Output</h2>
          <button className="fd-button-secondary" onClick={copyOutput} disabled={!output}>
            Copy
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-[var(--card-2)] p-3 text-sm whitespace-pre-wrap">
          {output || "Generated Luau snippets will appear here."}
        </pre>
      </section>
    </div>
  );
}
