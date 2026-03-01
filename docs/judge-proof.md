# FrontierDispatch Judge Proof Checklist

Use this checklist during judging to verify each sponsor requirement quickly.

## Gemini API

- UI: `/dispatch`
- API: `/api/gemini/plan`
- Verify: generate plan text from structured contract/town payload.
- Code: `/apps/web/app/api/gemini/plan/route.ts`

## ElevenLabs

- UI: `/telegraph`
- API: `/api/elevenlabs/tts`
- Verify: generate playable audio from briefing text.
- Code: `/apps/web/app/api/elevenlabs/tts/route.ts`

## Solana

- UI: `/ledger`
- Verify: mint memo transaction and open devnet explorer link.
- Code: `/apps/web/app/ledger/page.tsx`

## Snowflake

- UI: `/dashboard`
- APIs: `/api/telemetry/insert`, `/api/telemetry/summary`
- Verify: metrics update after ledger mint or log run.
- Code: `/apps/web/lib/snowflake.ts`

## Roblox Open Cloud Ingest

- API: `/api/roblox/telemetry/ingest`
- Auth header: `x-frontier-ingest-secret`
- Verify: send signed payload and observe source split in dashboard.
- Code: `/apps/web/app/api/roblox/telemetry/ingest/route.ts`

## DigitalOcean

- Deploy docs: `/docs/deploy.md`
- Verify: app runs on `frontierdispatch.tech` with `/api/health` and `/demo`.

## .Tech Domain

- Domain used in branding and public URL: `frontierdispatch.tech`.

## LabWare Smalltalk

- Scripts: `/smalltalk/ContractGenerator.st`, `/smalltalk/EventModel.st`
- Generated data consumed by app: `/apps/web/public/data/contracts.json`, `/apps/web/public/data/risks.json`

## Recommended Judge Click Path

`/demo -> /dispatch -> /telegraph -> /ledger -> /dashboard -> /proof`
