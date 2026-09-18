---
name: full-context-loading
description: >
  How every answer in this project should already reflect the full
  stack of available context -- this project's CLAUDE.md/AGENTS.md,
  persistent memory, this project's own hand-built skills, Claude's
  global skills, and any installed community/network skill packages --
  without re-reading everything on every turn or bloating token usage.
  Covers what already loads automatically for free, what the actual
  discipline fix is (checking what exists before answering from
  scratch), what NOT to do (force full preload of every skill body),
  and a live inventory of what exists in this project so a fresh
  session doesn't have to rediscover it. Use at the start of a new
  session, when asked "do you have full context," or whenever an
  answer risks being generic instead of grounded in what this project
  already knows.
---

# Full context loading -- every answer grounded, without re-reading everything

## What already loads automatically, every session, at zero extra cost

No action needed for these -- verified true for this project:

- **`CLAUDE.md` (which imports `AGENTS.md` via `@AGENTS.md`)** --
  injected as project instructions automatically at session start.
  This is where this project's hard rules and file map already live.
- **The persistent memory system, two distinct files, don't conflate
  them** (verified 2026-09-13, checked for a third/hidden file, none
  found):
  1. `_strategy/MEMORY.md` -- this project's own dated decision log (a
     bitacora: what was decided, found, fixed, and why, one entry per
     date). Lives inside `_strategy/`, this project's own separate
     local git repo (no remote), not the public one.
  2. `C:\Users\vaios\.claude\projects\c--DaAps-Hedera\memory\MEMORY.md`
     -- the cross-session persistent memory index (one line per durable
     fact, each pointing to its own file in that same `memory/`
     folder). Loads automatically every session regardless of which
     project directory a session starts in.
  Both load automatically and both matter, but answer different
  questions -- "what happened and why" (1) vs. "what durable fact
  should any future session already know" (2). Check both before
  answering something either might already cover; don't write a
  durable cross-session fact into the dated log or a one-off decision
  into the durable index.
- **Every installed Skill's name + description** -- Claude Code shows
  this list automatically at session start, at a cost of tens of tokens
  per skill. The **full body** of a skill loads only when a task
  matches its description (via the `Skill` tool) or is loaded here
  explicitly. **This is already the token-saving mechanism this project
  needs -- it does not need to be rebuilt.**

## The real fix: actively check before answering, don't wait to be told

The gap this skill exists to close isn't a missing preload -- it's a
session answering a non-trivial request as if none of the above
existed, when a quick check would have surfaced something directly
relevant. Before answering anything beyond a trivial or purely
conversational request, run this check:

1. **Does an available Skill's description match this task?** If yes,
   invoke it (`Skill` tool) instead of reasoning from scratch what it
   already documents.
2. **Does either `MEMORY.md`'s index name something relevant?** (see
   the two distinct files above) -- read the matching one before
   asserting a fact "from nothing." A past correction or verified
   figure is more likely in the dated log; a standing cross-session
   fact is more likely in the durable index -- check whichever fits,
   or both if unsure.
3. **Does a playbook in `_strategy/playbooks/`** (private, local-only,
   gitignored from the public repo) **already cover this kind of
   task?**
4. **Is there a Hedera-specific or community skill package installed**
   that's more current than what's in memory or in a hand-built skill?
   Skill packages get updated independently of this project's own
   memory -- see the collision/overwrite incident in
   `_strategy/skills-tecnicas-backlog.md` (2026-09-12) for why the two
   sources can diverge or even overwrite each other silently.

This is a discipline to apply every time, not a one-time setup step --
the same lesson `_strategy/playbooks/continue.md` already states for
resuming a session ("no releas lo que ya esta en contexto ni
reverifiques lo ya verificado") generalizes here to "don't answer from
a blank slate what an already-available resource already covers."

## What NOT to do -- don't force full preload

Loading every skill's entire body, every playbook, and every memory
file into context on every session start would cost real tokens for
content irrelevant to most requests -- this directly fights the goal
of not wasting tokens, not serves it. The name+description-only
preload already IS the correct mechanism for exactly this tradeoff:
cheap awareness that something exists, full cost only when it's
actually used. Don't try to route around it by dumping full content
somewhere it'll be re-read every turn.

## Inventory -- what exists in this project right now (2026-09-18, verified live)

- **This project's own hand-built skills** (`.claude/skills/`, 38
  public entries as of today, all real copies -- no symlinks) --
  written specifically for this project's real findings:
  `agentic-payments-hedera`, `hedera-dev`, `hedera-smart-contracts`,
  `hedera-token-service`\*, `hedera-consensus-service`\*,
  `hedera-security-review`, `hedera-ecosystem-contribution`,
  `claude-antigravity-setup`, `mexico-legal-check`,
  `teammate-commit-identity` (corrected 2026-09-13 on identity
  consent), this skill itself, plus six general-purpose skills added
  2026-09-18 (`grants-track-record`, `hackathon-fit-check`,
  `public-claim-verify`, `repo-security-sweep`, `doc-accuracy-audit`,
  `portfolio-funding-rollup`, `ecosystem-skills-installer`), and the
  24 skills that came from the official marketplace below.
  \*`hedera-token-service` and `hedera-consensus-service` are, as of
  2026-09-12, real copies of the official marketplace versions (next
  bullet) after a name collision overwrote the hand-built originals
  during an install (they were briefly symlinks, converted back to
  real files 2026-09-18 so a fresh clone of this public repo doesn't
  depend on `.agents/` existing) -- their project-specific content
  survives in `hedera-security-review` and `_strategy/investigacion/`,
  not in those two files anymore.
  Two project skills with content too specific to this operator's
  wider work to publish (`grant-fit-check`, `deploy-hedera-mainnet`)
  live privately in `_strategy/.claude/skills/` instead, audited
  2026-09-18 against this repo's public-visibility check.
- **Official Hedera skill marketplace** (`hedera-dev/hedera-skills`,
  real GitHub org, verified via `gh api`, not archived, last pushed
  2026-09-03) -- installed at project level (`npx skills add ... --all`
  into `.agents/skills/`, 2026-09-12; copied as real files into
  `.claude/skills/` 2026-09-18, no longer symlinked) and at global
  level (`npx skills add ... -g --all` into `~/.agents/skills/`,
  symlinked into `~/.claude/skills/`, 2026-09-13 -- that global
  symlink pair is correct as-is, it's outside any repo and never
  gets cloned). 24 skills covering system contracts (HTS/HSS),
  oracles (Chainlink/Supra/Pyth), cross-chain (Axelar/LayerZero/CCIP),
  Agent Kit plugin dev, `hiero-cli`, hackathon tooling, and
  dev-intelligence. The `dev-intelligence` plugin's advisory post-edit
  hook (`post-edit-check.sh`) came along as skill files
  (`project-scaffolding`, `quality-gates`, `session-management`) but is
  **not wired anywhere** -- checked both `.claude/settings.json`
  (doesn't exist in this project) and the global one -- confirmed
  inactive, not just "reviewed and looks safe."
- **Claude's global skills** (`~/.claude/skills/`) -- mixed as of
  2026-09-13. Still carries a large **Stellar**-focused set
  (`stellar-dev`, `smart-contracts`, `dapp`, `cross-chain`, `assets`,
  `zk-proofs`, `standards`, `data`, `agentic-payments`, several `scf-*`
  Stellar grant-round skills, plus generic ones like `code-review`,
  `prd`, `documentation`) -- leftover from other work done on this same
  shared machine, not anything Hedera-specific; don't assume one
  applies here without checking its description first. Now also
  carries the Hedera marketplace (see above), genuinely usable from any
  project on this machine, not just this one.
- **Community skill packages evaluated but NOT installed** (checked
  and rejected, 2026-09-13, per the user's own pasted install list):
  `bytesagain/ai-skills` (real repo, huge generic catalog, zero Hedera
  skill in it), `jelly-chain/jelly-claude-skills` (real repo, entirely
  Solana/BNB-focused, zero Hedera skill), `hashgraph/hedera-agent-kit-js`
  (real, active SDK repo, but contains no `SKILL.md` at all -- not an
  installable skill package).
- **Playbooks** (`_strategy/playbooks/`, private, gitignored from the
  public repo) -- `PLAYBOOK-build-flow.md`,
  `PLAYBOOK-register-cleanup.md`, `CHECKLIST-panel-review.md`,
  `continue.md`, `drive.md`, `git.md`, `images.md`.
- **Persistent memory** -- the two distinct `MEMORY.md` files, see
  "What already loads automatically" above for which is which and
  when to use each.

## Known dual clone -- this repo also lives in WSL, unsynced

**Discovered 2026-09-18 the hard way: this repo has (at least) two local
clones, and they are not the same environment.** This one runs natively
on Windows at `C:\DaAps\Hedera`. A second clone runs under WSL at
`/home/vaiosvaios/hedera-upto`, confirmed by a divergent push to
`origin/main` (commit `470e2a7`) whose own `full-context-loading`
rewrite named its memory index path as
`~/.claude/projects/-home-vaiosvaios-hedera-upto/memory/` -- a different
Linux path, meaning a genuinely different, independently-empty
persistent-memory store (Claude Code keys project memory by working-
directory path). That divergence produced two independently-written,
overlapping-but-different sets of commits on top of the same base
(`2236f88`), reconciled by hand on 2026-09-18.

**What this means for any future session, in either clone:**

- **Never assume the other clone is synced with this one.** `git fetch`
  before trusting `origin/main` matches what you last saw here.
- **`_strategy/` is local-only, no remote, in *both* clones
  independently** -- its content (playbooks, legal research, memory
  bitacora) can genuinely differ between the two, not just be "behind."
  A claim like "this project has no `playbooks/` folder" or "the memory
  directory is empty" may be true for the clone making it and false for
  the other -- state which clone/path a claim was verified against, not
  just a date.
- **Before pushing, check `git log origin/main..HEAD` and
  `git log HEAD..origin/main`** -- if the second list is non-empty,
  someone (very possibly the same user in the other clone) already
  pushed work this session doesn't have yet. Don't force-push past it;
  reconcile it the way this session's own history for 2026-09-18 shows
  (see commit messages around the `470e2a7`/`3267c09` merge).

## Verifying anything date-sensitive -- always fresh, never from training memory

A memory entry or a skill's own text can be stale by the time it's
read. When a task needs external, current information (a price, a
version, a legal deadline, a repo's live state), verify it live via
WebSearch/WebFetch/`gh api`/`npm view` on the day it's asked, every
time -- regardless of how confidently a prior memory or skill states it.

## Related

`teammate-commit-identity` (identity/consent rules, corrected
2026-09-13), `hedera-security-review` (this project's own real
security findings), `hedera-ecosystem-contribution` (the
verify-against-real-code method used to build the Inventory above).
