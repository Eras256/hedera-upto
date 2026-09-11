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

## 2026-09-11 -- Decision: esquema upto como entregable principal + scaffold real

Decidido (sesion RFP-1): el esquema `upto` (pago medido/variable) es el
entregable principal, no `exact`. Evaluado PR #2919 con el mismo nivel
de diligencia que #3061 -- ver
[`investigacion/upto-scheme-evaluacion.md`](./investigacion/upto-scheme-evaluacion.md).
Veredicto: vale la pena retomarlo (no reimplementar), esta estancado
por falta de revision + un gate de Vercel sin relacion con el codigo,
no por firma de commits como se penso al inicio.

Comentario de confirmacion redactado para el PR/issue, **pendiente de
publicar**: una sesion hermana relayo que el usuario ya habia aprobado
sin ver el texto, pero eso no se acepto como aprobacion valida -- se le
pregunto directamente al usuario en este mismo canal si podia
publicarse, porque ya se le habia hecho esa misma pregunta
directamente antes. No es lo mismo que lo ya vivido con #3061, donde el
usuario si respondio el mismo, en este canal.

Construido el scaffold completo de la Parte 2 (servicio real cobrando
por uso medido), verificado linea por linea contra las APIs reales
instaladas (`x402-hedera-upto@0.1.0`, `@x402/core@2.25.0`) -- no
fabricado:
- `src/upto-server.ts` -- resource server con endpoint de digest de
  palabras, cobra por palabra procesada.
- `src/upto-facilitator.ts` -- facilitador standalone, wire protocol
  confirmado contra el codigo real de `HTTPFacilitatorClient`.
- `src/upto-client-demo.ts` -- cliente real end-to-end.
- `scripts/setup-upto-client.ts` -- finaliza cuenta hollow, asocia
  asset, aprueba allowance al proxy ya desplegado (0.0.9556979).

Generadas dos keypairs ECDSA testnet nuevas (cliente + facilitador,
guardadas en `.env`, gitignored) -- **pendientes de fondear** via
`https://portal.hedera.com/faucet` (accion humana de 30 segundos, sin
login, pegar el EVM address). Sin esto no se puede correr el demo en
vivo ni obtener el tx real de settlement que pide el criterio de
evidencia del proyecto -- el codigo esta listo pero no ejecutado.

## 2026-09-11 -- Cuentas fondeadas y finalizadas en testnet, con evidencia real

Ambas cuentas confirmadas fondeadas contra el mirror node en vivo (no
solo por el reporte del usuario): cliente `0.0.10487296` y facilitador
`0.0.10487303`, 10 HBAR cada una. Ambas eran realmente hollow (`key:
null` confirmado via curl directo a la API, no via el resumen de un
fetch generico -- ese primer intento dijo incorrectamente "no son
hollow").

Corridas reales en Hedera testnet, todas `SUCCESS`, verificadas contra
el mirror node:
- Finalizacion cliente + asociacion USDC (`0.0.429274`) + allowance de
  5 USDC al proxy `0.0.9556979`: tx ids
  `0.0.10487296-1789168496-646625928` (TOKENASSOCIATE),
  `0.0.10487296-1789168497-252447275` (CRYPTOAPPROVEALLOWANCE).
- Finalizacion facilitador: tx `0.0.10487303@1789168517.577872583`.

Nota tecnica real encontrada al correr esto (no solo teoria): el
primer intento de finalizar la cuenta uso el account id en forma alias
(`AccountId.fromEvmAddress`) como payer y fallo en precheck con
`PAYER_ACCOUNT_NOT_FOUND`, aunque la cuenta ya existia y resolvia bien
por queries de mirror node. Se corrigio usando el account id real
(`0.0.x`, ya conocido por el mirror node) directamente como operador --
documentado en `scripts/setup-upto-client.ts` para no repetir el error.

**Pendiente inmediato:** el cliente tiene 0 USDC de testnet -- la
allowance esta aprobada pero no hay saldo que mover. Se necesita
mintear USDC de prueba a `0.0.10487296` desde
`https://faucet.circle.com/` (red "Hedera Testnet", publico, sin
login, pero es un formulario de navegador -- accion humana pendiente)
antes de poder correr el demo completo y obtener el tx real del
`capture()`.

## 2026-09-11 -- Demo end-to-end real completada, tx verificado

USDC de testnet confirmado en `0.0.10487296` (20 USDC, verificado
contra el mirror node antes de correr nada). Corrida completa real:
facilitador + resource server + cliente, contra Hedera testnet real.
**Settlement real logrado:**
`0.0.10487303@1789169205.952602378` -- 16 unidades de USDC testnet
movidas del cliente al merchant via el proxy `X402UptoProxy`
(`0.0.9556979`), monto determinado por trabajo real medido (16
palabras procesadas), no un numero fijo. Verificado independientemente
contra el mirror node (no solo el output del propio script): una
CONTRACTCALL real al proxy + el CRYPTOTRANSFER que dispara, ambos
`SUCCESS`. Detalle completo, incluyendo 4 problemas tecnicos reales
encontrados y resueltos en el camino (uno de ellos una incompatibilidad
de versiones no documentada en ningun lado, entre
`x402-hedera-upto@0.1.0` y `@x402/core >=2.22.0`), en
[`investigacion/demo-upto-live.md`](./investigacion/demo-upto-live.md).

Link verificable: https://hashscan.io/testnet/transaction/0.0.10487303@1789169205.952602378

## 2026-09-11 -- Comentario en #2919 publicado; fix real reportado upstream con PR

Comentario de confirmacion de la evaluacion de #2919 publicado y
verificado en vivo (aprobacion directa del usuario en este canal, no
via relay de otra sesion): [x402-foundation/x402#2919 (comment)](https://github.com/x402-foundation/x402/pull/2919#issuecomment-5641834500)
(id `5641834500`, autor `Eras256`).

El bug de incompatibilidad `x402-hedera-upto`/`@x402/core` (ver entrada
anterior) se reporto upstream, no solo en este proyecto. Repo real
encontrado via el campo `repository` del package.json publicado:
`github.com/Madhav-Gupta-28/Tally` (no `x402-foundation/x402`, ese es
el monorepo del estandar). Causa raiz confirmada de forma precisa:
`@x402/core@2.22.0` (PR x402-foundation/x402#3053, commit `db5da2e`)
volvio obligatorio `paymentFlows`/`defaultAssetTransferMethod` en todo
`SchemeNetworkServer`; `UptoHederaScheme` (server) nunca los declaro.

**Fix validado dos veces con ejecucion real antes de proponerlo**, no
solo por analogia con el esquema `exact`: parche local aplicado,
`@x402/core` reinstalado a 2.25.0 (la actual), demo completo corrido
de nuevo -- segundo settlement real logrado:
`0.0.10487303@1789169750.717664586`, verificado contra el mirror node
(`CONTRACTCALL` + `CRYPTOTRANSFER`, ambos `SUCCESS`, monto exacto 12 =
palabras reales procesadas).

**PR real abierto y verificado en vivo:**
[Madhav-Gupta-28/Tally#1](https://github.com/Madhav-Gupta-28/Tally/pull/1)
(fork `Eras256/Tally`, rama `fix/upto-server-payment-flows`, 14
lineas, 1 archivo, coautoria de IA incluida en el commit y el PR).
Aprobado explicitamente por el usuario en este canal antes de
publicarse, con texto exacto revisado primero -- no a partir de un
relay de otra sesion.

Estado final del proyecto propio (revertido despues de validar):
`@x402/core` queda fijo en `2.21.0` en `package.json` (version estable
compatible con `x402-hedera-upto@0.1.0` sin parches), documentado como
temporal hasta que el fix real se publique en una version nueva del
paquete.
