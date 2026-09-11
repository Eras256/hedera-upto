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
  `AGENTS.md`. Confirmado despues (misma sesion, turno siguiente): el
  skill y el comando ya aparecen activos en el listado de herramientas
  -- no hizo falta reiniciar sesion.

## 2026-09-11 -- Gaps tecnicos y estado de funding en Hedera

Investigacion completa en
[`investigacion/gaps-y-funding.md`](./investigacion/gaps-y-funding.md),
metodo: auditoria de codigo/issues real via `gh api` (no documentacion),
mas verificacion en vivo de cada programa de funding. Resumen:

- 6 gaps tecnicos reales encontrados en `@x402/hedera` / esquema
  `exact`, todos con issue/PR real citado: sin esquema `upto` (pago
  medido), sin pagos con allowance/approved-transfer, politica de
  auto-creacion de cuenta por alias opcional en la spec, metodo
  `transferExecutor` en progreso (bloqueado, ya con dueño), facilitador
  no verifica credito neto real con tokens HTS de custom fees (bug de
  seguridad real, sin asignar), y el propio mantenedor reconoce en el
  CHANGELOG que verify/settle no tiene paridad completa (custom
  fees/KYC/expiry fuera de alcance).
- Correccion importante a un dato que traia la sesion hermana: el
  Hello Future Hackathon ($550K, trilogia Origins/Ascension/Apex) **ya
  esta completamente cerrado** -- Apex corrio 17-feb al 23-mar-2026,
  ganadores anunciados 12-may-2026. La cifra de "$550K, arrancaba
  julio" describia el lanzamiento original, no el estado actual.
- Hedera Foundation (`hedera.com/grants` redirige ahi) es rolling sin
  montos publicados en la fuente primaria -- la cifra de "$250K/$500K/
  $1.5M" que aparecio en un resumen de busqueda no se pudo confirmar
  contra la pagina oficial, tratada como no confirmada.
- **Unico canal de funding confirmado como abierto ahora mismo:** The
  Hashgraph Association (`hashgraph.swiss/funding`, entidad separada),
  proceso de 6-8 semanas con due diligence, decisiones de board
  trimestrales -- no es un bounty rapido.
- Conclusion: no hay cruce limpio "gap + bounty abierto ya". El camino
  con evidencia clickeable mas realista es contribuir directo al repo
  upstream (PR #3061 sin asignar es el candidato mas directo a
  replicar el patron de auditoria ya usado en Kumply/Nirium), no
  esperar una ronda de grant.

## 2026-09-11 -- PR #3061 reproducido, confirmado y comentado en vivo

Siguiendo el mismo proceso de Kumply/Nirium: se reprodujo el bug de
forma aislada primero (script real contra el paquete publicado
`@x402/hedera@2.25.0`, no un mock inventado ni una suposicion desde la
descripcion del PR), confirmando que `verify()` + `settle()` reportan
exito sin verificar el credito neto real cuando un token HTS tiene fee
fraccional pagado por el receptor. Se leyo el diff completo del fix
real del PR #3061 (autor: SashaMIT) y se confirmo que es correcto.

El usuario verifico independientemente las partes checkeables
(descargo el paquete el mismo, reviso el diff el mismo) antes de dar
luz verde a publicar. Comentario real publicado y verificado en vivo
contra la API de GitHub: [x402-foundation/x402#3061 (comment)](https://github.com/x402-foundation/x402/pull/3061#issuecomment-5641399141)
(id `5641399141`, autor `Eras256`, 2026-09-11T22:34:24Z). Detalle
tecnico completo en
[`investigacion/gaps-y-funding.md`](./investigacion/gaps-y-funding.md).
