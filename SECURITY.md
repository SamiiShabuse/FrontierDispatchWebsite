# Security Policy

## Scope

FrontierDispatch uses third-party service integrations and environment variables. Security issues are most likely to involve leaked credentials, unsafe API handling, or accidental publication of private telemetry.

## Do Not Commit

- Gemini API keys
- ElevenLabs API keys or voice credentials
- Snowflake usernames, passwords, account identifiers, or private warehouse details
- Wallet private keys or seed phrases
- `.env.local` or production environment files
- Private telemetry exports

## Reporting a Concern

Report security issues privately to the repository owner. Include the affected file or route, the type of exposure, and whether it appears in the latest commit or repository history.

## Local Configuration

Use `apps/web/.env.example` as the template for local development. Keep real values in `.env.local` or the deployment provider's secret manager.