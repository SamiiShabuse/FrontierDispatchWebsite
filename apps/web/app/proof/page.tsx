import Link from "next/link";

const proofItems = [
  {
    track: "Gemini API",
    route: "/api/gemini/plan",
    page: "/dispatch",
    check: "Generate dispatch plan and verify structured response text.",
  },
  {
    track: "ElevenLabs",
    route: "/api/elevenlabs/tts",
    page: "/telegraph",
    check: "Generate voice briefing and play returned audio clip.",
  },
  {
    track: "Solana",
    route: "Client-side wallet + memo transaction",
    page: "/ledger",
    check: "Mint devnet proof and open explorer transaction URL.",
  },
  {
    track: "Snowflake",
    route: "/api/telemetry/insert + /api/telemetry/summary",
    page: "/dashboard",
    check: "Confirm non-zero metrics and source/proof rates.",
  },
  {
    track: "Smalltalk",
    route: "Generated JSON from /smalltalk",
    page: "/dispatch",
    check: "Verify contracts/risks preload from generated data files.",
  },
];

export default function ProofPage() {
  return (
    <div className="space-y-5">
      <section className="fd-card">
        <h1 className="text-3xl font-bold">Judge Proof Hub</h1>
        <p className="mt-2 text-[var(--muted)]">
          Use this page to verify each sponsor category with concrete routes, pages, and expected output.
        </p>
      </section>

      <section className="space-y-3">
        {proofItems.map((item) => (
          <article key={item.track} className="fd-card">
            <h2 className="text-lg font-semibold">{item.track}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              API/Integration: <code>{item.route}</code>
            </p>
            <p className="text-sm text-[var(--muted)]">Verification: {item.check}</p>
            <Link href={item.page} className="mt-3 inline-flex fd-button-secondary">
              Open {item.page}
            </Link>
          </article>
        ))}
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Submission Docs</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className="fd-button-secondary" href="/demo">
            Open Demo Flow
          </a>
          <a className="fd-button-secondary" href="https://frontierdispatch.tech">
            Live Domain
          </a>
        </div>
      </section>
    </div>
  );
}
