// Metered x402 resource server on Hedera, using the "upto" scheme
// (x402-hedera-upto, real npm package v0.1.0) instead of "exact" --
// the primary deliverable of this project.
//
// Endpoint: POST /api/digest -- charges per unit of INPUT actually
// processed, not a fixed price. This is a genuine metered workload
// (word-frequency digest of the submitted text), not a fake counter:
// the price is only known after the text is parsed, matching exactly
// the "LLM tokens / bandwidth / compute" framing the upto scheme spec
// uses. No external paid API is involved, so this runs on nothing but
// a funded Hedera testnet account -- no OpenAI/Anthropic key needed.
//
// Wire format for this demo: the client's signed PaymentPayload travels
// base64(JSON)-encoded in a `PAYMENT-SIGNATURE` request header (the
// header name the scheme's own spec uses in its 402 error message,
// specs/schemes/upto/scheme_upto_hedera.md). Encoding matches the real
// @x402/core/http encodePaymentSignatureHeader/decodePaymentSignatureHeader
// exactly (confirmed by reading chunk-RAWLCYSQ.mjs directly): plain
// base64(JSON.stringify(paymentPayload)) of the FULL PaymentPayload
// object (x402Version/resource/accepted/payload), not just the inner
// signature fragment -- see src/upto-client-demo.ts for the client side.

import express from "express";
import { x402ResourceServer } from "@x402/core/server";
import { HTTPFacilitatorClient, decodePaymentSignatureHeader } from "@x402/core/http";
import { UptoHederaScheme } from "x402-hedera-upto/upto/server";

const PORT = Number(process.env.UPTO_PORT ?? 3403);
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const PAY_TO = process.env.HEDERA_PAYTO_ACCOUNT_ID;
const ASSET = process.env.UPTO_ASSET_ID ?? "0.0.429274"; // Hedera testnet USDC, per @x402/hedera README
const ASSET_DECIMALS = Number(process.env.UPTO_ASSET_DECIMALS ?? 6);
const PROXY_CONTRACT_ID = process.env.UPTO_PROXY_CONTRACT_ID ?? "0.0.9556979"; // Madhav Gupta's live reference deployment, reused -- permissionless proxy, safe to reuse
const PROXY_EVM_ADDRESS = process.env.UPTO_PROXY_EVM ?? "0x000000000000000000000000000000000091d3f3"; // confirmed against the testnet mirror node for 0.0.9556979
const FACILITATOR_URL = process.env.UPTO_FACILITATOR_URL ?? "http://localhost:3404";
const MAX_CEILING_ATOMIC = process.env.UPTO_MAX_CEILING_ATOMIC ?? "500000"; // 0.5 USDC ceiling, atomic units (6 decimals)

if (!PAY_TO) {
  throw new Error("Falta HEDERA_PAYTO_ACCOUNT_ID en .env -- ver .env.example");
}

// Real facilitator client (@x402/core/http), pointed at
// src/upto-facilitator.ts's /verify and /settle endpoints -- confirmed
// against the actual HTTPFacilitatorClient implementation in
// node_modules/@x402/core/dist/esm/chunk-RAWLCYSQ.mjs, not guessed.
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });

const server = new x402ResourceServer(facilitatorClient);
server.register(
  "hedera:*",
  new UptoHederaScheme({
    defaultAssets: {
      [NETWORK]: { asset: ASSET, decimals: ASSET_DECIMALS },
    },
  }),
);

const app = express();
app.use(express.text({ type: "*/*", limit: "256kb" }));

function paymentRequired(resourceUrl: string) {
  return {
    x402Version: 2,
    error: "PAYMENT-SIGNATURE header is required",
    resource: {
      url: resourceUrl,
      description: "Metered word-frequency digest, priced per word actually processed",
      mimeType: "application/json",
    },
    accepts: [
      {
        scheme: "upto",
        network: NETWORK,
        amount: MAX_CEILING_ATOMIC,
        asset: ASSET,
        payTo: PAY_TO,
        maxTimeoutSeconds: 300,
        extra: {
          feePayer: process.env.UPTO_FACILITATOR_ACCOUNT_ID ?? "0.0.UNSET",
          facilitatorEvm: process.env.UPTO_FACILITATOR_EVM ?? "0xUNSET",
          proxy: PROXY_EVM_ADDRESS,
          verifyingContract: PROXY_EVM_ADDRESS,
          proxyContractId: PROXY_CONTRACT_ID,
          chainId: NETWORK === "hedera:mainnet" ? 295 : 296,
          domainName: "x402-upto-hedera",
          domainVersion: "1",
        },
      },
    ],
  };
}

/**
 * The metered "work": a word-frequency digest. Real, deterministic,
 * variable-cost -- the price (1 atomic unit per word processed) is only
 * knowable after parsing the input, which is exactly what makes `upto`
 * the right scheme here instead of `exact`.
 */
function digest(text: string): { wordCount: number; topWords: [string, number][] } {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const topWords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  return { wordCount: words.length, topWords };
}

app.post("/api/digest", async (req, res) => {
  const resourceUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const header = req.get("PAYMENT-SIGNATURE");

  if (!header) {
    return res.status(402).json(paymentRequired(resourceUrl));
  }

  let paymentPayload: unknown;
  try {
    paymentPayload = decodePaymentSignatureHeader(header);
  } catch {
    return res.status(400).json({ error: "malformed PAYMENT-SIGNATURE header" });
  }

  const requirements = paymentRequired(resourceUrl).accepts[0];

  const verified = await server.verifyPayment(paymentPayload as never, requirements as never);
  if (!verified.isValid) {
    return res.status(402).json({ error: "payment verification failed", detail: verified.invalidReason });
  }

  // Do the real work, THEN price it -- this is the whole point of `upto`.
  const text = String(req.body ?? "");
  const result = digest(text);
  const actualAtomic = String(result.wordCount); // 1 atomic unit per word, toy pricing for the demo

  const settled = await server.settlePayment(
    paymentPayload as never,
    requirements as never,
    undefined,
    undefined,
    { amount: actualAtomic },
  );

  if (!settled.success) {
    return res.status(402).json({ error: "settlement failed", detail: settled.errorReason });
  }

  return res.json({ ...result, settlement: settled });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, network: NETWORK, payTo: PAY_TO, asset: ASSET, proxyContractId: PROXY_CONTRACT_ID });
});

app.listen(PORT, () => {
  console.log(`upto-server escuchando en :${PORT} (${NETWORK}), proxy ${PROXY_CONTRACT_ID}`);
});
