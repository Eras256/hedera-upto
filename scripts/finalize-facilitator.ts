// One-time finalization for the FACILITATOR account -- same mechanic as
// setup-upto-client.ts step 1, but the facilitator doesn't need token
// association or an allowance (it never holds the asset, only pays
// network fees for capture()).
import { AccountId, Client, Hbar, PrivateKey, TransferTransaction } from "@hiero-ledger/sdk";

const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const FACILITATOR_PRIVATE_KEY = process.env.UPTO_FACILITATOR_PRIVATE_KEY;
const KNOWN_ACCOUNT_ID = process.env.UPTO_FACILITATOR_KNOWN_ACCOUNT_ID;

if (!FACILITATOR_PRIVATE_KEY || !KNOWN_ACCOUNT_ID) {
  throw new Error("Falta UPTO_FACILITATOR_PRIVATE_KEY / UPTO_FACILITATOR_KNOWN_ACCOUNT_ID en .env");
}

async function main() {
  const key = PrivateKey.fromStringECDSA(FACILITATOR_PRIVATE_KEY!);
  const client = NETWORK === "hedera:mainnet" ? Client.forMainnet() : Client.forTestnet();
  const accountId = AccountId.fromString(KNOWN_ACCOUNT_ID!);
  client.setOperator(accountId, key);

  console.log("Finalizando cuenta hollow del facilitador con un self-transfer de 1 tinybar...");
  const tx = await new TransferTransaction()
    .addHbarTransfer(accountId, Hbar.fromTinybars(-1))
    .addHbarTransfer(accountId, Hbar.fromTinybars(1))
    .execute(client);
  const receipt = await tx.getReceipt(client);
  console.log("Status:", receipt.status.toString());
  console.log("TX:", tx.transactionId.toString());
  client.close();
}

main().catch(err => {
  console.error("Fallo:", err);
  process.exitCode = 1;
});
