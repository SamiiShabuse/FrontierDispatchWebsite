-- FrontierDispatch telemetry schema
CREATE DATABASE IF NOT EXISTS FRONTIERDISPATCH_DB;
CREATE SCHEMA IF NOT EXISTS FRONTIERDISPATCH_DB.PUBLIC;

CREATE OR REPLACE TABLE FRONTIERDISPATCH_DB.PUBLIC.RUNS (
  id STRING,
  created_at TIMESTAMP_NTZ,
  run_id STRING,
  contracts VARIANT,
  towns VARIANT,
  route_choice STRING,
  events VARIANT,
  on_time BOOLEAN,
  payout NUMBER(12,2),
  town_stability_delta VARIANT,
  source STRING,
  solana_signature STRING,
  voice_id STRING,
  plan_preview STRING,
  risk_score NUMBER(5,2)
);

-- Optional clustering for analytics
ALTER TABLE FRONTIERDISPATCH_DB.PUBLIC.RUNS CLUSTER BY (DATE(created_at));
