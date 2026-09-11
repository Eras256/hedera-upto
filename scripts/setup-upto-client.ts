// One-time setup for the CLIENT account before src/upto-client-demo.ts
// can run. Run this once, after funding UPTO_CLIENT_EVM via
// https://portal.hedera.com/faucet (no login needed -- paste the EVM
// address, it auto-creates a hollow account and sends 100 testnet HBAR).
//
// Three real on-chain steps, in order:
//   1. Finalize the hollow account: the first transaction an alias
//      account pays for itself resolves it to a real 0.0.x account id
//      (docs.hedera.com/evm/quickstart/get-test-hbar). A trivial
//      self-transfer of 1 tinybar does this.
//   2. Associate the client with the payment asset (HTS requires
//      explicit association before an account can hold a token) --
//      see @x402/hedera's README section on token association.
//   3. Grant X402UptoProxy an HTS allowance (HIP-336) covering the
//      ceilings the client intends to sign -- Phase 1 of the upto
//      scheme, see specs/schemes/upto/scheme_upto_hedera.md.
//
// Run with: npx tsx scripts/setup-upto-client.ts

import {
  AccountAllowanceApproveTransaction,
  AccountId,
  Client,
  Hbar,
  PrivateKey,
  TokenAssociateTransaction,
  TokenId,
  TransferTransaction,
} from "@hiero-ledger/sdk";

const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const ASSET = process.env.UPTO_ASSET_ID ?? "0.0.429274";
const PROXY_CONTRACT_ID = process.env.UPTO_PROXY_CONTRACT_ID ?? "0.0.9556979";
const CLIENT_EVM = process.env.UPTO_CLIENT_EVM;
const CLIENT_PRIVATE_KEY = process.env.UPTO_CLIENT_PRIVATE_KEY;
const ALLOWANCE_CEILING = process.env.UPTO_ALLOWANCE_CEILING_ATOMIC ?? "5000000"; // 5 USDC total ceiling

if (!CLIENT_EVM || !CLIENT_PRIVATE_KEY) {
  throw new Error("Falta UPTO_CLIENT_EVM / UPTO_CLIENT_PRIVATE_KEY en .env");
}

async function main() {
  const key = PrivateKey.fromStringECDSA(CLIENT_PRIVATE_KEY!);
  const client =
    NETWORK === "hedera:mainnet" ? Client.forMainnet() : Client.forTestnet();

  // Step 1: resolve the alias to a real account id and finalize the
  // hollow account with a trivial self-paid transaction.
  const aliasAccountId = AccountId.fromEvmAddress(0, 0, CLIENT_EVM!.replace(/^0x/, ""));
  client.setOperator(aliasAccountId, key);

  console.log("Finalizando cuenta hollow con un self-transfer de 1 tinybar...");
  const finalizeTx = await new TransferTransaction()
    .addHbarTransfer(aliasAccountId, Hbar.fromTinybars(-1))
    .addHbarTransfer(aliasAccountId, Hbar.fromTinybars(1))
    .execute(client);
  const finalizeReceipt = await finalizeTx.getReceipt(client);
  console.log("Status:", finalizeReceipt.status.toString());

  // Once finalized, query the real account id (no longer just the alias).
  const record = await finalizeTx.getRecord(client);
  const realAccountId = record.transactionId.accountId;
  console.log("Cuenta real resuelta:", realAccountId?.toString());
  client.setOperator(realAccountId!, key);

  // Step 2: associate with the payment asset.
  console.log(`Asociando ${ASSET}...`);
  const assocTx = await new TokenAssociateTransaction()
    .setAccountId(realAccountId!)
    .setTokenIds([TokenId.fromString(ASSET)])
    .execute(client);
  console.log("Status:", (await assocTx.getReceipt(client)).status.toString());

  // Step 3: grant the proxy an allowance covering the intended ceiling.
  console.log(`Aprobando allowance de ${ALLOWANCE_CEILING} a proxy ${PROXY_CONTRACT_ID}...`);
  const approveTx = await new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(
      TokenId.fromString(ASSET),
      realAccountId!,
      AccountId.fromString(PROXY_CONTRACT_ID),
      Number(ALLOWANCE_CEILING),
    )
    .execute(client);
  console.log("Status:", (await approveTx.getReceipt(client)).status.toString());

  console.log(`\nListo. Poner UPTO_CLIENT_ACCOUNT_ID=${realAccountId?.toString()} en .env`);
  client.close();
}

main().catch(err => {
  console.error("Setup fallo:", err);
  process.exitCode = 1;
});
