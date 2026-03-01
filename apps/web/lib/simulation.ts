import { EventName } from "@/lib/types";

export type SimulationInput = {
  routeChoice: "short-risky" | "balanced" | "long-safe";
  basePayout: number;
  iterations: number;
  selectedEvents: EventName[];
};

export type SimulationResult = {
  runs: number;
  successRate: number;
  averagePayout: number;
  averageStabilityDelta: number;
  eventFrequency: Record<string, number>;
};

const routeRiskMultiplier: Record<SimulationInput["routeChoice"], number> = {
  "short-risky": 1.3,
  balanced: 1,
  "long-safe": 0.72,
};

const eventBaseProbabilities: Record<EventName, number> = {
  "Dust storm": 0.24,
  "Broken bridge": 0.18,
  Bandits: 0.2,
};

const eventImpact: Record<EventName, { payoutDelta: number; stabilityDelta: number }> = {
  "Dust storm": { payoutDelta: -45, stabilityDelta: -1 },
  "Broken bridge": { payoutDelta: -85, stabilityDelta: -2 },
  Bandits: { payoutDelta: -120, stabilityDelta: -3 },
};

export function runRouteSimulation(input: SimulationInput): SimulationResult {
  const eventCounter: Record<string, number> = {};
  let successCount = 0;
  let payoutTotal = 0;
  let stabilityTotal = 0;
  const multiplier = routeRiskMultiplier[input.routeChoice];

  for (let i = 0; i < input.iterations; i += 1) {
    let runPayout = input.basePayout;
    let runStability = 1;
    let failed = false;

    for (const eventName of input.selectedEvents) {
      const probability = eventBaseProbabilities[eventName] * multiplier;
      if (Math.random() < probability) {
        eventCounter[eventName] = (eventCounter[eventName] ?? 0) + 1;
        runPayout += eventImpact[eventName].payoutDelta;
        runStability += eventImpact[eventName].stabilityDelta;
        if (eventName === "Bandits" && input.routeChoice === "short-risky") {
          failed = true;
        }
      }
    }

    const clampedPayout = Math.max(0, runPayout);
    payoutTotal += clampedPayout;
    stabilityTotal += runStability;
    if (!failed && clampedPayout > input.basePayout * 0.35) {
      successCount += 1;
    }
  }

  return {
    runs: input.iterations,
    successRate: Number(((successCount / input.iterations) * 100).toFixed(2)),
    averagePayout: Number((payoutTotal / input.iterations).toFixed(2)),
    averageStabilityDelta: Number((stabilityTotal / input.iterations).toFixed(2)),
    eventFrequency: eventCounter,
  };
}
