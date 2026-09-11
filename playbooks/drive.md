# drive.md — avoid the Google Drive MCP by default

## The rule, in short

1. **Not the default.** Loading the Drive MCP and pulling a full
   document as text costs real tokens — the tool definition plus the
   document's full content — for something that often has a cheaper
   path.
2. **Two alternatives to try first**: ask the user to paste the
   document's content directly if they already have it open; or, if the
   document is genuinely public (no login required), use WebFetch
   instead — no extra tool-definition load, and usually equally clean
   text.
3. **Reserve it for when it's genuinely needed**: verifying private
   content before it goes out to someone external (a funder, a client,
   a third party), where a pasted summary isn't enough because the full,
   exact content needs confirming.

## Checklist before loading the Drive MCP

1. Did I already ask the user to paste the content directly?
2. Is the document actually private, or would WebFetch get it just as
   well without loading the MCP?
3. Does what's at stake justify verifying the full, exact document (real
   stakes, going external), or is the user's own summary enough?

## Installing this in a new project — two steps, not one

Copy this file to `playbooks/drive.md`, then add this to the end of
`AGENTS.md`:

```
**The Google Drive MCP isn't the default way to read a Doc/Sheet/Slide.**
Try cheaper first: ask the user to paste the content directly, or use
WebFetch if the document is public. Reserve it for verifying private
content before it goes external. Detail in `playbooks/drive.md`.
```
