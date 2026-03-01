-- Total runs
SELECT COUNT(*) AS total_runs
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS;

-- On-time rate
SELECT COALESCE(AVG(IFF(on_time, 1, 0)), 0) * 100 AS on_time_rate
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS;

-- Most common event
SELECT f.value::string AS event_name, COUNT(*) AS event_count
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS, LATERAL FLATTEN(input => events) f
GROUP BY event_name
ORDER BY event_count DESC
LIMIT 1;

-- Town stability averages
SELECT f.key::string AS town, AVG(f.value::float) AS avg_stability_delta
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS, LATERAL FLATTEN(input => town_stability_delta) f
GROUP BY town
ORDER BY town;

-- Runs over time
SELECT DATE_TRUNC('day', created_at) AS day, COUNT(*) AS run_count
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS
GROUP BY day
ORDER BY day DESC
LIMIT 15;

-- Source split (manual, ledger-auto, roblox-opencloud)
SELECT source, COUNT(*) AS run_count
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS
GROUP BY source
ORDER BY run_count DESC;

-- Chain-proof rate
SELECT
  COUNT_IF(solana_signature IS NOT NULL AND solana_signature <> '') / NULLIF(COUNT(*), 0) * 100 AS chain_proof_rate
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS;

-- Route risk score by choice
SELECT route_choice, AVG(risk_score) AS avg_risk_score
FROM FRONTIERDISPATCH_DB.PUBLIC.RUNS
GROUP BY route_choice
ORDER BY avg_risk_score DESC;
