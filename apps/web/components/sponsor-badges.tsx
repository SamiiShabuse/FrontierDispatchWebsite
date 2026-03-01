const badges = [
  "Gemini",
  "ElevenLabs",
  "Solana",
  "DigitalOcean",
  "Snowflake",
  ".Tech",
  "Smalltalk",
];

export function SponsorBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge} className="fd-badge">
          {badge}
        </span>
      ))}
    </div>
  );
}
