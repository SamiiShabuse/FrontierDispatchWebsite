import { TownStatus } from "@/lib/types";

export const DEFAULT_TOWN_STATUSES: TownStatus[] = [
  {
    name: "Tombstone",
    biome: "desert",
    needs: ["Water", "Food"],
    stability: 62,
  },
  {
    name: "Deadwood",
    biome: "mountain",
    needs: ["Food", "Medicine", "Tools"],
    stability: 55,
  },
  {
    name: "Dodge City",
    biome: "main",
    needs: ["Gold"],
    stability: 71,
  },
];

export const EVENT_TYPES = ["Dust storm", "Broken bridge", "Bandits"] as const;
export const RESOURCE_TYPES = [
  "Food",
  "Medicine",
  "Tools",
  "Gold",
  "Water",
] as const;
