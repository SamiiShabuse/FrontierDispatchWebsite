# Smalltalk Integration Details

FrontierDispatch uses LabWare-style Smalltalk generators to produce structured game-design data that is consumed by the Next.js app at runtime.

## Why Smalltalk is in this project

Smalltalk is used for deterministic content generation and validation:

- contract definitions (mission presets)
- town/event risk configuration
- scenario presets for balancing loops
- validation/reporting for model integrity

This makes Smalltalk part of the production data pipeline, not a disconnected demo script.

## Source Generators

- `smalltalk/ContractGenerator.st`
  - Defines contract records (`id`, `title`, `towns`, `resources`, `payout`)
- `smalltalk/EventModel.st`
  - Defines town risk profiles and global event types
- `smalltalk/ScenarioGenerator.st`
  - Defines scenario presets (`weather`, `enemyPressure`, `recommendedRoute`, `payoutMultiplier`)
- `smalltalk/DataPipeline.st`
  - Runs all exports together
  - Emits validation report (`contractsCount`, `scenarioCount`, duplicate ID checks)

## Generated Outputs

- `apps/web/public/data/contracts.json`
- `apps/web/public/data/risks.json`
- `apps/web/public/data/scenarios.json`
- `smalltalk/model-validation.json`

## Where the Web App Uses It

- `apps/web/app/dispatch/page.tsx`
  - Loads generated contract/risk context for AI planning inputs.
- `apps/web/app/log-run/page.tsx`
  - Uses generated contract presets for fast telemetry logging.
- `apps/web/app/simulator/page.tsx`
  - Uses risk/event modeling concepts aligned with Smalltalk outputs for balancing.

## Execution Flow (Pharo/Squeak)

1. File in:
   - `ContractGenerator.st`
   - `EventModel.st`
   - `ScenarioGenerator.st`
   - `DataPipeline.st`
2. Run one-shot pipeline:
   - `FDDataPipeline new exportAllToWebDataPath: '../apps/web/public/data'.`
   - `FDDataPipeline new exportValidationReportJsonTo: 'model-validation.json'.`
3. Commit generated JSON artifacts.

## Judge Verification Flow

1. Open `/dispatch` and confirm generated contract/risk data influences plan inputs.
2. Open `/log-run` and confirm preset contracts appear as quick-select buttons.
3. Open repository paths above to verify generated JSON artifacts and validation report.
4. Confirm generator source files exist under `/smalltalk` and match output structure.
