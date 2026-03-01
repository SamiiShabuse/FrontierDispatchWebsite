"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    title: "3. Mint Proof-of-Delivery (Solana)",
    href: "/ledger",
    shouldSee:
      "Devnet transaction signature and explorer link. Telemetry auto-logs after mint.",
  },
  {
    title: "4. View Dashboard (Snowflake)",
    href: "/dashboard",
    shouldSee:
      "Updated run count, on-time rate, most common event, and runs-over-time table.",
  },
  {
    title: "5. Open Mission Control",
    href: "/mission-control",
    shouldSee:
      "Current run context status plus recent telemetry table proving continuity across the mission pipeline.",
  },
  {
    title: "6. Open Judge Proof Hub",
    href: "/proof",
    shouldSee:
      "Sponsor-by-sponsor verification list with page routes and expected evidence.",
  },
];

type HealthResponse = {
  status: string;
  integrations: Record<string, boolean>;
};

export default function DemoPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => setHealth(data))
      .catch(() => {
        // Keep demo page usable if health endpoint fails.
      });
  }, []);

  return (
    <div className="space-y-5">
      <section className="fd-card">
        <h1 className="text-3xl font-bold">Demo Hub</h1>
        <p className="mt-2 text-[var(--muted)]">
          Follow these steps in order. This is the judge path for all sponsor
          categories.
        </p>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Live Integration Health</h2>
        {!health ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Loading health status...</p>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {Object.entries(health.integrations).map(([name, configured]) => (
              <div key={name} className="rounded-md border border-black/10 p-2 text-sm">
                <p className="font-medium">{name}</p>
                <p className={configured ? "text-emerald-700" : "text-amber-700"}>
                  {configured ? "Configured" : "Not configured"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="gameplay-video" className="fd-card">
        <h2 className="text-xl font-semibold">Gameplay Demo Video</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Recorded game demo clip for judges and teammates.
        </p>
        <video controls className="mt-3 w-full rounded-lg border border-black/10 bg-black">
          <source src="/media/frontierdispatch-demo.mkv" type="video/x-matroska" />
          Your browser does not support embedded MKV playback.
        </video>
        <a
          href="/media/frontierdispatch-demo.mkv"
          className="mt-3 inline-flex fd-button-secondary"
          target="_blank"
          rel="noreferrer"
        >
          Open/Download Demo Video
        </a>
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
