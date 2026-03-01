import { NextRequest, NextResponse } from "next/server";
import { telemetryInsertSchema } from "@/lib/validators";
import { insertRun } from "@/lib/telemetry-store";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = telemetryInsertSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid telemetry payload" },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const result = await insertRun({
      id: input.id ?? crypto.randomUUID(),
      created_at: input.created_at ?? new Date().toISOString(),
      run_id: input.run_id,
      contracts: input.contracts,
      towns: input.towns,
      route_choice: input.route_choice,
      events: input.events,
      on_time: input.on_time,
      payout: input.payout,
      town_stability_delta: input.town_stability_delta,
      source: input.source ?? "manual",
      solana_signature: input.solana_signature,
      voice_id: input.voice_id,
      plan_preview: input.plan_preview,
      risk_score: input.risk_score,
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
