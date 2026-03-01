# FrontierDispatch Mission Control

Official web platform for developing and proving FrontierDispatch Roblox systems.

Live domain: **https://frontierdispatch.tech**

## What this project does

FrontierDispatch Mission Control is a Next.js + TypeScript platform that helps our team:

- plan missions with Gemini (`/dispatch`)
- generate telegraph briefings with ElevenLabs (`/telegraph`)
- mint Solana proof-of-delivery receipts (`/ledger`)
- ingest + analyze telemetry via Snowflake (`/dashboard`)
- monitor active run continuity + recent telemetry (`/mission-control`)
- test signed Roblox Open Cloud payloads (`/ingest-lab`)
- run balancing simulations (`/simulator`)
- generate Luau mission scaffolding (`/copilot`)
- verify all sponsor categories quickly (`/proof`)

## 2-Minute Judge Path

Follow [`DEMO.md`](./DEMO.md) and start at `/demo`.

## Sponsor Proof Map

- **Gemini API**
  - UI: `/apps/web/app/dispatch/page.tsx`
  - API: `/apps/web/app/api/gemini/plan/route.ts`
  - Luau copilot API: `/apps/web/app/api/gemini/luau/route.ts`
- **ElevenLabs**
  - UI: `/apps/web/app/telegraph/page.tsx`
  - API: `/apps/web/app/api/elevenlabs/tts/route.ts`
- **Solana**
  - UI + mint flow: `/apps/web/app/ledger/page.tsx`
  - Wallet providers: `/apps/web/components/providers.tsx`
- **Snowflake**
  - APIs: `/apps/web/app/api/telemetry/insert/route.ts`, `/apps/web/app/api/telemetry/summary/route.ts`, `/apps/web/app/api/telemetry/recent/route.ts`
  - Storage integration: `/apps/web/lib/snowflake.ts`
  - SQL schema: `/snowflake/schema.sql`
- **Roblox telemetry ingest**
  - API: `/apps/web/app/api/roblox/telemetry/ingest/route.ts`
  - Test UI: `/apps/web/app/ingest-lab/page.tsx`
  - Auth helper: `/apps/web/lib/roblox-opencloud.ts`
- **DigitalOcean**
  - Deploy guide: `/docs/deploy.md`
- **.Tech domain**
  - Primary domain and branding in app metadata/docs: `frontierdispatch.tech`
- **LabWare Smalltalk**
  - Scripts: `/smalltalk/ContractGenerator.st`, `/smalltalk/EventModel.st`
  - Guide: `/smalltalk/README_SMALLTALK.md`
  - Generated data used by app: `/apps/web/public/data/contracts.json`, `/apps/web/public/data/risks.json`

## Repo Layout

- `/apps/web` Next.js app + API routes
- `/smalltalk` Smalltalk model generators
- `/snowflake` schema + analytics queries
- `/solana` Solana notes
- `/docs` deploy and proof docs
- `/scripts` local setup scripts

## Local Setup

1. `cd apps/web`
2. `cp .env.example .env.local` (PowerShell: `Copy-Item .env.example .env.local`)
3. Fill env vars.
4. Run:
   - `npm install`
   - `npm run dev`
5. Open `http://localhost:3000/demo`.

## Required Environment Variables

Defined in `/apps/web/.env.example`:

- `NEXT_PUBLIC_SITE_URL`
- `ROBLOX_GAME_URL`
- `ROBLOX_INGEST_SHARED_SECRET`
- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID_DEFAULT`
- `SNOWFLAKE_ACCOUNT`
- `SNOWFLAKE_USERNAME`
- `SNOWFLAKE_PASSWORD`
- `SNOWFLAKE_WAREHOUSE`
- `SNOWFLAKE_DATABASE`
- `SNOWFLAKE_SCHEMA`
- `SNOWFLAKE_ROLE`
- `SOLANA_RPC_URL`
- `NEXT_PUBLIC_SOLANA_RPC_URL`

## Docs

- Judge proof checklist: [`docs/judge-proof.md`](./docs/judge-proof.md)
- Demo flow: [`DEMO.md`](./DEMO.md)
- DigitalOcean deploy: [`docs/deploy.md`](./docs/deploy.md)
