# AGENTS.md -- reglas duras de este workspace

Fuente unica de las reglas que aplican siempre, sin excepcion, en
cualquier sesion (Claude Code o Antigravity) que trabaje en este
proyecto. `CLAUDE.md` importa este archivo completo via `@AGENTS.md` en
su primera linea -- no dupliques reglas ahi.

## Que es este workspace, en una linea

Hub de investigacion + codigo real para construir en Hedera, hermano de
`c:\DaAps\RFP 1` (Stellar/SCF), `c:\DaAps\Avalanche` (Kumply/Avalanche),
`c:\DaAps\Solana` (Prova/Solana) y `c:\DaAps\Base` (Vouch402/Base) en el
mismo portafolio -- memoria e investigacion propias, sin heredar nada de
esos proyectos sin re-verificar contra Hedera especificamente. A
diferencia de Base (que separa estrategia de build en dos repos), aqui
el codigo vive directamente en este directorio -- no hay repo hermano
de build.

## Por que existe este proyecto

Giovanny (Eras256) ya tiene x402 en produccion en Base (Vouch402) y
Stellar (Nirium), mas PRs mergeados upstream en `x402-foundation/x402`.
Hedera contribuyo su propio esquema "exact" de x402 (HBAR + tokens HTS)
al mismo repo upstream -- ver `investigacion/x402-on-hedera.md`. La
apuesta es reusar ese expertise ya probado en una chain nueva, con dos
objetivos en paralelo: (1) aplicar al Hedera Ambassador Program y (2)
construir un servicio real x402-gated en testnet/mainnet de Hedera.

## Constraints duros

- **Cero alucinacion. Todo lo dependiente de fecha se verifica en vivo
  antes de afirmarlo, nunca desde memoria de entrenamiento** --
  version del SDK, endpoints de red, estado de programas de bounties o
  grants, reglas de trademark. Esta bien decir "no lo se, hay que
  reverificar." `investigacion/` y `tecnico/` llevan fecha de
  verificacion explicita por seccion -- no son fuente perpetua.
- **No fabricar estado de programas de bounties/grants/hackathons.**
  `ai-bounties.hedera.com` cerro su ronda de mayo-junio 2026 (Agent
  Bounty) y su ronda de x402 (5 ganadores, $1,000 c/u, ver
  `investigacion/x402-on-hedera.md`); al 2026-09-11 la pagina dice
  explicitamente "No bounty is open right now" sin fecha confirmada de
  la siguiente ronda. Nunca citar ese programa como abierto sin
  reverificar la pagina en vivo el mismo dia.
- **No asumir nada de Stellar/Base/Avalanche/Solana/x402-Bazaar como si
  aplicara aqui.** Cada hecho tecnico se re-deriva contra la
  arquitectura de Hedera (hashgraph consensus, HTS, HCS, Hedera Smart
  Contract Service/EVM, mirror nodes) -- nunca se traduce mecanicamente
  desde otro proyecto del portafolio.
- **Jurisdiccion del operador: inferida Mexico** por consistencia con el
  resto del portafolio, **no confirmada para este proyecto
  especificamente todavia.** Cualquier analisis legal/fiscal real debe
  confirmar la jurisdiccion con el usuario antes de tratarse como
  aplicable. Ver `legal/README.md`.
- **Nunca "SDK" ni "Developer" en el nombre/titulo publico del
  proyecto** si en algun momento esto aplica a un programa de grants
  con categorias -- mismo error que ya costo un proyecto hermano en
  prescreen de otro ecosistema.
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
