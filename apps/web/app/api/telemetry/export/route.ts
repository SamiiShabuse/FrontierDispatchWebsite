import { NextRequest, NextResponse } from "next/server";
import { getRecentRuns } from "@/lib/telemetry-store";

function csvEscape(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const asString = String(value).replace(/"/g, '""');
  return `"${asString}"`;
}

export async function GET(request: NextRequest) {
  try {
    const rawLimit = request.nextUrl.searchParams.get("limit");
    const parsedLimit = Number(rawLimit ?? 200);
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 500)) : 200;
    const result = await getRecentRuns(limit);
    const rows = result.runs ?? [];

    const header = [
      "id",
      "created_at",
      "run_id",
      "route_choice",
      "on_time",
      "payout",
      "source",
      "solana_signature",
      "voice_id",
      "risk_score",
      "contracts",
      "towns",
      "events",
      "town_stability_delta",
      "plan_preview",
    ].join(",");

    const body = rows
      .map((run) =>
        [
          csvEscape(run.id),
          csvEscape(run.created_at),
          csvEscape(run.run_id),
          csvEscape(run.route_choice),
          csvEscape(run.on_time),
          csvEscape(run.payout),
          csvEscape(run.source ?? "manual"),
          csvEscape(run.solana_signature),
          csvEscape(run.voice_id),
          csvEscape(run.risk_score),
          csvEscape(run.contracts.join(" | ")),
          csvEscape(run.towns.join(" | ")),
          csvEscape(run.events.join(" | ")),
          csvEscape(JSON.stringify(run.town_stability_delta)),
          csvEscape(run.plan_preview),
        ].join(","),
      )
      .join("\n");

    const csv = `${header}\n${body}`;
    const timestamp = new Date().toISOString().replaceAll(":", "-");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"frontier-telemetry-${timestamp}.csv\"`,
        "X-Frontier-Mode": result.mode,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
