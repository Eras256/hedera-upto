// Standalone facilitator process for the "upto" scheme on Hedera.
// README for x402-hedera-upto is explicit: "No public Hedera facilitator
// supports upto today, so you must run your own" -- this is that.
//
// Wire protocol matches @x402/core's real HTTPFacilitatorClient exactly
// (confirmed by reading node_modules/@x402/core/dist/esm/chunk-RAWLCYSQ.mjs
// directly, not assumed): POST /verify and POST /settle, both with body
// { x402Version, paymentPayload, paymentRequirements }, responding with
// the scheme's own VerifyResponse / SettleResponse shape.
//
// Reuses the existing public X402UptoProxy deployment (0.0.9556979) from
// x402-foundation/x402#2919's author (Madhav Gupta / Tally) instead of
// deploying a new proxy -- valid because the proxy is permissionless by
// design (the authorized facilitator is named in the CLIENT's signature,
// not in contract storage, so any facilitator account can be used against
// the same deployed proxy). See investigacion/upto-scheme-evaluacion.md.

import express from "express";
import { PrivateKey } from "@hiero-ledger/sdk";
import { UptoHederaScheme } from "x402-hedera-upto/upto/facilitator";
import { createUptoFacilitatorSigner } from "x402-hedera-upto";

const PORT = Number(process.env.UPTO_FACILITATOR_PORT ?? 3404);
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const FACILITATOR_ACCOUNT_ID = process.env.UPTO_FACILITATOR_ACCOUNT_ID;
const FACILITATOR_PRIVATE_KEY = process.env.UPTO_FACILITATOR_PRIVATE_KEY;
const PROXY_CONTRACT_ID = process.env.UPTO_PROXY_CONTRACT_ID ?? "0.0.9556979";

if (!FACILITATOR_ACCOUNT_ID || !FACILITATOR_PRIVATE_KEY) {
  throw new Error(
    "Falta UPTO_FACILITATOR_ACCOUNT_ID / UPTO_FACILITATOR_PRIVATE_KEY en .env -- " +
      "ver .env.example. Esta cuenta necesita HBAR de testnet para pagar el fee de red " +
      "de cada capture().",
  );
}

const signer = createUptoFacilitatorSigner(
  FACILITATOR_ACCOUNT_ID,
  PrivateKey.fromStringECDSA(FACILITATOR_PRIVATE_KEY),
  { proxyContractId: PROXY_CONTRACT_ID },
);

const scheme = new UptoHederaScheme(signer, {
  proxyContractId: PROXY_CONTRACT_ID,
  chainId: NETWORK === "hedera:mainnet" ? 295 : 296,
  facilitatorEvm: process.env.UPTO_FACILITATOR_EVM, // see scripts/print-facilitator-evm.ts to derive this
});

const app = express();
app.use(express.json({ limit: "256kb" }));

app.post("/verify", async (req, res) => {
  try {
    const { paymentPayload, paymentRequirements } = req.body ?? {};
    const result = await scheme.verify(paymentPayload, paymentRequirements);
    res.status(result.isValid ? 200 : 402).json(result);
  } catch (err) {
    res.status(500).json({ isValid: false, invalidReason: "facilitator_error", payer: "", detail: String(err) });
  }
});

app.post("/settle", async (req, res) => {
  try {
    const { paymentPayload, paymentRequirements } = req.body ?? {};
    const result = await scheme.settle(paymentPayload, paymentRequirements);
    res.status(result.success ? 200 : 402).json(result);
  } catch (err) {
    res.status(500).json({ success: false, errorReason: "facilitator_error", transaction: "", network: NETWORK, detail: String(err) });
  }
});

app.get("/supported", (_req, res) => {
  res.json({ kinds: [{ scheme: "upto", network: NETWORK }] });
});

app.listen(PORT, () => {
  console.log(`upto-facilitator escuchando en :${PORT}, proxy ${PROXY_CONTRACT_ID} en ${NETWORK}`);
});
