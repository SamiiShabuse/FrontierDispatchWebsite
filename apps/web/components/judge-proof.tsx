type Props = {
  apiRoute: string;
  codePath: string;
  clickSteps: string;
};

export function JudgeProof({ apiRoute, codePath, clickSteps }: Props) {
  return (
    <aside className="fd-card border-l-4 border-l-[var(--accent-2)]">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
        Judge Proof
      </p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--foreground)]">
        <li>
          API Route: <code>{apiRoute}</code>
        </li>
        <li>
          Code: <code>{codePath}</code>
        </li>
        <li>Click path: {clickSteps}</li>
      </ul>
    </aside>
  );
}
