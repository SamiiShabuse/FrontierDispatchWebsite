type Props = {
  track: string;
  details: string;
};

export function TrackCallout({ track, details }: Props) {
  return (
    <aside className="fd-card border-l-4 border-l-[var(--accent)]">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
        How this qualifies for {track}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground)]">{details}</p>
    </aside>
  );
}
