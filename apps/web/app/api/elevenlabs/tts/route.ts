import { NextRequest, NextResponse } from "next/server";
import { ttsRequestSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ElevenLabs not configured" },
      { status: 503 },
    );
  }

  try {
    const json = await request.json();
    const parsed = ttsRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid TTS payload" }, { status: 400 });
    }

    const { text, voiceId, urgency } = parsed.data;
    const stylePrefix =
      urgency === "urgent"
        ? "Urgent telegraph voice, concise, high priority dispatch update: "
        : "Calm telegraph voice, clear logistics briefing: ";

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: `${stylePrefix}${text}`,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: urgency === "urgent" ? 0.35 : 0.6,
          similarity_boost: 0.85,
          style: urgency === "urgent" ? 0.8 : 0.3,
        },
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        { ok: false, error: `ElevenLabs request failed: ${message.slice(0, 180)}` },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return NextResponse.json({
      ok: true,
      mimeType: response.headers.get("content-type") || "audio/mpeg",
      audioBase64: buffer.toString("base64"),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
