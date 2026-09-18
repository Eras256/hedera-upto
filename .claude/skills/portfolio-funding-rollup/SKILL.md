---
name: portfolio-funding-rollup
description: >
  Maintain a living, verified ledger of all real funding received across
  a portfolio of projects (grants, instawards, hackathon prizes,
  bounties) with amount, date, program, jurisdiction, and tax-relevant
  status — distinguishing "received" from "earned but unpaid." Use
  before a tax filing, before citing total funding raised in a public
  or investor-facing claim, or when asked "how much have we actually
  received."
---

# Portfolio funding rollup — a real, sourced ledger, not a remembered total

## Non-negotiables

- **Every line traces to a real, verifiable receipt** — a bank/wallet
  transaction, a program's own payout confirmation, a real tx hash. A
  number recalled from a conversation is not a ledger entry until it's
  been checked against something that actually moved.
- **"Won" and "paid" are different states — track both, separately.** A
  real case worth designing around: work delivered and reviewed for a
  bounty whose funding campaign had already closed by the time it was
  ready — real, valuable work, genuinely earning **no payout**.
  Recording it as "funding received" would be wrong; recording it as
  zero would erase real delivered work. Track it as its own state:
  delivered-uncompensated.
- **Never state a portfolio total without listing what it's made of.**
  A round total invites treating unpaid/pending amounts as received.

## Step 1 — Enumerate every funding source, per project

Grants, instawards, hackathon prizes, bounty payouts, accelerator
stipends — for each project in the portfolio, separately.

## Step 2 — For each entry, record

Amount, currency, date received (not date announced/won), program name,
verification source (tx hash / bank record / payout confirmation
screenshot), and status: `received` / `won-not-yet-paid` /
`delivered-uncompensated` (campaign closed, program ended, etc.).

## Step 3 — Cross-reference tax obligations

For the jurisdiction the actual operator is based in (verify current
rules live — tax law changes; don't rely on a remembered rate or
threshold), flag which received amounts are declared vs. not, and by
when they need to be. This is planning support, not a tax filing or
formal advice — say so explicitly.

## Step 4 — Re-verify before anything leans on the total

A number from a prior pass is a snapshot. Before a real filing or a
public claim uses this ledger, re-check the most recent entries against
their sources again — a payout that was "pending" in the last pass may
have landed, or fallen through, since.

## Output

One living file, one line per funding event, sorted by date, with a
"Last verified" timestamp and running totals broken out by status
(`received` vs. `won-not-yet-paid` vs. `delivered-uncompensated`), never
a single blended number.
