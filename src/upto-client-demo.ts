// Client demo for the metered upto-server (src/upto-server.ts). Real
// end-to-end x402 flow: request -> 402 -> sign a ceiling off-chain
// (no transaction, no gas) -> retry -> server does the work -> server
// settles the ACTUAL amount via the facilitator -> real Hedera tx.
//
// Requires a funded Hedera testnet account, ECDSA with an EVM alias
// (per x402-hedera-upto's requirements -- an ED25519 account cannot
// sign an upto authorization), already associated with the payment
// asset and with an allowance already granted to the proxy contract
// (see scripts/setup-upto-client.ts for the one-time allowance step).

import { x402Client } from "@x402/core/client";
import { x402HTTPClient, encodePaymentSignatureHeader } from "@x402/core/http";
import { PrivateKey } from "@hiero-ledger/sdk";
import { createUptoClientSigner } from "x402-hedera-upto";
import { UptoHederaScheme } from "x402-hedera-upto/upto/client";

const SERVER_URL = process.env.UPTO_SERVER_URL ?? "http://localhost:3403";
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const CLIENT_ACCOUNT_ID = process.env.UPTO_CLIENT_ACCOUNT_ID;
const CLIENT_PRIVATE_KEY = process.env.UPTO_CLIENT_PRIVATE_KEY;

if (!CLIENT_ACCOUNT_ID || !CLIENT_PRIVATE_KEY) {
  throw new Error(
    "Falta UPTO_CLIENT_ACCOUNT_ID / UPTO_CLIENT_PRIVATE_KEY en .env -- ver .env.example",
  );
}

async function main() {
  const signer = createUptoClientSigner(
    CLIENT_ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(CLIENT_PRIVATE_KEY!),
    { network: NETWORK },
  );
  // Note: this project pins @x402/core to 2.21.0 (see package.json) --
  // x402-hedera-upto@0.1.0 (the only version published) is incompatible
  // with @x402/core >=2.22.0 (missing `paymentFlows`/
  // `defaultAssetTransferMethod`, required since that version). Fix
  // proposed and verified upstream -- see MEMORY.md and the linked PR
  // against Madhav-Gupta-28/Tally. At 2.21.0 there is no spendControls
  // feature yet (added in 2.23.0), so no setSpendControls(false) call
  // is needed or available.
  const client = new x402Client().register("hedera:*", new UptoHederaScheme(signer));
  const http = new x402HTTPClient(client);

  const text =
    process.argv[2] ??
    "the quick brown fox jumps over the lazy dog the dog barks the fox runs";

  console.log("--- primer request, sin pago ---");
  const first = await fetch(`${SERVER_URL}/api/digest`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });
  console.log("status:", first.status);
  if (first.status !== 402) {
    console.log(await first.text());
    return;
  }
  const paymentRequired = await first.json();
  console.log("402 accepts:", JSON.stringify(paymentRequired.accepts));

  console.log("\n--- firmando autorizacion (off-chain, sin gas) ---");
  const paymentPayload = await http.createPaymentPayload(paymentRequired);

  console.log("\n--- reintentando con PAYMENT-SIGNATURE ---");
  const second = await fetch(`${SERVER_URL}/api/digest`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "PAYMENT-SIGNATURE": encodePaymentSignatureHeader(paymentPayload),
    },
    body: text,
  });
  console.log("status:", second.status);
  const result = await second.json();
  console.log(JSON.stringify(result, null, 2));

  if (result.settlement?.transaction) {
    console.log(
      `\nTX real de settlement: ${result.settlement.transaction} -- verificar en ` +
        `https://hashscan.io/testnet/transaction/${result.settlement.transaction}`,
    );
  }
}

main().catch(err => {
  console.error("Demo fallo:", err);
  process.exitCode = 1;
});
