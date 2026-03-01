"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

type TtsResponse = {
  ok: boolean;
  mimeType?: string;
  audioBase64?: string;
  error?: string;
};

const voiceOptions = [
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Marshal (Deep)" },
  { id: "pNInz6obpgDQGcFmaJgB", label: "Courier (Bright)" },
];

export default function TelegraphPage() {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(voiceOptions[0].id);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [loading, setLoading] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string>("");
  const [mimeType, setMimeType] = useState("audio/mpeg");

  useEffect(() => {
    const savedPlan = localStorage.getItem("frontier_latest_plan");
    if (savedPlan) {
      setText(savedPlan);
    }
  }, []);

  const audioSrc = useMemo(() => {
    if (!audioBase64) return "";
    return `data:${mimeType};base64,${audioBase64}`;
  }, [audioBase64, mimeType]);

  async function generateVoice() {
    setLoading(true);
    setAudioBase64("");
    try {
      const response = await fetch("/api/elevenlabs/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId, urgency }),
      });

      const data = (await response.json()) as TtsResponse;
      if (!response.ok || !data.ok || !data.audioBase64 || !data.mimeType) {
        throw new Error(data.error ?? "Voice generation failed.");
      }

      setAudioBase64(data.audioBase64);
      setMimeType(data.mimeType);
      toast.success("Voice briefing generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ElevenLabs track callout for judges */}
      <TrackCallout
        track="Best Use of ElevenLabs"
        details="The briefing text is transformed into playable telegraph audio through /api/elevenlabs/tts with selectable voices and urgency style."
      />
      <JudgeProof
        apiRoute="/api/elevenlabs/tts"
        codePath="/apps/web/app/telegraph + /apps/web/app/api/elevenlabs/tts/route.ts"
        clickSteps="Paste or auto-load dispatch plan, select voice, choose urgency, and click Generate Voice Briefing."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Telegraph Voice Briefing</h1>

        <label className="block space-y-1 text-sm">
          <span>Briefing text</span>
          <textarea
            className="fd-input min-h-40"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste dispatch plan or generate one in /dispatch first."
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Voice selector</span>
            <select
              className="fd-input"
              value={voiceId}
              onChange={(event) => setVoiceId(event.target.value)}
            >
              {voiceOptions.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Urgency</span>
            <select
              className="fd-input"
              value={urgency}
              onChange={(event) =>
                setUrgency(event.target.value as "normal" | "urgent")
              }
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
        </div>

        <button onClick={generateVoice} disabled={loading} className="fd-button">
          {loading ? "Generating..." : "Generate Voice Briefing"}
        </button>
      </section>

      <section className="fd-card">
        <h2 className="text-xl font-semibold">Audio Output</h2>
        {audioSrc ? (
          <audio controls className="mt-3 w-full">
            <source src={audioSrc} type={mimeType} />
          </audio>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Generated audio appears here.
          </p>
        )}
      </section>
    </div>
  );
}
