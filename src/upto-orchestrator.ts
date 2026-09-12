// Reusable orchestrator for the real x402 "upto" client flow -- same
// logic as src/upto-client-demo.ts (401->sign->retry->settle), factored
// out so it can be driven from the CLI demo AND from the web UI
// (src/upto-ui-server.ts) without duplicating the signing/wire-protocol
// code. Nothing here is a mock: it makes real HTTP calls to the real
// upto-server + upto-facilitator, and produces a real Hedera testnet
// settlement.
//
// The private key stays server-side always -- see src/README.md for
// why the UI never asks the browser for one.

import { x402Client } from "@x402/core/client";
import { x402HTTPClient, encodePaymentSignatureHeader } from "@x402/core/http";
import { PrivateKey } from "@hiero-ledger/sdk";
import { createUptoClientSigner } from "x402-hedera-upto";
import { UptoHederaScheme } from "x402-hedera-upto/upto/client";

export type TraceStep = {
  label: string;
  detail?: unknown;
  at: string; // ISO timestamp, for the UI to show real elapsed time
};

export type MeteredRunResult = {
  ok: boolean;
  steps: TraceStep[];
  digest?: { wordCount: number; topWords: [string, number][] };
  settlement?: {
    success: boolean;
    transaction?: string;
    amount?: string;
    errorReason?: string;
  };
  hashscanUrl?: string;
  error?: string;
};

const SERVER_URL = process.env.UPTO_SERVER_URL ?? "http://localhost:3403";
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";

function now() {
  return new Date().toISOString();
}

/**
 * Runs one full metered request against the real upto-server, using a
 * server-held demo client key to produce a real EIP-712 signature.
 * Returns a step-by-step trace for the UI to render, not just the
 * final result -- the point of this endpoint is to make the real
 * protocol flow visible, not to hide it behind a spinner.
 */
export async function runMeteredRequest(text: string): Promise<MeteredRunResult> {
  const steps: TraceStep[] = [];
  const push = (label: string, detail?: unknown) => steps.push({ label, detail, at: now() });

  const clientAccountId = process.env.UPTO_CLIENT_ACCOUNT_ID;
  const clientPrivateKey = process.env.UPTO_CLIENT_PRIVATE_KEY;
  if (!clientAccountId || !clientPrivateKey) {
    return {
      ok: false,
      steps,
      error: "Falta UPTO_CLIENT_ACCOUNT_ID / UPTO_CLIENT_PRIVATE_KEY en el .env del servidor",
    };
  }

  try {
    const signer = createUptoClientSigner(
      clientAccountId,
      PrivateKey.fromStringECDSA(clientPrivateKey),
      { network: NETWORK },
    );
    const client = new x402Client().register("hedera:*", new UptoHederaScheme(signer));
    const http = new x402HTTPClient(client);

    push("Enviando la primera solicitud, sin pago todavia");
    const first = await fetch(`${SERVER_URL}/api/digest`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: text,
    });

    if (first.status !== 402) {
      const body = await first.text();
      push("Respuesta inesperada (se esperaba 402)", { status: first.status, body });
      return { ok: false, steps, error: `El servidor respondio ${first.status}, no 402` };
    }

    const paymentRequired = await first.json();
    const accepted = paymentRequired.accepts?.[0];
    push("402 recibido -- techo maximo autorizado", {
      amount: accepted?.amount,
      asset: accepted?.asset,
      network: accepted?.network,
    });

    push("Firmando autorizacion EIP-712 off-chain (sin gas, sin transaccion)");
    const paymentPayload = await http.createPaymentPayload(paymentRequired);

    push("Reintentando con la autorizacion firmada -- el servidor va a hacer el trabajo real y cobrar el monto real");
    const second = await fetch(`${SERVER_URL}/api/digest`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "PAYMENT-SIGNATURE": encodePaymentSignatureHeader(paymentPayload),
      },
      body: text,
    });

    const result = await second.json();

    if (second.status !== 200 || !result.settlement?.success) {
      push("Settlement fallido", result);
      return { ok: false, steps, error: result.error ?? result.settlement?.errorReason ?? "settlement failed" };
    }

    push("Settlement real confirmado en Hedera testnet", result.settlement);

    return {
      ok: true,
      steps,
      digest: { wordCount: result.wordCount, topWords: result.topWords },
      settlement: result.settlement,
      hashscanUrl: result.settlement.transaction
        ? `https://hashscan.io/testnet/transaction/${result.settlement.transaction}`
        : undefined,
    };
  } catch (err) {
    push("Error inesperado", String(err));
    return { ok: false, steps, error: err instanceof Error ? err.message : String(err) };
  }
}
