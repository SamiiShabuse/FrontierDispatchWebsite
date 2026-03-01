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
  - APIs: `/apps/web/app/api/telemetry/insert/route.ts`, `/apps/web/app/api/telemetry/summary/route.ts`, `/apps/web/app/api/telemetry/recent/route.ts`, `/apps/web/app/api/telemetry/export/route.ts`
  - Storage integration: `/apps/web/lib/snowflake.ts`
  - SQL schema: `/snowflake/schema.sql`
- **DigitalOcean**
  - Deploy guide: `/docs/deploy.md`
- **.Tech domain**
  - Primary domain and branding in app metadata/docs: `frontierdispatch.tech`
- **LabWare Smalltalk**
  - Scripts: `/smalltalk/ContractGenerator.st`, `/smalltalk/EventModel.st`, `/smalltalk/ScenarioGenerator.st`, `/smalltalk/DataPipeline.st`
  - Guide: `/smalltalk/README_SMALLTALK.md`
  - Generated data used by app: `/apps/web/public/data/contracts.json`, `/apps/web/public/data/risks.json`, `/apps/web/public/data/scenarios.json`

## Smalltalk in Production Flow

Smalltalk is a first-class part of FrontierDispatch's runtime data pipeline:

1. **Generate mission models in Smalltalk**
   - `FDContractGenerator` defines contract presets
   - `FDEventModel` defines risk/event modeling
   - `FDScenarioGenerator` defines scenario balancing presets
   - `FDDataPipeline` exports all artifacts and validates model quality
2. **Export to web-consumable JSON**
   - `/apps/web/public/data/contracts.json`
   - `/apps/web/public/data/risks.json`
   - `/apps/web/public/data/scenarios.json`
   - `/smalltalk/model-validation.json`
3. **Consume in app features**
   - `/dispatch` uses generated model context for AI planning
   - `/log-run` uses generated contract presets for telemetry input
   - `/simulator` aligns balancing workflows with generated risk/scenario data
4. **Provide judge-verifiable evidence**
   - generator source in `/smalltalk/*.st`
   - generated artifacts under `/apps/web/public/data`
   - validation report in `/smalltalk/model-validation.json`

Detailed integration doc: [`docs/smalltalk-integration.md`](./docs/smalltalk-integration.md)

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
- Smalltalk integration details: [`docs/smalltalk-integration.md`](./docs/smalltalk-integration.md)
