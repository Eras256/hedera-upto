---
name: hedera-dev
description: >
  End-to-end Hedera development fundamentals: the official SDK
  (`@hiero-ledger/sdk`, not `@hashgraph/sdk`), testnet/mainnet/
  previewnet, mirror node vs consensus node vs JSON-RPC relay
  endpoints, accounts and keys, and the real USD-pegged fee model
  (HIP-1261 Simple Fees, live on mainnet since v0.73/June 2026). Use
  when starting any new Hedera integration, choosing which SDK/package
  to install, picking an endpoint to query against, or explaining how
  Hedera fees actually work to someone used to Ethereum gas auctions.
allowed-tools: [Read, Edit, Write, Grep, Glob, Bash, WebFetch, WebSearch]
---

# Hedera development fundamentals

Verified 2026-09-11/12 against official docs, `registry.npmjs.org`,
and live search -- not assumed by analogy with another chain.

## SDK: `@hiero-ledger/sdk`, not `@hashgraph/sdk`

Hedera migrated its projects to the **Hiero** namespace (Linux
Foundation Decentralized Trust). Dual-publishing under both
`@hashgraph/sdk` and `@hiero-ledger/sdk` ran from v2.70.0 through
v2.82.0; **from v2.83.0 onward, new releases ship only under
`@hiero-ledger/sdk`**. Verified: `@hashgraph/sdk` (legacy) last at
2.81.0, `@hiero-ledger/sdk` (current) already ahead at 2.88.0. **Use
`@hiero-ledger/sdk` for any new code.** Source:
`hedera.com/blog/namespace-transition-announcement-hedera-projects-moving-to-hiero`,
`github.com/hiero-ledger/hiero-sdk-js`.

Alternative for agent-building specifically: **Hedera Agent Kit**
(`hashgraph/hedera-agent-kit-js`, real repo, active) -- not
investigated in depth in this project; confirm it's on the Hiero
namespace before installing.

## Three networks, real differences

- **Mainnet** -- real HBAR, real cost.
- **Testnet** -- free, funded via `portal.hedera.com/faucet` (accepts
  an EVM address directly, no portal signup required -- auto-creates a
  hollow account, see the account-lifecycle note below).
- **Previewnet** -- early feature access, ahead of testnet.

## Three kinds of endpoint -- know which one you actually need

- **Consensus nodes** -- where transactions are submitted. The SDK
  talks to these directly for `execute()`.
- **Mirror nodes** -- REST API for querying state/history (balances,
  transactions, account info). Official: `testnet.mirrornode.hedera.com`,
  `mainnet-public.mirrornode.hedera.com`, `previewnet.mirrornode.hedera.com`.
  **Prefer mirror-node reads over paid consensus-node queries** where
  the data is available there -- it's free and, for some checks (like
  verifying a payer's actual signing key), it's also the more reliable
  data source since consensus-node token data isn't always current.
- **JSON-RPC relay** (EVM compatibility, e.g. Hashio) -- for
  Ethereum-tooling compatibility (`eth_call`, etc.). **Community-hosted,
  not official Hedera infrastructure.** Testnet
  `testnet.hashio.io/api` (chain 296), mainnet `mainnet.hashio.io/api`
  (chain 295). For anything requiring fresh state (e.g. replay-nonce
  checks), don't trust a relay's `eth_call` -- it can simulate against
  slightly stale state; read from a mirror node or consensus node
  instead.

## Accounts, keys, and the hollow-account gotcha

An ECDSA key with an EVM alias, funded via the anonymous testnet
faucet, creates a **hollow account** -- it has a real account ID and a
balance, but `key: null` until it signs its own first transaction as
payer. **Real gotcha found running this in practice:** using the
alias-form account ID (`AccountId.fromEvmAddress(...)`) as the payer
for that finalizing transaction can fail at precheck with
`PAYER_ACCOUNT_NOT_FOUND`, even though the account already resolves
fine via mirror-node queries. Fix: once you know the real `0.0.x` id
(from a mirror-node lookup), use that directly as the operator instead
of resolving through the alias form.

## Fees: USD-denominated, paid in HBAR, deterministic since HIP-1261

Hedera fees are set in USD and converted to HBAR at execution time via
an exchange-rate file the network updates hourly -- **not** an
Ethereum-style gas auction. **HIP-1261 "Simple Fees"** (a unified
base + extras USD schedule) shipped to **mainnet in v0.73, June 2026**
-- confirmed live, not speculative, as of this writing. Smart-contract
transactions specifically (`ContractCall`, `ContractCreate`,
`EthereumTransaction`) are metered in gas (reported in weibar, 1
tinybar = 10^10 weibar, minimum 21,000 gas per call) -- see
`hedera-smart-contracts` skill for detail. All other transaction types
use the base+extras USD fee model directly, no gas involved.

## Brand/trademark -- quick reference

"Hedera" capitalized, networks lowercase ("Hedera testnet"). "HBAR"
always uppercase, singular. "tinybars" lowercase, plural. It's
"hashgraph" (a DLT), never "blockchain". Never fold "Hedera"/"HBAR"/
"Hashgraph" into your own product/domain name. Full detail:
`tecnico/technical-reference.md` in this project.
