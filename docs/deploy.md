# Deploy on DigitalOcean App Platform

This guide deploys the Next.js app from `/apps/web` and points `frontierdispatch.tech` to DigitalOcean.

## 1) Create App

1. Open DigitalOcean App Platform.
2. Click **Create App**.
3. Connect GitHub repo.
4. Select source directory: `apps/web`.
5. Build command: `npm run build`
6. Run command: `npm run start`
7. HTTP Port: `8080` (App Platform default for Next runtime).
8. Confirm health endpoint responds after deploy: `/api/health`.

## 2) Environment Variables

Add these in App Settings -> Environment Variables:

- `NEXT_PUBLIC_SITE_URL=https://frontierdispatch.tech`
- `ROBLOX_GAME_URL=...`
- `GEMINI_API_KEY=...`
- `ELEVENLABS_API_KEY=...`
- `ELEVENLABS_VOICE_ID_DEFAULT=...`
- `SNOWFLAKE_ACCOUNT=...`
- `SNOWFLAKE_USERNAME=...`
- `SNOWFLAKE_PASSWORD=...`
- `SNOWFLAKE_WAREHOUSE=...`
- `SNOWFLAKE_DATABASE=...`
- `SNOWFLAKE_SCHEMA=...`
- `SNOWFLAKE_ROLE=...`
- `SOLANA_RPC_URL=https://api.devnet.solana.com`
- `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`

## 3) Domain Setup for FrontierDispatch.tech

1. In App Platform, open **Domains**.
2. Add `frontierdispatch.tech` and `www.frontierdispatch.tech`.
3. Add/verify required DNS records in domain registrar.
4. Wait for SSL provisioning.

## 4) Verify Health

After deployment:

- Open `/api/health`.
- Confirm integration flags for configured services.
- Run the full `/demo` flow.
- Verify `/proof` page checklist links and endpoints.

## Deployment Evidence Checklist

- App creation settings screenshot
- Environment variables screenshot (secrets redacted)
- Domain + SSL status screenshot
- `/api/health` response screenshot
- `/proof` and `/demo` production screenshots
