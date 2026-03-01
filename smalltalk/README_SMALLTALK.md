# Smalltalk Data Generators (LabWare Mini Category)

Smalltalk is used to generate the contract/risk data models consumed by the website.

## Files

- `ContractGenerator.st` - builds daily contract presets for Tombstone, Deadwood, Dodge City.
- `EventModel.st` - computes route risk probabilities and event likelihood profiles.
- `ScenarioGenerator.st` - creates scenario presets for weather, pressure, and payout multipliers.
- `DataPipeline.st` - orchestrates all exports and writes a validation report.
- `generated-workflow.json` - sample export manifest used by web app.
- `model-validation.json` - sample output from `FDDataPipeline >> validationReport`.

## Output JSON Consumed by Website

- `../apps/web/public/data/contracts.json`
- `../apps/web/public/data/risks.json`
- `../apps/web/public/data/scenarios.json`

## How to run (Pharo or Squeak)

1. Open Pharo (or Squeak) image.
2. File in `ContractGenerator.st`.
3. File in `EventModel.st`.
4. Evaluate:
   - `FDContractGenerator new exportContractsJsonTo: '../apps/web/public/data/contracts.json'.`
   - `FDEventModel new exportRisksJsonTo: '../apps/web/public/data/risks.json'.`
   - `FDScenarioGenerator new exportScenariosJsonTo: '../apps/web/public/data/scenarios.json'.`
5. Optional one-shot pipeline run:
   - `FDDataPipeline new exportAllToWebDataPath: '../apps/web/public/data'.`
   - `FDDataPipeline new exportValidationReportJsonTo: 'model-validation.json'.`
6. Commit generated JSON changes.

## Why this matters

The dispatch, log-run, and simulator flows can use generated presets directly, proving Smalltalk contributes to the deployed full-stack experience.

## Integration Mapping (Smalltalk -> Web App)

- `contracts.json` (from `FDContractGenerator`)
  - consumed by `apps/web/app/log-run/page.tsx` for preset run buttons
  - used by planning flows as structured contract source data
- `risks.json` (from `FDEventModel`)
  - consumed by dispatch/simulator logic as baseline risk configuration
- `scenarios.json` (from `FDScenarioGenerator`)
  - consumed as scenario-balancing seed data for future/extended mission tooling
- `model-validation.json` (from `FDDataPipeline`)
  - judge-facing artifact proving schema checks and generator health

Detailed system explanation: `../docs/smalltalk-integration.md`
