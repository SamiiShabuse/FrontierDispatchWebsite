# Contributing

Thanks for improving FrontierDispatch Mission Control. This repository combines a Next.js web app, Roblox-facing workflow ideas, sponsor integrations, and supporting data scripts, so contributions should stay focused and easy to verify.

## Project Areas

- `apps/web`: Next.js app, routes, API endpoints, and UI components
- `smalltalk`: Smalltalk generators and generated workflow artifacts
- `snowflake`: Telemetry schema and sample analytics queries
- `solana`: Solana proof-of-delivery notes
- `docs`: Demo, deployment, sponsor proof, and judge-facing documentation

## Local Setup

```powershell
cd apps/web
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000/demo` for the judge path.

## Validation

Use the commands that match your change:

```powershell
cd apps/web
npm run lint
npm run build
```

Also check the docs pages that explain the affected feature, especially `DEMO.md`, `docs/judge-proof.md`, and `docs/mlh-requirements.md`.

## Pull Request Checklist

- The change is focused and described clearly.
- Environment variables are documented without secrets.
- Sponsor or judge evidence docs were updated if feature behavior changed.
- `npm run lint` and `npm run build` were run when app code changed.
- No API keys, wallet secrets, Snowflake credentials, or generated private exports are included.