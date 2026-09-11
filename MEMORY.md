# MEMORY.md -- bitacora de decisiones

## 2026-09-11 -- Setup inicial del workspace

- Se creo el workspace `C:\DaAps\Hedera` a peticion de una sesion
  hermana (RFP-1, coordinando el portafolio Periplo/Nirium/Contextio,
  Kumply, Vouch402, Prova) para el objetivo dual de Giovanny (Eras256):
  aplicar al Hedera Ambassador Program y construir un servicio x402
  real en Hedera.
- Se busco explicitamente un skill/MCP equivalente a "stellar-build"
  para Hedera en este entorno -- **no existe**. Se documenta en
  `CLAUDE.md` para no volver a asumir que si existe.
- Hallazgo clave que cambia el punto de partida del build: Hedera ya
  contribuyo su propio esquema "exact" de x402 (HBAR + HTS) al repo
  upstream `x402-foundation/x402`, con paquete oficial `@x402/hedera`
  actualizado hace apenas una semana (2026-09-04). El repo local
  `C:\DaAps\x402` ya trae config e2e de Hedera. Esto reduce el trabajo
  de "portear x402 a una chain nueva" a "integrar el esquema que Hedera
  ya escribio" -- ver `investigacion/x402-on-hedera.md`.
- El programa de bounties de IA de Hedera (`ai-bounties.hedera.com`)
  esta cerrado al verificar en vivo hoy -- la pagina dice "No bounty is
  open right now" sin fecha confirmada de reapertura. Hubo una ronda
  especifica de bounties x402 (5 ganadores, $1,000 c/u) ya resuelta;
  fechas exactas de esa ronda inconsistentes entre fuentes secundarias,
  marcadas como pendientes de reverificar si llegan a importar para una
  decision real.
- Pendiente: decidir el producto concreto a construir (que servicio
  cobrar por x402 en Hedera) y confirmar jurisdiccion del operador para
  este proyecto especificamente (inferida Mexico por ahora, sin
  confirmar).
- Segundo hallazgo que corrige la suposicion inicial de la sesion
  hermana: **el SDK oficial ya no es `@hashgraph/sdk`**. Hedera migro
  sus proyectos al namespace Hiero (Linux Foundation Decentralized
  Trust); el paquete actual es `@hiero-ledger/sdk` (v2.88.0, mas nuevo
  que el ultimo `@hashgraph/sdk` v2.81.0). `@x402/hedera` ya usa y
  re-exporta `@hiero-ledger/sdk` internamente. Ver
  `tecnico/technical-reference.md`.
- Se creo el scaffold inicial de codigo en `src/` (servidor Express con
  `@x402/hedera` gateando un endpoint, siguiendo el flujo real
  verify -> settle documentado en la spec local del esquema `exact`)
  como punto de partida, no como producto terminado -- falta decidir
  que se cobra de verdad.
- Se instalo el setup de Claude Code + Antigravity (patron ya probado
  en otros workspaces hermanos): skill `claude-antigravity-setup`,
  comando `/session-close`, y los playbooks `continue.md`, `images.md`,
  `git.md`, `drive.md` -- sus reglas cortas ya viven al final de
  `AGENTS.md`.
