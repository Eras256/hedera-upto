---
name: agentic-payments-hedera
description: >
  x402 agentic payments on Hedera -- the "exact" (fixed-price) and
  "upto" (metered/variable-price) schemes, the real npm packages
  (@x402/hedera, x402-hedera-upto), the X402UptoProxy contract, the
  HTS custom-fee underpayment gotcha found and fixed in
  x402-foundation/x402#3061, and the real version-compatibility trap
  between x402-hedera-upto and @x402/core. Everything here was built
  and verified end-to-end on Hedera testnet in this project (real
  settlement transactions, real upstream contributions), not assumed
  from documentation. Use when building or reviewing an x402-gated
  service on Hedera, when an AI agent needs to pay per request in
  HBAR/HTS, when debugging an x402/Hedera facilitator, or when
  deciding between the exact and upto schemes for a new resource.
allowed-tools: [Read, Edit, Write, Grep, Glob, Bash, WebFetch, WebSearch]
---

# x402 agentic payments on Hedera

Verified end-to-end in this project (`hedera-upto`), 2026-09-11/12:
real testnet settlements, a real upstream bug found/fixed
(x402-foundation/x402#3061), a real upstream evaluation
(x402-foundation/x402#2919), and a real dependency-compatibility fix
(Madhav-Gupta-28/Tally#1). Everything below traces to one of those, or
to primary docs read directly -- nothing here is assumed by analogy
with x402 on another chain.

## Two schemes, pick based on whether the price is known up front

- **`exact`** -- fixed price, known before the work runs. Hedera
  contributed this scheme to the x402 standard directly (HBAR + HTS).
  Official package: `@x402/hedera` (x402 Foundation, Apache-2.0).
- **`upto`** -- variable/metered price (LLM tokens, bandwidth, compute)
  -- the client authorizes a **maximum**, the resource server does the
  work, discovers the **actual** cost, and the facilitator settles
  that actual amount. Community package: `x402-hedera-upto` (Madhav
  Gupta / Tally, real repo `github.com/Madhav-Gupta-28/Tally`), the
  first non-EVM `upto` implementation (`upto` previously existed only
  for EVM via Permit2). **This is the scheme to reach for whenever the
  price can't be known before the request is served** -- `exact`
  forces quoting worst-case.

If unsure which one a new resource needs: if you can state the price
in the 402 response before doing any work, use `exact`. If the price
depends on what happens during the request, use `upto`.

## SDK: `@hiero-ledger/sdk`, not `@hashgraph/sdk`

Hedera migrated to the Hiero namespace (Linux Foundation Decentralized
Trust). `@hashgraph/sdk` dual-published alongside `@hiero-ledger/sdk`
from 2.70.0 through 2.82.0; **from 2.83.0 onward, new releases ship
only under `@hiero-ledger/sdk`**. Verified 2026-09-11 against
`hedera.com/blog/namespace-transition-announcement-hedera-projects-moving-to-hiero`
and `github.com/hiero-ledger/hiero-sdk-js`. `@x402/hedera` and
`x402-hedera-upto` both already depend on `@hiero-ledger/sdk`
internally and re-export a curated subset of its primitives -- prefer
those re-exports over installing `@hiero-ledger/sdk` directly
alongside them, or you get two on-disk SDK installs and internal
`instanceof` checks throw `t.startsWith is not a function`.

## The `exact` scheme, wire format

Client builds a `TransferTransaction` (HBAR or HTS), partially signs it
(not the fee), sets `transactionId.accountId` to the facilitator's
account (`extra.feePayer`), base64-encodes it. Facilitator adds its own
signature as fee payer, submits. Real spec:
`x402-foundation/x402` repo, `specs/schemes/exact/scheme_exact_hedera.md`.

**Verify() MUST check (per spec, security-critical):** transaction is a
bare `TransferTransaction` (not wrapped), fee payer isn't a net sender,
net HBAR/asset transfer sums to zero, amount to `payTo` matches exactly,
and (added after a real hardening PR, x402-foundation/x402#2707) the
payer's signature is verified against their actual on-chain key read
from the **Mirror Node** (not a paid consensus-node query) -- a
`wrongPrivateKey`/`unsignedTx` payload previously passed verify() and
only failed at settle() with `INVALID_SIGNATURE`.

## The HTS custom-fee underpayment gap -- real bug, found and fixed here

**This project found and confirmed (x402-foundation/x402#3061,
independently reproduced, not just read from the PR description) that
the pre-fix facilitator never verified the payee's *effective* net
credit** -- only that the transaction reached consensus with a SUCCESS
receipt. For an HTS token with a custom fee assessed to the receiver
(Hedera's default: "the receiver pays the custom fee and gets the
remaining balance"), a resource server could be told a payment of 1000
settled successfully while it actually received 950 (50 to the fee
collector).

**Root cause, confirmed by reading the real code:** `verify()` only
inspects the client's *declared* transfer legs, which show the nominal
pre-fee amount (custom fees aren't declared client-side, they're
assessed by consensus nodes from the token's fee schedule). The
signer's `signAndSubmitTransaction` only awaited `getReceipt()`, never
`getRecord()` -- so no effective-balance data ever reached settle().

**The fix (validated by re-running the real end-to-end flow, not just
reading the diff):** after `execute()`, also call
`response.getRecord(client)`, flatten its actual token/HBAR transfers,
and confirm the net credit to `payTo` equals `requirements.amount`
exactly before reporting success. **If your resource charges in a
custom-fee HTS token, confirm your facilitator implementation does
this record-based check** -- don't trust receipt status alone.

## `upto` scheme: `X402UptoProxy` and the flow

Client grants `X402UptoProxy` an HTS allowance once (`AccountAllowanceApproveTransaction`,
HIP-336) -- after that, every payment costs one off-chain EIP-712
signature, no gas, no transaction from the client. Facilitator submits
`capture(authorization, signature, actualAmount)`, paying the network
fee; the contract enforces: single-use nonce, time bounds
(`validAfter`/`deadline`), recipient binding, `actualAmount <=
maxAmount`, and that only the named facilitator (`msg.sender ==
authorization.facilitator`) can settle. Verified deployed and live:
testnet contract `0.0.9556979` (long-zero `0x...91d3f3`), admin-less
Solidity (no owner-gated function), reused directly in this project
rather than redeployed -- see `investigacion/upto-scheme-evaluacion.md`
for the due-diligence on why reusing it is safe (one open question:
the account's HAPI-level `admin_key` is non-empty, unresolved whose key
it is -- flagged, not confirmed clean).

**Constraints, confirmed against spec + code:**
- HBAR (`0.0.0`) is **not supported** for `upto` -- HTS fungible tokens
  only. An HBAR allowance isn't reachable through the ERC-20 facade.
- Client account **must be ECDSA with an EVM alias** -- `ecrecover`
  needs the alias form; an ED25519 account can't sign an authorization.
- Only asset transfer method today: `cryptoTransfer` via the HTS
  ERC-20 facade (HIP-376) -- requires the signing key to directly
  control the debited funds. Doesn't work for funds under a smart
  contract's control (a `transferExecutor` method is proposed,
  x402-foundation/x402#3010 issue, PR #3205 spec-only and in active
  review as of 2026-09-12 -- check its current status before assuming
  it's still unmerged).
- No `upto`-style scheme existed for a metered price before this
  (issue #2918/#2919, stalled ~7 weeks as of 2026-09-11 on a Vercel
  preview-authorization check unrelated to code quality, not a
  technical rejection -- evaluated in `investigacion/upto-scheme-evaluacion.md`).

## Real, currently-published version incompatibility -- verify before using latest `@x402/core`

**`x402-hedera-upto@0.1.0` (the only version published as of
2026-09-12) breaks against `@x402/core >=2.22.0`** with
`TypeError: Cannot read properties of undefined (reading 'undefined')`
in `resolvePaymentFlow`. Root cause, confirmed by reading the real
source: `@x402/core@2.22.0` (PR x402-foundation/x402#3053, commit
`db5da2e`) made `paymentFlows`/`defaultAssetTransferMethod` required on
every `SchemeNetworkServer`; `UptoHederaScheme` (server side) never
declared them. **Fix proposed and validated twice with real execution**
(patched locally, reinstalled `@x402/core@2.25.0`, re-ran the full
testnet flow, got a second real settlement) -- PR
`Madhav-Gupta-28/Tally#1`. Until that merges and a new version
publishes, **pin `@x402/core` to `2.21.0`** if using `x402-hedera-upto`
directly (check the PR's merge status before assuming this pin is
still needed).

## Facilitator: you must run your own for `upto`

"No public Hedera facilitator supports upto today" (package README,
verified). This project's `src/upto-facilitator.ts` is a real, working
standalone facilitator -- wire protocol confirmed against `@x402/core`'s
actual `HTTPFacilitatorClient` implementation (`POST /verify`, `POST
/settle`, body `{x402Version, paymentPayload, paymentRequirements}`),
not guessed. For `exact`, Blocky402 (`blocky402.com`) is cited by
Hedera's own docs as a reference facilitator -- confirm its current
network coverage (testnet vs mainnet) before depending on it, that
distinction wasn't fully confirmed as of the last check.

## Where the real, working reference code lives

`hedera-upto` repo (this project): `src/upto-server.ts`,
`src/upto-facilitator.ts`, `src/upto-orchestrator.ts` +
`src/upto-ui-server.ts` (web UI), `scripts/setup-upto-client.ts`
(hollow-account finalization, token association, allowance approval --
note the real gotcha found running this: a brand-new alias-form
account can't be its own transaction payer at precheck,
`PAYER_ACCOUNT_NOT_FOUND`, even though it resolves fine by mirror-node
query -- use the real `0.0.x` id once known, not the alias form).

## Legal note, not exhaustive here

Running a facilitator raises a real, unresolved question under Mexican
LFPIORPI (Art. 24 Bis 4 of the Reglas de Caracter General, not the Law
itself) about whether it counts as "facilitacion" of virtual-asset
operations, regardless of non-custody. See `_strategy/legal/mexico.md`
for the full analysis (hypothesis, not confirmed) -- do not extend the
non-custodial argument to a new resource/facilitator without reading
that file's actual reasoning first.
