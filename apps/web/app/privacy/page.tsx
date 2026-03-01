export default function PrivacyPage() {
  return (
    <section className="fd-card space-y-3">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <p className="text-[var(--muted)]">
        FrontierDispatch stores only run telemetry required for operations
        analytics and optional demo proofing. No payment data is collected by
        this site.
      </p>
      <p className="text-[var(--muted)]">
        Voice generation requests are sent to ElevenLabs, dispatch planning to
        Gemini, and run telemetry to Snowflake when configured.
      </p>
    </section>
  );
}
