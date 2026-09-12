# AGENTS.md -- reglas duras de este workspace

Fuente unica de las reglas que aplican siempre, sin excepcion, en
cualquier sesion (Claude Code o Antigravity) que trabaje en este
proyecto. `CLAUDE.md` importa este archivo completo via `@AGENTS.md` en
su primera linea -- no dupliques reglas ahi.

## Que es este workspace, en una linea

Codigo real para construir un servicio x402-gated en Hedera, mas la
investigacion tecnica necesaria para hacerlo bien -- SDK, endpoints de
red, esquemas de x402 ya existentes en Hedera, reglas de marca.

## Por que existe este proyecto

Hedera contribuyo su propio esquema "exact" de x402 (HBAR + tokens HTS)
al repo upstream de x402. Objetivo: construir un servicio real
x402-gated en testnet/mainnet de Hedera, reusando ese esquema (o el
esquema `upto` para pagos medidos por uso, ver `src/README.md`).

## Constraints duros

- **Cero alucinacion. Todo lo dependiente de fecha se verifica en vivo
  antes de afirmarlo, nunca desde memoria de entrenamiento** --
  version del SDK, endpoints de red, estado de programas de bounties o
  grants, reglas de trademark. Esta bien decir "no lo se, hay que
  reverificar." `tecnico/` lleva fecha de verificacion explicita por
  seccion -- no es fuente perpetua.
- **No fabricar estado de programas de bounties/grants/hackathons.**
  `ai-bounties.hedera.com` cerro su ronda de mayo-junio 2026 (Agent
  Bounty) y su ronda de x402 (5 ganadores, $1,000 c/u); al 2026-09-11
  la pagina dice explicitamente "No bounty is open right now" sin
  fecha confirmada de la siguiente ronda. Nunca citar ese programa
  como abierto sin reverificar la pagina en vivo el mismo dia.
- **No asumir nada de otra red/chain como si aplicara aqui, aunque se
  haya visto un patron similar en otro lado.** Cada hecho tecnico se
  re-deriva contra la arquitectura de Hedera (hashgraph consensus, HTS,
  HCS, Hedera Smart Contract Service/EVM, mirror nodes) -- nunca se
  asume por analogia.
- **Jurisdiccion del operador: inferida Mexico, no confirmada para este
  proyecto especificamente todavia.** Cualquier analisis legal/fiscal
  real debe confirmar la jurisdiccion con el usuario antes de tratarse
  como aplicable.
- **Nunca "SDK" ni "Developer" en el nombre/titulo publico del
  proyecto** si en algun momento esto aplica a un programa de grants
  con categorias -- puede sacar un proyecto de prescreen.
- **Nunca afirmar un commit/merge/estado de PR sin verificarlo contra la
  API real primero** -- no basta con "reportar", hay que confirmar
  (`gh api`, no memoria ni suposicion).
- **Toda prueba de que algo funciona lleva evidencia clickeable real**
  (tx hash, link a HashScan/mirror node, comentario de un maintainer)
  -- nunca un puntaje de auditoria autoemitido.

## Reglas de marca (Hedera)

Verificado 2026-09-11 contra `brand.hedera.com` y
`docs.hedera.com/hedera/support-and-community/brand-guidelines` -- ver
`tecnico/technical-reference.md` para el detalle completo y las fuentes.
Resumen operativo:

- "Hedera" con H mayuscula; redes en minuscula ("Hedera testnet",
  "Hedera mainnet", "Hedera previewnet"). "HBAR" siempre mayuscula y
  singular ("10 HBAR", nunca "10 HBARs"). "tinybars" minuscula y plural.
  Es "hashgraph", nunca "blockchain".
- Los marks de Hedera se usan como adjetivo, siempre seguidos de un
  sustantivo generico ("red Hedera", "aplicacion construida en Hedera")
  -- nunca como sustantivo, verbo, plural o posesivo.
- **Nunca incorporar "Hedera"/"HBAR"/"Hashgraph" al nombre propio del
  proyecto, dominio, logo o icono de app.** "Built on Hedera" como
  descripcion honesta si, como parte del nombre no.
- Si el proyecto se presenta como construido sobre Hedera sin ser
  Hedera Hashgraph LLC, incluir disclaimer de no afiliacion ("not
  affiliated with, sponsored, or endorsed by Hedera Hashgraph, LLC").
- El simbolo (TM) solo es obligatorio en logo/material producido
  profesionalmente, no en texto corrido de documentos o redes.

## Reglas de trabajo

- **Sin registro de escritura-IA.** Nada de em dash, en dash, comillas
  curvas, punto medio, elipsis unicode ni flechas en contenido nuevo.
  Puntuacion ASCII plana.
- **Honestidad directa primero, analogia despues.** Decir la conclusion
  incomoda temprano, con el razonamiento, no enterrarla.
- **Marca como inferencia lo que no se pueda verificar.** No lo
  presentes como hecho confirmado.
- **Trailer de coautoria de IA en cada commit, nunca oculto:**
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- **Todo PR, issue o comentario que se publique en un repo de GitHub --
  propio o ajeno -- se escribe humanizado al maximo, sin verbosidad, con
  el trailer de coautoria incluido.** No basta con reportar "encontre
  algo" -- cuando la causa raiz ya esta confirmada con evidencia real,
  se propone el fix, no solo el hallazgo.
- **Al retomar sesion con `claude --continue`, no releer lo que ya esta
  en contexto ni reverificar lo que ya se verifico esta misma sesion.**
  Responder directo sobre lo ya establecido.

**Zero hallucination. Anything date-dependent gets verified live before
being stated, never from training memory: versions, prices, platform
rules, legal deadlines.** It's fine to say "I don't know, that needs
verifying." Every claim should trace back to something verifiable; if
not, mark it as inference.

**Image token cost is area-based, not file-weight-based.** Crop to the
relevant region before pasting. Compressing the file (JPEG/WebP)
doesn't reduce tokens and can hurt text legibility; cropping dimensions
does.

**Batch multiple images into the same turn instead of pasting them one
at a time across separate turns.** Each new image invalidates the
prompt cache from that point forward. Pasting one at a time forces
repeated cache rewrites instead of cheap reads.

**Every PR, issue, or comment published on GitHub, your own repo or
someone else's, gets written maximally humanized and concise, with the
AI co-authorship trailer visible, never hidden.** Reporting "found
something" isn't enough: once the root cause is confirmed with real
evidence, propose the fix, not just the finding.

**The Google Drive MCP isn't the default way to read a Doc/Sheet/Slide.**
Try cheaper first: ask the user to paste the content directly, or use
WebFetch if the document is public. Reserve it for verifying private
content before it goes external.
