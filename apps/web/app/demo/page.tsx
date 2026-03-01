import Link from "next/link";

const steps = [
  {
    title: "1. Open Dispatch Center (Gemini)",
    href: "/dispatch",
    shouldSee:
      "AI-generated plan with recommended contracts, routes, risk rationale, contingency, and summary.",
  },
  {
    title: "2. Generate Voice Briefing (ElevenLabs)",
    href: "/telegraph",
    shouldSee:
      "Audio briefing generated from dispatch plan text with urgency style.",
  },
  {
    title: "3. Log a Run (Snowflake)",
    href: "/log-run",
    shouldSee:
      "Successful telemetry insert confirmation and link to dashboard.",
  },
  {
    title: "4. View Dashboard (Snowflake)",
    href: "/dashboard",
    shouldSee:
      "Updated run count, on-time rate, most common event, and runs-over-time table.",
  },
  {
    title: "5. Mint Proof-of-Delivery (Solana)",
    href: "/ledger",
    shouldSee:
      "Devnet transaction signature and explorer link using memo proof.",
  },
];

export default function DemoPage() {
  return (
    <div className="space-y-5">
      <section className="fd-card">
        <h1 className="text-3xl font-bold">Demo Hub</h1>
        <p className="mt-2 text-[var(--muted)]">
          Follow these steps in order. This is the judge path for all sponsor
          categories.
        </p>
      </section>

      <section className="space-y-3">
        {steps.map((step) => (
          <div key={step.title} className="fd-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-sm text-[var(--muted)]">
                What judges should see: {step.shouldSee}
              </p>
            </div>
            <Link href={step.href} className="fd-button w-fit">
              Open
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
