"use client";

import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { toast } from "sonner";
import { JudgeProof } from "@/components/judge-proof";
import { TrackCallout } from "@/components/track-callout";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export default function LedgerPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [phantomInstalled, setPhantomInstalled] = useState(false);

  const [towns, setTowns] = useState("Tombstone,Deadwood");
  const [onTime, setOnTime] = useState(true);
  const [events, setEvents] = useState("Dust storm");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [runId, setRunId] = useState(`run-${Date.now()}`);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const explorerLink = useMemo(() => {
    if (!signature) return "";
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  }, [signature]);

  useEffect(() => {
    const isInstalled = Boolean(
      (
        window as Window & {
          solana?: { isPhantom?: boolean };
        }
      ).solana?.isPhantom,
    );
    setPhantomInstalled(isInstalled);
  }, []);

  async function connectWallet() {
    try {
      if (!phantomInstalled) {
        toast.error("Phantom extension not detected in this browser profile.");
        return;
      }
      if (!wallet.wallet) {
        wallet.select("Phantom");
      }
      await wallet.connect();
      toast.success("Phantom connected.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to connect Phantom wallet",
      );
    }
  }

  async function mintProof() {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      toast.error("Wallet not connected");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        runId,
        towns: towns.split(",").map((value) => value.trim()),
        onTime,
        events: events.split(",").map((value) => value.trim()),
        timestamp,
      };
      const payloadText = JSON.stringify(payload).slice(0, 420);
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(payloadText, "utf8"),
      });

      const transaction = new Transaction().add(memoInstruction);
      const txSignature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(txSignature, "confirmed");
      setSignature(txSignature);
      toast.success("Proof-of-delivery minted on Solana devnet.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Solana track callout for judges */}
      <TrackCallout
        track="Best Use of Solana"
        details="A real devnet memo transaction stores a compact proof-of-delivery payload and returns a verifiable explorer signature."
      />
      <JudgeProof
        apiRoute="Client-side Solana web3.js memo transaction"
        codePath="/apps/web/app/ledger + wallet adapter usage"
        clickSteps="Connect Phantom, fill run details, click Mint Proof-of-Delivery (Devnet), then open explorer link."
      />

      <section className="fd-card space-y-4">
        <h1 className="text-2xl font-bold">Proof-of-Delivery Ledger</h1>
        <div className="rounded-md border border-white/20 bg-white/5 p-3 text-sm text-[var(--muted)]">
          <p>Wallet status: {wallet.connected ? "Connected" : "Not connected"}</p>
          {!phantomInstalled && (
            <p className="mt-1 text-yellow-200">
              Phantom extension is not detected. Install Phantom and use
              `localhost` URL (not network IP) in the same browser profile.
            </p>
          )}
        </div>
        <button onClick={connectWallet} className="fd-button-secondary w-fit">
          Connect Phantom Wallet
        </button>
        <WalletMultiButton />
        <label className="block space-y-1 text-sm">
          <span>Run ID</span>
          <input className="fd-input" value={runId} onChange={(e) => setRunId(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Towns served (comma-separated)</span>
          <input className="fd-input" value={towns} onChange={(e) => setTowns(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Events faced (comma-separated)</span>
          <input className="fd-input" value={events} onChange={(e) => setEvents(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Timestamp</span>
          <input
            className="fd-input"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onTime}
            onChange={(e) => setOnTime(e.target.checked)}
          />
          On-time delivery
        </label>
        <button onClick={mintProof} disabled={loading} className="fd-button">
          {loading ? "Submitting..." : "Mint Proof-of-Delivery (Devnet)"}
        </button>
        {signature && (
          <div className="rounded-md border border-green-400/40 bg-green-400/10 p-3 text-sm">
            <p>Signature: {signature}</p>
            <a href={explorerLink} target="_blank" rel="noreferrer" className="underline">
              View on Solana Explorer
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
