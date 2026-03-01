import Link from "next/link";
import { SponsorBadges } from "@/components/sponsor-badges";

export default function Home() {
  const robloxUrl = process.env.ROBLOX_GAME_URL || "#";
  return (
    <div className="space-y-8">
      <section className="fd-card space-y-4 p-6 md:p-8">
        <p className="fd-badge w-fit">Official FrontierDispatch.tech hub</p>
        <h1 className="text-3xl font-bold md:text-5xl">
          Build the frontier. Modernize dispatch. Keep every town alive.
        </h1>
        <p className="max-w-3xl text-[var(--muted)]">
          FrontierDispatch is an infrastructure and logistics strategy experience
          on Roblox. Start each morning in dispatch, select contracts, plan
          risky or safe routes, survive dynamic events, and evolve your network
          with modernization upgrades.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={robloxUrl}
            target="_blank"
            rel="noreferrer"
            className="fd-button"
          >
            Play on Roblox
          </a>
          <Link href="/demo" className="fd-button-secondary">
            Open 2-minute Demo Hub
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="fd-card">
          <h2 className="text-xl font-semibold">Development Workflow</h2>
          <div className="mt-3 h-48 rounded-lg border border-dashed border-black/20 bg-[var(--card-2)] p-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">Build loop used by the team</p>
            <ol className="mt-2 list-decimal pl-4">
              <li>Generate mission strategy in Dispatch AI.</li>
              <li>Create voice briefing in Telegraph.</li>
              <li>Mint proof + auto-log telemetry in Ledger.</li>
              <li>Review balancing metrics in Dashboard + Simulator.</li>
              <li>Generate Luau scaffolds in Copilot for Studio iteration.</li>
            </ol>
          </div>
        </div>
        <div className="fd-card">
          <h2 className="text-xl font-semibold">Game Systems this powers</h2>
          <div className="mt-3 h-48 rounded-lg border border-dashed border-black/20 bg-[var(--card-2)] p-3 text-sm text-[var(--muted)]">
            <ul className="list-disc pl-4">
              <li>Dynamic contract risk tuning with Monte Carlo simulations.</li>
              <li>Town stability telemetry from live or fallback ingest.</li>
              <li>On-chain proof-of-delivery for key mission outcomes.</li>
              <li>Luau mission boilerplate generation for faster content drops.</li>
              <li>Judge-proof evidence trail for every sponsor category.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">How to demo quickly</h2>
        <p className="mt-2 text-[var(--muted)]">
          Judges can complete the full sponsor proof flow in under two minutes
          from one page.
        </p>
        <Link href="/demo" className="mt-4 inline-flex fd-button-secondary">
          Go to /demo checklist
        </Link>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Sponsor Integrations</h2>
        <p className="mt-2 text-[var(--muted)]">
          Each integration is real, verifiable in repo paths, and demo-ready.
        </p>
        <div className="mt-3">
          <SponsorBadges />
        </div>
      </section>
    </div>
  );
}
