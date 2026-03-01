type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

declare global {
  var __fdRateLimitMap: Map<string, RateLimitEntry> | undefined;
}

const memoryMap = global.__fdRateLimitMap ?? new Map<string, RateLimitEntry>();
global.__fdRateLimitMap = memoryMap;

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const current = memoryMap.get(ip);

  if (!current || current.resetAt < now) {
    memoryMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (current.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  memoryMap.set(ip, current);
  return { ok: true };
}
