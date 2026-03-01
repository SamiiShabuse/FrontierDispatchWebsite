import { NextRequest, NextResponse } from "next/server";
import { robloxIngestSchema } from "@/lib/validators";
import { insertRun } from "@/lib/telemetry-store";
import { verifyRobloxIngestAuth } from "@/lib/roblox-opencloud";

export async function POST(request: NextRequest) {
  try {
    if (!verifyRobloxIngestAuth(request)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized ingest request" },
        { status: 401 },
      );
    }

    const json = await request.json();
    const parsed = robloxIngestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid Roblox telemetry payload" },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const result = await insertRun({
      id: crypto.randomUUID(),
      run_id: input.runId,
      created_at: input.timestamp,
      contracts: [input.contract],
      towns: input.towns,
      route_choice: input.routeChoice,
      events: input.events.length ? input.events : ["None"],
      on_time: input.onTime,
      payout: input.payout,
      town_stability_delta: input.townStabilityDelta,
      source: "roblox-opencloud",
      risk_score: input.riskScore,
    });

    return NextResponse.json({
      ok: true,
      mode: result.mode,
      configured: result.configured,
      warning: result.reason,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
