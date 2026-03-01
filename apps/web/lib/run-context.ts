import { RunContext } from "@/lib/types";

const RUN_CONTEXT_KEY = "frontier_run_context_v1";

export function readRunContext(): RunContext | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(RUN_CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RunContext;
  } catch {
    return null;
  }
}

export function writeRunContext(context: RunContext): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RUN_CONTEXT_KEY, JSON.stringify(context));
}

export function updateRunContext(partial: Partial<RunContext>): RunContext | null {
  const existing = readRunContext();
  if (!existing) return null;
  const merged: RunContext = {
    ...existing,
    ...partial,
    voice: partial.voice ?? existing.voice,
    ledger: partial.ledger ?? existing.ledger,
    updatedAt: new Date().toISOString(),
  };
  writeRunContext(merged);
  return merged;
}
