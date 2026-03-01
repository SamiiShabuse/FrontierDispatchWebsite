# Solana Proof-of-Delivery Notes

FrontierDispatch uses Solana devnet memo transactions as run receipts.

## Website implementation

- UI + wallet flow: `../apps/web/app/ledger/page.tsx`
- Wallet adapter provider: `../apps/web/components/providers.tsx`

## Payload strategy

- Memo stores compact JSON:
  - runId
  - towns served
  - onTime status
  - events faced
  - timestamp
- Payload is size-limited for memo reliability.

## Explorer format

- `https://explorer.solana.com/tx/<signature>?cluster=devnet`

## Requirement fit

This provides a verifiable, public, on-chain proof that a run happened.
