import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { dispatchRequestSchema, trimDangerousPrompt } from "@/lib/validators";

const GEMINI_MODEL = "gemini-2.0-flash";

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

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
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

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        { ok: false, error: `Gemini request failed: ${message.slice(0, 180)}` },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const planText =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ??
      "";

    if (!planText.trim()) {
      return NextResponse.json(
        { ok: false, error: "Gemini returned empty plan" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      planText,
      structuredPlan: { routeChoice: payload.routeChoice },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
