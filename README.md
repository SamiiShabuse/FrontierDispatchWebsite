# FrontierDispatch Mission Control

Official website + API + sponsor proof hub for the FrontierDispatch Roblox game.

Live domain: **https://frontierdispatch.tech**

## Project Overview

FrontierDispatch is an infrastructure and logistics strategy game on Roblox.  
This repository contains the official web mission-control portal used for:

- Morning Dispatch planning with Gemini
- Telegraph-style voice briefings with ElevenLabs
- Run telemetry logging + analytics with Snowflake
- Proof-of-delivery receipts on Solana devnet
- Deployment on DigitalOcean App Platform

Smalltalk is used to generate the contract/risk data models consumed by the site.

## Links

- Live site: `https://frontierdispatch.tech`
- Roblox game: `ROBLOX_GAME_URL`
- Devpost: `DEVPOST_URL`
- GitHub: `GITHUB_REPO_URL`

## 2-Minute Demo Path

Follow: [`DEMO.md`](./DEMO.md)

## Sponsor Qualification Checklist (with file paths)

- Best Use of Gemini API
  - UI: `/apps/web/app/dispatch`
  - API route: `/apps/web/app/api/gemini/plan/route.ts`
- Best Use of ElevenLabs
  - UI: `/apps/web/app/telegraph`
  - API route: `/apps/web/app/api/elevenlabs/tts/route.ts`
- Best Use of Solana
  - UI + wallet adapter: `/apps/web/app/ledger` + wallet adapter usage
  - Provider setup: `/apps/web/components/providers.tsx`
- Best Use of Snowflake API
  - Dashboard UI: `/apps/web/app/dashboard`
  - Telemetry routes: `/apps/web/app/api/telemetry/*`
  - SQL schema: `/snowflake/schema.sql`
- Best Use of DigitalOcean
  - Deployment guide: `/docs/deploy.md`
- Best .Tech Domain Name
  - Domain usage in app + docs: `frontierdispatch.tech`
- LabWare Smalltalk Mini Category
  - Scripts + instructions: `/smalltalk/README_SMALLTALK.md`, `/smalltalk/ContractGenerator.st`, `/smalltalk/EventModel.st`
  - Generated JSON consumed by website:
    - `/apps/web/public/data/contracts.json`
    - `/apps/web/public/data/risks.json`

## Repository Structure

- `/apps/web` - Next.js App Router website + API routes
- `/smalltalk` - Smalltalk scripts and generation workflow
- `/snowflake` - SQL schema and sample analytics queries
- `/solana` - Solana memo receipt notes/scripts
- `/docs` - Deployment/runbook docs
- `/scripts` - helper scripts

## Local Setup

1. Install Node 20+.
2. Copy `apps/web/.env.example` to `apps/web/.env.local`.
3. Fill required keys.
4. Run:
   - `cd apps/web`
   - `npm install`
   - `npm run dev`
5. Open `http://localhost:3000/demo`.

## Environment Variables

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

## Troubleshooting

- **Gemini not configured**: set `GEMINI_API_KEY`, restart dev server.
- **ElevenLabs not configured**: set `ELEVENLABS_API_KEY`.
- **Snowflake not configured**: set all Snowflake vars; local fallback mode is enabled for dev-only demo continuity.
- **Wallet not connected**: install Phantom and connect on `/ledger`.
- **Build/deploy errors on DO**: verify App Platform env vars in `/docs/deploy.md`.
