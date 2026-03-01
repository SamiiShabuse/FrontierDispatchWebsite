import { NextResponse } from "next/server";
import { getTelemetrySummary } from "@/lib/telemetry-store";

export async function GET() {
  try {
    const result = await getTelemetrySummary();
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      configured: result.configured,
      summary: result.summary,
      warning: result.reason,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
