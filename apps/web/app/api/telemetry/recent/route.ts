import { NextRequest, NextResponse } from "next/server";
import { getRecentRuns } from "@/lib/telemetry-store";

export async function GET(request: NextRequest) {
  try {
    const rawLimit = request.nextUrl.searchParams.get("limit");
    const parsedLimit = Number(rawLimit ?? 8);
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 50)) : 8;

    const result = await getRecentRuns(limit);
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      configured: result.configured,
      runs: result.runs ?? [],
      warning: result.reason,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
