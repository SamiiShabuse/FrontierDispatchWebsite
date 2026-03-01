# FrontierDispatch MLH Requirements and Evidence Guide

This document is the detailed sponsor/requirements reference for FrontierDispatch.
It is written for judges, reviewers, and teammates who need a direct mapping from
hackathon requirements to implementation evidence.

Live app: `https://frontierdispatch.tech`  
Primary judge path: `/demo`  
Proof checklist UI: `/proof`

## 1) Scope and Intent

FrontierDispatch is a production-style mission control platform for a Roblox logistics game.
The app demonstrates real integrations across AI, voice, blockchain, analytics, hosting, and domain.

This guide answers:

- Which requirement each integration satisfies
- Where the code lives in the repo
- Which UI/API route proves the integration
- What a judge should click and observe
- What deployment evidence is needed for hosting/domain requirements

## 2) Requirement Matrix (Track -> Evidence)

## Google Gemini API

- Requirement intent: Use Gemini for meaningful in-app intelligence, not static text.
- User-facing proof:
  - UI: `/dispatch`
  - UI: `/copilot`
- API proof:
  - `/api/gemini/plan`
  - `/api/gemini/luau`
- Code proof:
  - `apps/web/app/api/gemini/plan/route.ts`
  - `apps/web/app/api/gemini/luau/route.ts`
  - `apps/web/app/dispatch/page.tsx`
  - `apps/web/app/copilot/page.tsx`
- What judges should see:
  - Structured dispatch plan with routes, rationale, and contingencies
  - Luau mission scaffolding generated from mission prompts

## ElevenLabs

- Requirement intent: Real voice generation pipeline connected to gameplay ops.
- User-facing proof:
  - UI: `/telegraph`
- API proof:
  - `/api/elevenlabs/tts`
- Code proof:
  - `apps/web/app/api/elevenlabs/tts/route.ts`
  - `apps/web/app/telegraph/page.tsx`
- What judges should see:
  - Playable generated audio from mission briefing text
  - Voice/urgency selection reflected in output

## Solana

- Requirement intent: On-chain proof-of-delivery for run completion.
- User-facing proof:
  - UI: `/ledger`
- Client/runtime proof:
  - Wallet connect and memo transaction creation
- Code proof:
  - `apps/web/app/ledger/page.tsx`
  - `apps/web/components/providers.tsx`
- What judges should see:
  - Devnet transaction signature
  - Explorer link opens and confirms transaction

## Snowflake

- Requirement intent: Operational telemetry capture and analytics over mission runs.
- User-facing proof:
  - UI: `/dashboard`
  - UI: `/mission-control`
  - UI: `/log-run`
- API proof:
  - `/api/telemetry/insert`
  - `/api/telemetry/summary`
  - `/api/telemetry/recent`
  - `/api/telemetry/export`
- Code proof:
  - `apps/web/lib/snowflake.ts`
  - `apps/web/lib/telemetry-store.ts`
  - `apps/web/app/api/telemetry/*/route.ts`
  - `snowflake/schema.sql`
  - `snowflake/sample_queries.sql`
- What judges should see:
  - Metrics update after run insert/mint
  - Source breakdown and chain-proof rate populated
  - Recent runs table reflects newly created records

## DigitalOcean Hosting

- Requirement intent: Publicly hosted and reachable production deployment.
- Hosting proof:
  - Production URL: `https://frontierdispatch.tech`
  - Deployment target: DigitalOcean App Platform
- Deploy doc proof:
  - `docs/deploy.md`
- Runtime proof routes:
  - `/api/health`
  - `/demo`
  - `/proof`
- What judges should see:
  - App loads on public domain
  - Health endpoint responds with `status: "ok"`
  - Required integrations can be verified via demo flow

## .Tech Domain

- Requirement intent: Use and operate with a real `.tech` domain.
- Evidence:
  - Canonical URL: `frontierdispatch.tech`
  - Branding and links across docs/app point to `.tech` domain
- Proof locations:
  - `README.md`
  - `docs/deploy.md`
  - `apps/web/app/page.tsx` (site URL use)

## LabWare Smalltalk

- Requirement intent: Use Smalltalk as a real part of application data flow.
- Source generator proof:
  - `smalltalk/ContractGenerator.st`
  - `smalltalk/EventModel.st`
  - `smalltalk/ScenarioGenerator.st`
  - `smalltalk/DataPipeline.st`
- Data artifact proof:
  - `apps/web/public/data/contracts.json`
  - `apps/web/public/data/risks.json`
  - `apps/web/public/data/scenarios.json`
  - `smalltalk/model-validation.json`
- App consumption proof:
  - `apps/web/app/dispatch/page.tsx`
  - `apps/web/app/log-run/page.tsx`
  - `apps/web/app/simulator/page.tsx`
- Integration detail doc:
  - `docs/smalltalk-integration.md`
- What judges should see:
  - Generated JSON influences dispatch/logging/simulation behavior
  - Source generators and output schema are consistent

## 3) End-to-End Judge Runbook

Use this path to validate most requirements in one pass:

1. Open `https://frontierdispatch.tech/demo`.
2. Confirm `Live Integration Health` cards load.
3. Open `/dispatch`, generate a dispatch plan (Gemini).
4. Open `/telegraph`, generate and play briefing audio (ElevenLabs).
5. Open `/ledger`, connect wallet, mint proof, open Solana explorer link.
6. Open `/dashboard`, confirm telemetry metrics and chain-proof rate update.
7. Open `/mission-control`, verify continuity and recent runs list.
8. Open `/proof`, verify requirement-by-requirement checklist links.

## 4) DigitalOcean Deployment Requirements (Detailed)

## App Platform service configuration

- Source directory: `apps/web`
- Build command: `npm run build`
- Run command: `npm run start`
- HTTP port: `8080` (App Platform default)

## Required environment variables

Set in DigitalOcean App Platform for the web component:

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

Set scope to runtime (or run+build), then redeploy.

## Health endpoint behavior

`/api/health` reports integration readiness from runtime env vars.

- If all cards show `Not configured` in production, that usually means
  env vars are missing in DigitalOcean runtime scope.
- If local shows configured but production shows not configured, deployment
  environment is not aligned with local `.env`.

## 5) Evidence to Capture for Submission

Capture these artifacts (with secrets redacted):

- DigitalOcean deployment success screen
- DigitalOcean environment variables screen
- Domain + SSL screen showing `frontierdispatch.tech`
- `/api/health` response screenshot
- `/demo` walkthrough screenshots
- Solana explorer transaction URL screenshot
- `/dashboard` metrics screenshot
- `/proof` checklist screenshot

## 6) Security and Review Notes

- Do not commit real API keys or passwords in repository docs or code.
- Redact secrets in screenshots before submission.
- Keep environment values in platform secret managers and local env files.
- Validate sponsor endpoints through app flows instead of exposing credentials.

## 7) Cross-Reference Docs

- Primary README: `README.md`
- Judge checklist: `docs/judge-proof.md`
- Demo run path: `DEMO.md`
- Deploy setup: `docs/deploy.md`
- Smalltalk integration: `docs/smalltalk-integration.md`
