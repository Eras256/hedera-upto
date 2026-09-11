# git.md — how PRs, issues, and GitHub contributions get written

## The rule, in short

1. **Humanized, no verbosity.** No filler like "it's worth noting that",
   no restating the conclusion, no empty adjective lists. Write like
   someone who already knows the subject, straight to the finding, the
   evidence, and what was done about it.
2. **The AI co-authorship trailer never gets hidden or removed.** Same
   principle as the hard rule elsewhere: the real risk isn't that AI
   shows up, it's that AI shows up *alone* with no visible human
   judgment behind it — verify against real code, run the tests,
   confirm against source, don't just write it well.
3. **Don't just report — propose the fix once the root cause is
   confirmed.** An issue that only says "found a bug" is weaker than
   one that also includes a verified fix, backed by real code, not just
   reasoning. Explicit limit: if the root cause isn't confirmed yet
   (the issue itself says "not sure if this is our error or a real
   gap"), don't force a fix — investigate first with the same isolated,
   verified reproduction the original report required, and only write
   the fix once confirmed.

## The disclosure trailer — exact text, and when it extends

Whenever the text carries visible AI assistance (the default, per the
hard rule elsewhere), the disclosure closes with this line, unchanged
across projects:

```
Disclosure: drafted with AI assistance under my direction and reviewed
by hand.
```

**If the comment quotes or paraphrases something from another
thread/comment/PR, the source gets re-read for real, today, first —
never cited from what's already sitting in this session's own context
from an earlier read. Only after re-reading, and only if it actually
happened, does the disclosure add a second sentence saying so:**

```
Both quotations above were re-verified against the linked comments
today.
```

(adjust "both"/"the" to the real number of quotes.) **The sentence is
the consequence of having re-read, not a template pasted first and
justified after.** If there wasn't time to re-read the source before
publishing, the sentence doesn't go in — a short, true disclosure beats
a long one with nothing real behind it. A specific claim that turns out
false is worse than a vague one nobody checks, because now there's
something concrete to contradict if someone does check.

## Checklist before publishing any PR/issue/comment

1. Does this read like the person who actually found it wrote it, or
   like a generated feature list? If the latter, rewrite it.
2. Is the co-authorship trailer still there? Never remove it to "look
   more human" — that's not the right way to humanize the text.
3. Is the root cause confirmed with real evidence (code actually run,
   not just someone else's description)? If yes, and there's a
   reasonable fix, include it. If not, don't invent one — report the
   finding as-is and keep investigating separately.
4. Was anything tested beyond the bare minimum asked (an extra edge
   case, a cross-check), or just the obvious case repeated? The extra
   evidence is what separates a credible report from a superficial one.
5. **Does the text quote or paraphrase something from another thread?**
   If so, that quote was re-read today against the real source (not
   recycled from an earlier summary already in context), and the
   disclosure says so explicitly with the second sentence above.

## Installing this in a new project — two steps, not one

Copy this file to `playbooks/git.md`, then add this to the end of
`AGENTS.md`:

```
**Every PR, issue, or comment published on GitHub — your own repo or
someone else's — gets written maximally humanized and concise, with the
AI co-authorship trailer visible, never hidden.** Reporting "found
something" isn't enough — once the root cause is confirmed with real
evidence, propose the fix, not just the finding. Detail in
`playbooks/git.md`.
```
