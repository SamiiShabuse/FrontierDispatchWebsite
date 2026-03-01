export type TownName = "Tombstone" | "Deadwood" | "Dodge City";
export type EventName = "Dust storm" | "Broken bridge" | "Bandits";
export type ResourceName = "Food" | "Medicine" | "Tools" | "Gold" | "Water";

export type TownStatus = {
  name: TownName;
  biome: "desert" | "mountain" | "main";
  needs: ResourceName[];
  stability: number;
};

export type DispatchGameState = {
  selectedContract: string;
  manualContract?: string;
  routeChoice: "short-risky" | "balanced" | "long-safe";
  townStatuses: TownStatus[];
  availableResources: ResourceName[];
  knownEvents: EventName[];
  playerNotes?: string;
};

export type RunTelemetryInput = {
  id?: string;
  created_at?: string;
  contracts: string[];
  towns: string[];
  route_choice: string;
  events: string[];
  on_time: boolean;
  payout: number;
  town_stability_delta: Record<string, number>;
};

export type TelemetrySummary = {
  totalRuns: number;
  onTimeRate: number;
  mostCommonEvent: string;
  townStabilityAverages: Record<string, number>;
  runsOverTime: Array<{ day: string; count: number }>;
};
