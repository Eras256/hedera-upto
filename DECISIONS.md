# Decisions -- why this repo is built the way it is

Technical architecture decisions and their reasoning, kept here so
they don't have to be re-derived or guessed by a future contributor.
Strategy, budget, and program-specific context live elsewhere (not in
this public repo) -- this file is technical reasoning only.

## `upto` (metered pricing) is the primary scheme, not `exact`

`exact` requires the price to be known before the work runs -- it
forces a metered service (LLM tokens, bandwidth, compute) to quote a
worst case and keep the difference. `upto` lets the client authorize a
maximum and the server settle the actual cost after doing the work.
Hedera didn't have an `upto` implementation before this project used
one (`x402-hedera-upto`, the first non-EVM `upto` scheme) -- see
`tecnico/technical-reference.md` for the SDK/package details.

`src/server.ts` (the `exact`-scheme scaffold) predates this decision
and was never finished -- it's excluded from the build/CI (see below).

## `@x402/core` is pinned to `2.21.0`

`x402-hedera-upto@0.1.0` (the only version published) breaks against
`@x402/core >=2.22.0` with `TypeError: Cannot read properties of
undefined (reading 'undefined')` in `resolvePaymentFlow`. Root cause:
`@x402/core@2.22.0` made `paymentFlows`/`defaultAssetTransferMethod`
required on every `SchemeNetworkServer`; `UptoHederaScheme` (server
side) never declared them. Confirmed by patching a local install,
reinstalling `@x402/core@2.25.0`, and re-running the full demo twice
(before and after the fix) -- a real settlement transaction on each
run. Fix proposed upstream: `Madhav-Gupta-28/Tally#1`. Unpin once that
merges and a new version of `x402-hedera-upto` publishes.

## `src/server.ts` is excluded from `tsconfig.json`/CI

`@x402/hedera` brings its own nested `@x402/core@2.25.0`, separate
from the `2.21.0` pinned at the root for `x402-hedera-upto`
compatibility (above). Two installations of `@x402/core` produce
structurally incompatible `SchemeNetworkServer` types between them, so
`server.ts` (which imports `@x402/hedera`) doesn't type-check against
the pinned core. Not resolved here because doing so means either
breaking the `upto` pin or dropping `@x402/hedera` -- and `server.ts`
was already an unfinished scaffold, not the working deliverable.

## The `X402UptoProxy` contract is reused, not redeployed

The reference `X402UptoProxy` deployment (Hedera testnet `0.0.9556979`)
was already deployed and verified by the package's own author (Madhav
Gupta). Reusing it is safe because the contract is permissionless by
design: the authorized facilitator is named in the *client's signature*
per payment, not in contract storage, so any facilitator account can
settle against it. One open item, not resolved: the deployed contract's
Hedera-level account has a non-empty `admin_key`, which at the platform
level (independent of the Solidity having no owner logic) could in
principle allow whoever holds that key to update or delete this
specific instance -- flagged, not confirmed whose key it is or whether
it's still live.

## The web UI signs with a server-held demo key, never a browser-held one

`src/upto-ui-server.ts` orchestrates the full x402 flow (402 -> sign ->
settle) server-side, using a key held in the server's own environment.
The browser never receives or submits a private key. This trades off
"closer to how a real end-user wallet would work" for "safe to run as a
public demo without asking a visitor to paste key material into a
page" -- a deliberate choice for a demo, not a production wallet
integration pattern.

## Facilitator custom-fee verification

Hedera HTS tokens can have custom fees that reduce what a receiver
actually gets, even when the network reports the transfer as
successful (a receiver-pays fractional fee is Hedera's default
behavior). A resource server relying only on "did the transaction
reach consensus with a SUCCESS receipt" can be underpaid without
knowing it. This project's facilitator work (and the upstream
contribution at `x402-foundation/x402#3061`) verifies the actual net
credit against the consensus record, not just the receipt status --
see that issue's comment thread for the full technical detail and the
real reproduction that confirmed it.
