---
name: hedera-security-review
description: >
  Hedera-specific security patterns and real gotchas found in this
  project -- the HTS custom-fee underpayment gap (x402-foundation/
  x402#3061), alias auto-account-creation cost abuse, the powerful and
  irreversible HTS key model, token-association as a failure/DoS
  vector, and an unresolved real question about a reused contract's
  admin_key. Use when reviewing any Hedera-touching code for security
  issues, before reusing someone else's deployed contract, or before
  trusting a transaction's receipt status as proof of correct
  settlement.
allowed-tools: [Read, Edit, Write, Grep, Glob, Bash, WebFetch, WebSearch]
---

# Hedera-specific security review patterns

Every item here is a real, found-and-confirmed issue in this project
or a real, documented spec gap -- not a generic "be careful" list.

## 1. Receipt SUCCESS is not proof of correct settlement

**Confirmed and fixed upstream (x402-foundation/x402#3061):** a
transaction reaching consensus with a `SUCCESS` receipt only proves it
executed -- it does **not** prove the receiver got the amount they
were told to expect. HTS custom fees are assessed by consensus nodes
from the token's fee schedule, invisible in the client's declared
transaction. **If your code trusts `receipt.status === SUCCESS` alone
to confirm a payment, and the asset can have a custom fee, you have
this gap.** The fix: fetch the transaction *record* (not just the
receipt) after execution and verify the actual net credit to the
intended recipient. Full detail: `agentic-payments-hedera` skill.

## 2. Alias auto-account-creation can be used to drain a sponsor's HBAR

If your service accepts a `payTo`/destination as an EVM-alias rather
than an existing account ID, sending value to that alias for the first
time **auto-creates a new account** -- and whoever pays the network
fee for that transfer effectively pays for the account creation too. A
malicious or careless counterparty could exploit a facilitator that
blindly allows alias destinations to make it repeatedly pay for new
account creation. Real, tracked spec gap:
x402-foundation/x402#3008 (the spec doesn't mandate a policy either
way). **Decide and enforce an explicit `allow`/`reject` policy for
alias destinations** rather than accepting the library default without
reading what it does.

## 3. HTS keys are powerful, irreversible-at-creation, and easy to under-scope

Unlike a single Ethereum contract-owner key, HTS splits control across
up to seven independent key types (admin, supply, KYC, freeze, wipe,
pause, metadata) -- **each set or omitted permanently at creation** (see
`hedera-token-service` skill). A security review of any HTS token
integration should explicitly enumerate which keys exist, who holds
each one, and what a compromise of each one specific key would allow
-- "the treasury account" isn't a complete answer if a Freeze key or
Wipe key is held somewhere less carefully secured than the treasury
itself.

## 4. Token association failures are a real availability/DoS surface

Every HTS transfer to an unassociated account fails on-chain with
`TOKEN_NOT_ASSOCIATED_TO_ACCOUNT` -- a real, common failure mode (not
an edge case) whenever a new counterparty is involved. A service that
doesn't pre-flight-check association before attempting a transfer will
burn a real transaction fee on a guaranteed failure. This is also a
concrete abuse vector: a counterparty that de-associates from a token
mid-flow can deliberately cause your settlement transaction to fail
after you've already done metered work (relevant to `upto`-scheme
resource servers specifically).

## 5. Reusing someone else's deployed contract -- verify the account-level admin_key, not just the Solidity

A contract's Solidity source having "no owner, no admin function"
doesn't fully settle whether the deployment itself is trustless. **This
project found a real, unresolved case**: the reference `X402UptoProxy`
deployment it reuses (Hedera testnet `0.0.9556979`) has a **non-empty
`admin_key`** on its Hedera-level account -- a platform-level field,
independent of the Solidity logic, that could in principle let whoever
holds that key issue a `ContractUpdateTransaction` or
`ContractDeleteTransaction` against that specific instance. Before
trusting a reused deployment as fully trustless, check the account's
`admin_key` via the mirror node (`GET
/api/v1/contracts/{contractId}`), not just the source code -- and if
it's non-empty, treat "no owner in the Solidity" as necessary but not
sufficient. This project's own case is documented, unresolved, in
`investigacion/upto-scheme-evaluacion.md` (private reference).

## Method for finding the next one

Same as items 1 and 2 above: don't trust a package's description or a
spec's prose -- read the real code, check for what it *doesn't*
verify, and reproduce the gap with a real (or realistically mocked)
scenario before calling it a finding. See `hedera-ecosystem-contribution`
skill for the full method.
