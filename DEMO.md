# FrontierDispatch 2-Minute Demo Path

For full sponsor requirement mapping and evidence checklist, see:
`docs/mlh-requirements.md`.

## Fast judge route

1. Open `https://frontierdispatch.tech/demo`.
2. Confirm **Live Integration Health** cards load.
3. Open **Dispatch AI** and click **Generate Optimal Dispatch Plan**.
4. Open **Telegraph Voice**, generate and play audio.
5. Open **Ledger**, connect Phantom, mint proof, and open explorer link.
6. Open **Dashboard** and verify:
   - run count changed
   - source breakdown includes `ledger-auto`
   - chain-proof rate is visible
7. Open **Mission Control** and verify current run continuity + recent telemetry list.
8. Open **Proof Hub** and verify each sponsor checklist item.

## Expected outputs

- Gemini: plan text with route rationale and contingencies.
- ElevenLabs: playable generated briefing audio.
- Solana: devnet tx signature and explorer URL.
- Snowflake/Telemetry: updated metrics and source/proof analytics.

## Notes

- If an API key is missing, each page shows a clear fallback/not-configured state.
- Snowflake fallback mode still allows demo continuity for local runs.
- If production `Live Integration Health` shows all `Not configured`, verify
  DigitalOcean runtime environment variables and redeploy (see `docs/deploy.md`).
