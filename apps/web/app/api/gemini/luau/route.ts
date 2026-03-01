import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { luauCopilotRequestSchema, trimDangerousPrompt } from "@/lib/validators";
import { buildLuauMissionPrompt } from "@/lib/luau-prompts";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"] as const;

async function requestGeminiLuau(prompt: string, apiKey: string) {
  let lastErrorMessage = "Gemini Luau request failed";

  for (const model of GEMINI_MODELS) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 900,
        },
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const luauText =
        data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("\n") ?? "";
      if (luauText.trim()) {
        return { ok: true as const, luauText, model };
      }
      lastErrorMessage = `Gemini model ${model} returned empty output`;
      continue;
    }

    const message = await response.text();
    lastErrorMessage = `Gemini ${model} failed: ${message.slice(0, 240)}`;
    if (response.status === 429) continue;
    return { ok: false as const, error: lastErrorMessage, status: 500 };
  }

  return { ok: false as const, error: lastErrorMessage, status: 429 };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const limit = checkRateLimit(`${ip}-luau`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: `Rate limit exceeded. Retry in ${limit.retryAfter}s.` },
      { status: 429 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Gemini not configured" },
      { status: 503 },
    );
  }

  try {
    const json = await request.json();
    const parsed = luauCopilotRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid copilot payload" },
        { status: 400 },
      );
    }

    const prompt = trimDangerousPrompt(buildLuauMissionPrompt(parsed.data));
    const result = await requestGeminiLuau(prompt, process.env.GEMINI_API_KEY);
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            result.status === 429
              ? "Gemini quota exceeded for available models. Check billing + quota, then retry."
              : result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      ok: true,
      luauText: result.luauText,
      model: result.model,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
