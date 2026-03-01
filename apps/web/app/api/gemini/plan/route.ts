import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { dispatchRequestSchema, trimDangerousPrompt } from "@/lib/validators";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"] as const;

async function requestGeminiPlan(prompt: string, apiKey: string) {
  let lastErrorMessage = "Gemini request failed";

  for (const model of GEMINI_MODELS) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 700,
        },
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const planText =
        data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("\n") ?? "";

      if (planText.trim()) {
        return { ok: true as const, planText, model };
      }
      lastErrorMessage = `Gemini model ${model} returned empty output`;
      continue;
    }

    const message = await response.text();
    lastErrorMessage = `Gemini ${model} failed: ${message.slice(0, 240)}`;

    // If quota is exceeded on this model, try fallback model.
    if (response.status === 429) {
      continue;
    }

    // For non-429 errors, stop early and return the actual upstream failure.
    return { ok: false as const, error: lastErrorMessage, status: 500 };
  }

  return { ok: false as const, error: lastErrorMessage, status: 429 };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const limit = checkRateLimit(ip);
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
    const parsed = dispatchRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid dispatch request payload" },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const prompt = trimDangerousPrompt(`
You are FrontierDispatch mission AI. Use ONLY provided game state.
Return sections exactly:
1) Recommended contracts (2-3 bullets)
2) Recommended route per contract
3) Risk rationale (Dust storm / Broken bridge / Bandits)
4) If X happens contingency plan
5) One-paragraph summary

Game State JSON:
${JSON.stringify(payload, null, 2)}
`);

    const result = await requestGeminiPlan(prompt, process.env.GEMINI_API_KEY);
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            result.status === 429
              ? "Gemini quota exceeded for available models. Check AI Studio/GCP billing + quota, then retry."
              : result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      ok: true,
      planText: result.planText,
      structuredPlan: { routeChoice: payload.routeChoice, model: result.model },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
