import { z } from "zod";

const townSchema = z.object({
  name: z.string().min(2).max(40),
  biome: z.string().min(2).max(20),
  needs: z.array(z.string().min(2).max(20)).min(1).max(6),
  stability: z.number().min(0).max(100),
});

export const dispatchRequestSchema = z.object({
  selectedContract: z.string().max(160),
  manualContract: z.string().max(600).optional(),
  routeChoice: z.enum(["short-risky", "balanced", "long-safe"]),
  townStatuses: z.array(townSchema).min(3).max(10),
  availableResources: z.array(z.string().max(30)).min(1).max(10),
  knownEvents: z.array(z.string().max(30)).min(1).max(10),
  playerNotes: z.string().max(400).optional(),
});

export const ttsRequestSchema = z.object({
  text: z.string().min(10).max(1800),
  voiceId: z.string().min(2).max(80),
  urgency: z.enum(["normal", "urgent"]),
});

export const telemetryInsertSchema = z.object({
  id: z.string().max(80).optional(),
  created_at: z.string().datetime().optional(),
  contracts: z.array(z.string().max(120)).min(1).max(10),
  towns: z.array(z.string().max(40)).min(1).max(10),
  route_choice: z.string().max(40),
  events: z.array(z.string().max(40)).min(1).max(10),
  on_time: z.boolean(),
  payout: z.number().min(0).max(1_000_000),
  town_stability_delta: z.record(z.string(), z.number().min(-100).max(100)),
});

export function trimDangerousPrompt(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/ignore previous instructions/gi, "")
    .replace(/system prompt/gi, "")
    .slice(0, 2000);
}
