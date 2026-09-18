---
name: ecosystem-skills-installer
description: >
  How to actively find whether an official or community "ecosystem
  skills" package exists for a given blockchain/network (like
  `base/skills` for Base, `hedera-dev/hedera-skills` for Hedera,
  `Ayomisco/avaxskills` for Avalanche, `ethskills` for Ethereum,
  `stellar-dev-skill`/skills.stellar.org for Stellar), verify it's real
  before installing anything, install and audit it directly in this
  project, and decide whether it's a genuine complement to this
  project's own hand-built skills or something to skip because no real
  package exists. Use proactively for Hedera (this project's network)
  if not already checked, when the user asks "is there a skill for
  network X," or before building a project-specific skill from scratch
  -- check for an official one to build on top of first.
---

# Ecosystem skills installer -- find, verify, install, or correctly conclude "none exists"

Every network with an active developer ecosystem tends to accumulate a
community or official "agent skills" package -- a pre-written manual for
how to build correctly on that specific network. Before hand-building
one from scratch, check whether one already exists -- and this skill's
job doesn't stop at finding one; it ends with it actually installed and
audited in this project, or a confirmed "none exists" on record.

**Already applied once in this project:** `hedera-dev/hedera-skills`
was found, verified, and installed via `npx skills add
hedera-dev/hedera-skills --all` (see the `hedera-dev-skills-marketplace`
memory). Steps 0-1 below don't need to be redone for that specific
package unless checking for a newer/different candidate -- but Step 3's
audit is worth re-running any time this project's own skill set looks
inconsistent with what that install should have produced.

## Step 0 -- Actively search, don't wait for a claim to verify

For Hedera, or any other network relevant to this project, go find out
directly rather than waiting for someone to hand you a claim to check:

```
WebSearch: "<network name> agent skills claude code" / "<network name>
skills.sh" / "site:github.com <network name> skills SKILL.md"
```

Check the same handful of places every time, since this is where every
real package found so far has lived: the network's own GitHub org (a
repo literally named `skills` or `<network>-skills`), the network's
official docs site for a `skill.md`/`SKILL.md` reference, and the
general agent-skill directories (`skills.sh`, `skillmd.com`,
`openagentskill.com`). A network's own foundation/company account is the
first place to check (e.g. `base/skills` lives under the `base` org
itself) before assuming a third-party maintains it.

**A network can have zero, one, or several real candidates** -- Base has
one official package from Base itself; Hedera has a community org
(`hedera-dev`) plus a separate official Agent Kit repo under `hashgraph`;
Avalanche has one community package (`Ayomisco/avaxskills`), not an
official Ava Labs one; Interledger, as of 12-sep-2026, has none. Don't
stop at the first hit -- note every real candidate, then verify each one
in Step 1 before picking which (if any) to install.

## Step 1 -- Never install an unverified claim

Research about "does X have an official skill package" -- whether from a
web search or a pasted answer -- is a claim to verify, not a fact to act
on. **Real, tested outcomes from 12-sep-2026:** a claim about
`hedera-dev/hedera-skills`, `hashgraph/hedera-agent-kit-js`, and
`@hashgraph/hedera-agent-kit` turned out fully accurate on verification;
a separate claim that no official Interledger Foundation package exists
also turned out accurate (confirmed by listing every repo in the
`interledger` GitHub org and finding none skills-shaped). Both were
verified the same way, before either was acted on:

```bash
gh api repos/<org>/<repo> --jq '{full_name, archived, pushed_at, stargazers_count}'
npm view <package-name> version   # for an npm package claim
gh api orgs/<org>/repos --jq '.[].name' --paginate   # to check a negative claim (nothing exists)
```

A repo that's real, not archived, and recently pushed is a good
candidate. A repo that returns 404, or an org listing with nothing
skills-shaped in it, confirms a genuine absence -- don't assume a gap
just because the first search didn't surface something; check the org's
full repo list before concluding "nothing exists."

## Step 2 -- If a real package exists, read its actual content before installing

Don't install based on a README description alone. Read the real file
tree and the content of anything you'd actually rely on:

```bash
gh api repos/<org>/<repo>/git/trees/HEAD?recursive=1 --jq '.tree[].path'
gh api repos/<org>/<repo>/contents/<path-to-a-real-file> --jq '.content' | base64 -d
```

This matters for two reasons, both real and tested, both confirmed on
this project's own Hedera install:

1. **The official package may be broader than this project's own skills
   in some areas and silent on others.** Hedera's official package
   covers oracles, cross-chain (Axelar/LayerZero/CCIP), a full CLI
   reference, and automated evals per skill -- none of which the
   hand-built skill library in this repo had before the install. Grep
   the official package's own reference files for the specific gap this
   project's own work actually found (a real bug, a real edge case)
   before assuming it's covered -- a package can document "how to use
   custom fees" in general while having zero mention of a specific,
   real settlement bug this project found and fixed (see the custom-fee
   facilitator verification in `DECISIONS.md`). If it's silent on that
   specific finding, that finding stays as its own project-specific
   skill; it doesn't get replaced.
2. **Installing may carry real side effects beyond adding read-only
   skills.** Some packages bundle a plugin with an actual hook that runs
   on every file edit (a real example: Hedera's official package's
   `dev-intelligence` plugin ships `hooks/hooks.json` +
   `post-edit-check.sh`). That's a bigger behavior change than adding
   reference material -- treat it as its own decision needing the real
   user's explicit go-ahead, separate from "should we add this skill
   library at all." Read what the hook actually does (does it block or
   only warn, can it fail silently) before letting it run on every edit.

## Step 3 -- Audit the result after installing, don't trust the installer's own success message

An installer reporting "Installation complete" is not the same as
"nothing important changed or broke." Real findings from doing this
audit properly, confirmed in this project on 2026-09-12:

- **Name collisions**: an installer can silently overwrite an existing
  local skill with the same name (check the installer's own log for
  "overwrites" -- it may say so even when it doesn't prompt). Real
  example in this repo: `npx skills add hedera-dev/hedera-skills --all`
  overwrote `hedera-token-service` and `hedera-consensus-service` by
  name -- both are now symlinks into `.agents/skills/...` instead of the
  original hand-built files (see `hedera-dev-skills-marketplace`
  memory). Check what was actually lost: if the official version covers
  the mechanical content equally well or better, don't rebuild the
  overwritten file -- but recover anything project-specific (a status
  note, a specific finding) that had no other home, and relocate it.
  This repo's loss was evaluated as minimal since the project-specific
  content survived elsewhere (`hedera-security-review`, in this same
  `.claude/skills/` folder, for the custom-fees gotcha). Per
  `repo-security-sweep`'s symlink rule, all skills that landed as
  symlinks into `.agents/skills/...` (not just these two -- 24 total
  from this install) were converted back to real tracked copies
  2026-09-18, since a symlink into a gitignored folder breaks on any
  other clone of this public repo.
- **New untracked paths landing in the wrong place.** An installer can
  write new directories/files at the project root without adding them
  to `.gitignore`. Real example in this repo: the same install wrote
  `.agents/`, `agent/`, and `skills-lock.json` at the repo root, none of
  it covered by `.gitignore` -- caught before the next commit and fixed
  (commit `c008b82`). Check and fix `.gitignore` for every new path an
  installer creates before the next commit; this is now a standing rule
  in this project's own `AGENTS.md`.
- Report failures the installer's own log lists, but don't assume they
  matter -- check whether the failing tool/integration is even used in
  this project before treating it as a real problem.

## Step 4 -- If no real package exists, build the project's own, but only from real evidence

When Step 1 confirms nothing official/community exists, build this
project's own skill from scratch -- same standard as everywhere else in
this repo: only build what has real evidence behind it (a real
integration, a real bug found and fixed, real code written), never a
full speculative library "to be safe." Look at a verified official
package from a different network purely as a **structural** reference --
e.g., adopting a per-skill `evals.json`/`spec.json` pattern for rigor --
without copying its actual technical content, which doesn't transfer
between networks.

## Related

`repo-security-sweep` (its symlink non-negotiable and name-collision
check overlap directly with what Step 3's audit turns up -- the two
skills should be read together after any installer run), and this
project's own `AGENTS.md` "cero alucinacion" hard constraint (the
standing rule this skill applies specifically to skill-package claims:
verify live, never state from memory).
