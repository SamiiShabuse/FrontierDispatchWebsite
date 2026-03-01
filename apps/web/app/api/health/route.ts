import { NextResponse } from "next/server";

function hasEnv(name: string) {
  return Boolean(process.env[name]);
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    integrations: {
      geminiConfigured: hasEnv("GEMINI_API_KEY"),
      elevenLabsConfigured: hasEnv("ELEVENLABS_API_KEY"),
      snowflakeConfigured:
        hasEnv("SNOWFLAKE_ACCOUNT") &&
        hasEnv("SNOWFLAKE_USERNAME") &&
        hasEnv("SNOWFLAKE_PASSWORD"),
      solanaRpcConfigured: hasEnv("SOLANA_RPC_URL"),
      siteUrlConfigured: hasEnv("NEXT_PUBLIC_SITE_URL"),
      robloxUrlConfigured: hasEnv("ROBLOX_GAME_URL"),
    },
  });
}
