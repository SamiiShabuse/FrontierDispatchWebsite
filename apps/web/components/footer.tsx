import { SponsorBadges } from "@/components/sponsor-badges";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 md:px-6">
        <SponsorBadges />
        <p className="text-sm text-[var(--muted)]">
          FrontierDispatch.tech - Infrastructure, logistics, and frontier systems
          modernization.
        </p>
      </div>
    </footer>
  );
}
