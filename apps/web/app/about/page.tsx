import { TrackCallout } from "@/components/track-callout";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <TrackCallout
        track="Best .Tech Domain Name"
        details="FrontierDispatch.tech is the official brand hub for mission control, integrations proof, and judge walkthrough."
      />

      <section className="fd-card space-y-3">
        <h1 className="text-3xl font-bold">About FrontierDispatch</h1>
        <p className="text-[var(--muted)]">
          FrontierDispatch models infrastructure logistics in a frontier economy.
          Morning dispatch assigns contracts, route strategy balances speed and
          safety, dynamic events force adaptation, and each delivery influences
          long-term town stability and modernization unlocks.
        </p>
        <p className="text-[var(--muted)]">
          MVP towns: Tombstone (desert, needs Water/Food), Deadwood (mountain,
          needs Food/Medicine/Tools), and Dodge City (main, needs Gold).
        </p>
      </section>
    </div>
  );
}
