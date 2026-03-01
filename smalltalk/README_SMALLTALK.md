# Smalltalk Data Generators (LabWare Mini Category)

Smalltalk is used to generate the contract/risk data models consumed by the website.

## Files

- `ContractGenerator.st` - builds daily contract presets for Tombstone, Deadwood, Dodge City.
- `EventModel.st` - computes route risk probabilities and event likelihood profiles.
- `generated-workflow.json` - sample export manifest used by web app.

## Output JSON Consumed by Website

- `../apps/web/public/data/contracts.json`
- `../apps/web/public/data/risks.json`

## How to run (Pharo or Squeak)

1. Open Pharo (or Squeak) image.
2. File in `ContractGenerator.st`.
3. File in `EventModel.st`.
4. Evaluate:
   - `FDContractGenerator new exportContractsJsonTo: '../apps/web/public/data/contracts.json'.`
   - `FDEventModel new exportRisksJsonTo: '../apps/web/public/data/risks.json'.`
5. Commit generated JSON changes.

## Why this matters

The dispatch and log-run pages can use generated presets directly, proving Smalltalk contributes to the deployed full-stack experience.
