---
name: hedera-smart-contracts
description: >
  Hedera Smart Contract Service (HSCS) -- full EVM compatibility via a
  Besu EVM component, Solidity contracts, the real gas/fee model
  (weibar, minimum 21,000 gas, USD-pegged), and the HTS system
  contract precompile (0x167) for calling native Hedera tokens from
  Solidity. Use when writing, deploying, or reviewing a Solidity
  contract on Hedera, when a contract needs to interact with an HTS
  token, or when estimating/debugging gas costs on Hedera.
allowed-tools: [Read, Edit, Write, Grep, Glob, Bash, WebFetch, WebSearch]
---

# Hedera Smart Contract Service (HSCS)

Verified 2026-09-12 against official Hedera docs and search --
Hedera-specific details, not assumed from plain Ethereum knowledge.

## Real EVM compatibility, not an approximation

Hedera Smart Contract Service runs the **EVM component of Besu**
(Hyperledger's Ethereum client) directly on the network -- "full
Ethereum compatibility without operating an Ethereum node." Standard
Solidity contracts deploy and run largely unmodified. Differences from
plain Ethereum are concentrated in gas/fee mechanics and in the extra
HTS system contract available (below) -- not in the EVM opcode
semantics themselves.

## Gas and fees -- real, Hedera-specific mechanics

- Gas usage for EVM operations is reported in **weibar** (HIP-410): `1
  tinybar = 10^10 weibar`.
- **Only `ContractCall`, `ContractCreate`, and `EthereumTransaction`
  use gas.** Every other contract-related transaction type
  (`ContractDelete`, `ContractGetInfo`, etc.) uses the standard
  base+extras USD fee model instead (see `hedera-dev` skill) -- don't
  assume every contract interaction is gas-metered.
- **Minimum fixed cost of 21,000 gas per call**, same floor as
  Ethereum, plus per-opcode costs on top depending on what actually
  executes.
- Fees are **predictable and USD-pegged**, converted to HBAR at
  execution time -- there's no gas-price auction/mempool competition
  to model, unlike Ethereum under load.

## The HTS system contract -- calling native tokens from Solidity

Hedera Token Service exposes a **precompiled system contract at
address `0x167`** (HIP-206) so a Solidity contract can create and
operate native Hedera tokens (not ERC-20 contracts -- the actual HTS
token type) directly:

```solidity
HederaTokenService constant hts = HederaTokenService(0x167);
```

Real capability surface (per HIP-206 and the official
`hashgraph/hedera-smart-contracts` reference implementation repo):
**transfer, mint, burn, associate, and dissociate** are the core calls
exposed. This is how a contract-controlled treasury or a DeFi protocol
built on Hedera moves HTS tokens without needing an ERC-20 wrapper.

**Relevant to this project's x402 work:** the `upto` scheme's only
supported asset-transfer method today (`cryptoTransfer` via the HTS
ERC-20 facade, HIP-376 -- a different, narrower facade than the full
HIP-206 precompile) requires the *signing key* to directly control the
debited funds -- it doesn't work for funds held by a smart contract.
A proposed `transferExecutor` method (x402-foundation/x402#3010/#3205)
would use something closer to this system-contract path instead. See
`agentic-payments-hedera` skill.

## Where to go deeper (not investigated in this project yet)

- Contract storage/state rent mechanics (`docs.hedera.com` "rent"
  pages) -- not verified in detail here.
- Upgrade patterns (proxy patterns, `CREATE2`, etc.) on Hedera
  specifically -- standard Solidity patterns are expected to work
  given the Besu-based EVM, but this project hasn't verified any
  Hedera-specific caveat around them.
