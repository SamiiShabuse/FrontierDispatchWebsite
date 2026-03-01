import { NextRequest } from "next/server";

export function verifyRobloxIngestAuth(request: NextRequest): boolean {
  const expectedSecret = process.env.ROBLOX_INGEST_SHARED_SECRET;
  if (!expectedSecret) return false;

  const providedSecret =
    request.headers.get("x-frontier-ingest-secret") ??
    request.headers.get("x-roblox-ingest-secret");

  return providedSecret === expectedSecret;
}

export function robloxIntegrationConfigured() {
  return Boolean(process.env.ROBLOX_INGEST_SHARED_SECRET);
}
