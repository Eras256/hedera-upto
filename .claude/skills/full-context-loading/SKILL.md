---
name: full-context-loading
description: >
  How every answer in hedera-upto should already reflect the full stack
  of available context -- this project's CLAUDE.md/AGENTS.md,
  persistent memory, this project's own hand-built skills, Claude's
  global skills, and installed community/network skill packages --
  without re-reading everything on every turn or bloating token usage.
  Covers what already loads automatically for free, what the actual
  discipline fix is (checking what exists before answering from
  scratch), what NOT to do (force full preload of every skill body),
  and a live inventory of what exists in this project so a fresh
  session doesn't have to rediscover it. Use at the start of a new
  session, when asked "do you have full context," or whenever an answer
  risks being generic instead of grounded in what this project already
  knows.
---

# Full context loading -- every answer grounded, without re-reading everything

## What already loads automatically, every session, at zero extra cost

- **`CLAUDE.md` (which imports `AGENTS.md` via `@AGENTS.md`)** --
  injected as project instructions automatically at session start. This
  is where hedera-upto's hard rules and file map already live.
- **The persistent memory system's index**, if any entries exist --
  loads automatically every session; the full content of any individual
  memory entry loads only when read. As of 18-sep-2026, this project's
  memory directory exists but is **empty** (no entries yet, no
  `MEMORY.md` index inside it) -- nothing to check there until the first
  entry is written.
- **Every installed Skill's name + description** -- Claude Code shows
  this list automatically at session start, at a cost of tens of tokens
  per skill. The **full body** of a skill loads only when a task matches
  its description (via the `Skill` tool) or is loaded here explicitly.
  This is already the token-saving mechanism this project needs -- it
  does not need to be rebuilt.

## The real fix: actively check before answering, don't wait to be told

Before answering anything beyond a trivial or purely conversational
request, run this check:

1. **Does an available Skill's description match this task?** If yes,
   invoke it (`Skill` tool) instead of reasoning from scratch what it
   already documents.
2. **Does the memory index name something relevant?** (Currently empty
   -- re-check this line once entries exist.)
3. **Does this project have a playbook or reusable-process doc that
   already covers this kind of task?** Verified 18-sep-2026: hedera-upto
   has no `playbooks/` folder -- it was set up early in this project's
   history and later fully removed (see `AGENTS.md`/`CLAUDE.md` history
   and the "Ignore playbooks/ and .claude/ locally" commit). Don't assume
   one exists just because a sibling project on this machine has one.
4. **Is there a community/network skill package installed that's more
   current than what's in a hand-built skill?** For this project, that's
   `hedera-dev/hedera-skills` (see Inventory below) -- it gets updated
   independently of this project's own hand-written skills.

## What NOT to do -- don't force full preload

Loading every skill's entire body and every memory entry into context on
every session start would cost real tokens for content irrelevant to
most requests. The name+description-only preload already IS the correct
mechanism for exactly this tradeoff: cheap awareness that something
exists, full cost only when it's actually used.

## Inventory -- what exists in hedera-upto right now

**Verified directly (`ls`, `find`, reading real files) on 18-sep-2026 --
not copied from another project.**

- **Claude's own global skills** (`~/.claude/skills/`, WSL side): this
  machine's global skill store is **shared with other, unrelated
  projects** -- confirmed 18-sep-2026, the majority of what's listed
  there (SCF/Stellar-round-review skills, `stellar-dev`, `dapp`,
  `assets`, etc.) belongs to a different, Stellar-focused project that
  happens to share this machine, not to hedera-upto. The one genuinely
  relevant one: **`branding-pack`** -- present as a real directory (not a
  symlink), confirmed 18-sep-2026. Don't assume a globally-visible skill
  applies here just because it's visible; check its description against
  Hedera/x402 scope first.
- **This project's own hand-built skills** (`.claude/skills/` in this
  repo, all confirmed as real tracked-shape copies, not symlinks, as of
  18-sep-2026):
  - The 24 skills from the `hedera-dev/hedera-skills` community package
    (see below) -- `agent-kit-plugin`, `axelar-gmp`, `ccip`,
    `chainlink-data-feeds`, `create-harness-spec`, `harness-spec-anatomy`,
    `hedera-agent-kit-v4-migration`, `hedera-consensus-service`,
    `hedera-hackathon-prd`, `hedera-hackathon-submission-validator`,
    `hedera-hook-creation`, `hedera-policy-creation`,
    `hedera-token-service`, `hiero-cli`, `hss-system-contract`,
    `hts-system-contract`, `layerzero-messaging`, `project-scaffolding`,
    `pyth-price-feeds`, `quality-gates`, `review-harness-spec`,
    `session-management`, `supra-push-oracle`, `x402-payments`.
  - This skill, plus `teammate-commit-identity`, `mexico-legal-check`,
    `grants-track-record`, `hackathon-fit-check`, `public-claim-verify`,
    `repo-security-sweep`, `doc-accuracy-audit`, `portfolio-funding-rollup`
    -- installed 18-sep-2026, localized to this project (sibling-project
    references and dead memory wikilinks removed or rewritten where the
    source skill had them).
- **Community/network skill packages installed:** `hedera-dev/hedera-skills`
  -- installed via `npx skills@latest add hedera-dev/hedera-skills --all`
  on 12-sep-2026, real copies (not symlinks) under `.agents/skills/`
  (gitignored, local-only) and materialized under `.claude/skills/`;
  verified not archived, last pushed 2026-09-03 (checked 18-sep-2026).
  The underlying SDK several of these skills document,
  `hashgraph/hedera-agent-kit-js`, was separately verified real, not
  archived, last pushed 2026-09-14 -- it's the JS library, not itself an
  installable skill package.
- **Playbooks:** none. See point 3 above.
- **Persistent memory:** the real index lives at
  `~/.claude/projects/-home-vaiosvaios-hedera-upto/memory/` and is
  currently empty. **No project-root `MEMORY.md` exists on disk** --
  it was explicitly removed from this project (commits removing
  `investigacion/`, `legal/`, and untracking `MEMORY.md`) -- so there is
  no name-collision risk right now between a root status doc and the
  real memory index; if a root `MEMORY.md` is ever reintroduced, name
  the two distinctly here.

**`.gitignore` check (per this template's own instruction, and matching
`repo-security-sweep` Step 5):** `.claude/` is currently fully
gitignored in this project, a **deliberate, narrower exclusion** (not a
broad `*.md` accident) -- confirmed via `git log` showing the exact
commit that added it and its stated reason (local Claude Code config,
kept out of the public repo). This is a real, open question flagged
separately to the user rather than assumed either way: whether
`.claude/skills/` specifically should stay excluded wholesale, or be
un-ignored now that its content has been audited clean -- see this
session's report for the current status of that decision.

## Verifying anything date-sensitive -- always fresh, never from training memory

Already a hard rule in `AGENTS.md` ("Cero alucinacion... todo lo
dependiente de fecha se verifica en vivo antes de afirmarlo"). When a
task needs external, current information (a price, a version, a legal
deadline, a repo's live state), verify it live via
WebSearch/WebFetch/`gh api`/`npm view` on the day it's asked, every
time -- regardless of how confidently this Inventory states it, since
this Inventory itself will age.

## Related

`hedera-dev/hedera-skills` (the installed community package covering
Hedera/x402 development), `mexico-legal-check`, `teammate-commit-identity`,
`grants-track-record`, `hackathon-fit-check`, `public-claim-verify`,
`repo-security-sweep`, `doc-accuracy-audit`, `portfolio-funding-rollup` --
all confirmed present in this project's own `.claude/skills/` as of
18-sep-2026.
