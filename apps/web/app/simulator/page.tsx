"use client";

import { useMemo, useState } from "react";
import { EVENT_TYPES } from "@/lib/constants";
import { EventName } from "@/lib/types";
import { runRouteSimulation } from "@/lib/simulation";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

export default function SimulatorPage() {
  const [routeChoice, setRouteChoice] = useState<"short-risky" | "balanced" | "long-safe">(
    "balanced",
  );
  const [basePayout, setBasePayout] = useState(320);
  const [iterations, setIterations] = useState(200);
  const [selectedEvents, setSelectedEvents] = useState<EventName[]>([...EVENT_TYPES]);

  const result = useMemo(
    () =>
      runRouteSimulation({
        routeChoice,
        basePayout,
        iterations,
        selectedEvents,
      }),
    [routeChoice, basePayout, iterations, selectedEvents],
  );

  function toggleEvent(eventName: EventName) {
    setSelectedEvents((prev) =>
      prev.includes(eventName) ? prev.filter((item) => item !== eventName) : [...prev, eventName],
    );
  }

  return (
    <div className="space-y-5">
      <TrackCallout
        track="Gameplay balancing utility"
        details="This sandbox runs Monte Carlo route simulations to tune payout and risk values before changing Roblox mission scripts."
      />
      <JudgeProof
        apiRoute="Client-side simulation engine"
        codePath="/apps/web/app/simulator + /apps/web/lib/simulation.ts"
        clickSteps="Pick route + events, increase iterations, and inspect success rate/payout output for balancing decisions."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Route Risk Simulator</h1>
        <p className="text-sm text-[var(--muted)]">
          Use this to calibrate contract rewards and expected mission outcomes.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span>Route profile</span>
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
          <label className="space-y-1 text-sm">
            <span>Base payout</span>
            <input
              type="number"
              className="fd-input"
              value={basePayout}
              onChange={(event) => setBasePayout(Number(event.target.value))}
              min={50}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Iterations</span>
            <input
              type="number"
              className="fd-input"
              value={iterations}
              onChange={(event) => setIterations(Math.max(25, Number(event.target.value)))}
              min={25}
            />
          </label>
        </div>

        <div>
          <p className="text-sm font-medium">Event pool</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EVENT_TYPES.map((eventName) => {
              const active = selectedEvents.includes(eventName);
              return (
                <button
                  key={eventName}
                  type="button"
                  onClick={() => toggleEvent(eventName)}
                  className={active ? "fd-button-secondary" : "fd-badge"}
                >
                  {eventName}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Simulation Output</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-black/10 p-3">
            <p className="text-xs text-[var(--muted)]">Success Rate</p>
            <p className="text-2xl font-bold">{result.successRate}%</p>
          </div>
          <div className="rounded-md border border-black/10 p-3">
            <p className="text-xs text-[var(--muted)]">Average Payout</p>
            <p className="text-2xl font-bold">${result.averagePayout}</p>
          </div>
          <div className="rounded-md border border-black/10 p-3">
            <p className="text-xs text-[var(--muted)]">Average Stability Delta</p>
            <p className="text-2xl font-bold">{result.averageStabilityDelta}</p>
          </div>
          <div className="rounded-md border border-black/10 p-3">
            <p className="text-xs text-[var(--muted)]">Runs Simulated</p>
            <p className="text-2xl font-bold">{result.runs}</p>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-black/10 bg-[var(--card-2)] p-3">
          <p className="font-medium">Event Frequency (trigger count)</p>
          <ul className="mt-2 text-sm text-[var(--muted)]">
            {Object.entries(result.eventFrequency).length ? (
              Object.entries(result.eventFrequency).map(([eventName, count]) => (
                <li key={eventName}>
                  {eventName}: {count}
                </li>
              ))
            ) : (
              <li>No events triggered in this sample.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
