# src/ -- codigo del servicio

## Entregable principal (decision 2026-09-11): el esquema `upto`

Tras evaluar gaps reales en el ecosistema (ver
`../investigacion/gaps-y-funding.md`), el entregable principal pasa a
ser el esquema `upto` (pago medido/variable) en vez de `exact` --
infraestructura que falta, no un producto de nicho. Detalle de la
decision y de la evaluacion del PR #2919 (upto para Hedera, ya
existente pero sin mergear) en `../investigacion/upto-scheme-evaluacion.md`.

**Archivos de la Parte 2 (esquema `upto`):**

- `upto-server.ts` -- resource server real: expone `POST /api/digest`,
  un endpoint de trabajo medido genuino (digest de frecuencia de
  palabras) que cobra por palabra procesada, no un precio fijo. Usa
  `x402-hedera-upto` (paquete real publicado, v0.1.0) y el proxy ya
  desplegado por Madhav Gupta (`0.0.9556979`, ver evaluacion del PR).
- `upto-facilitator.ts` -- facilitador standalone (README del paquete:
  "no public Hedera facilitator supports upto today, so you must run
  your own"). Expone `/verify` y `/settle` con el wire protocol real de
  `@x402/core` (confirmado leyendo el codigo instalado, no asumido).
- `upto-client-demo.ts` -- cliente real: pide el recurso, recibe 402,
  firma una autorizacion EIP-712 off-chain (sin transaccion, sin gas),
  reintenta, y muestra el tx real de settlement.
- `../scripts/setup-upto-client.ts` -- setup de una sola vez para la
  cuenta cliente: finaliza la cuenta hollow, asocia el asset, aprueba
  el allowance al proxy.
- `upto-orchestrator.ts` + `upto-ui-server.ts` + `../public/` --
  interfaz web real del flujo `upto` (construida por Monse/M0nsxx,
  2026-09-11-12, para su propia evidencia de Ambassador Program). El
  backend firma con la key demo del servidor (nunca pide una private
  key al navegador -- decision explicita, ver `MEMORY.md`), pero el
  flujo -- 402, firma EIP-712, settlement real -- es el mismo real de
  `upto-client-demo.ts`, solo expuesto como pagina en vez de CLI.
  Correr con `npm run dev:upto-ui` ademas del server y el facilitador.

**Estado real al 2026-09-11: codigo completo y verificado contra las
APIs reales instaladas (no fabricado), pero SIN ejecutar en vivo
todavia** -- faltan las dos cuentas de testnet fondeadas (cliente y
facilitador). Las keys ya se generaron localmente (`.env`, gitignored)
y sus EVM addresses estan pendientes de fondear via
`https://portal.hedera.com/faucet` (pegar el address, sin login, 100
HBAR de testnet). Una vez fondeadas: `npm run setup:upto-client`,
despues `npm run dev:upto-facilitator` + `npm run dev:upto-server` en
paralelo, despues `npm run demo:upto-client` para la corrida real.

Scaffold, no producto terminado. `server.ts` levanta un resource server
Express que registra el esquema "exact" de `@x402/hedera` para
`hedera:*`, pero el `facilitatorClient` es un placeholder (ver TODO en
el archivo) y la ruta de negocio real todavia no existe -- falta
decidir que servicio concreto se cobra (ver
`../investigacion/README.md`, seccion "Pendiente de investigar").

## Antes de correr esto

1. `npm install`
2. Copiar `.env.example` a `.env` y llenar `HEDERA_PAYTO_ACCOUNT_ID` con
   una cuenta testnet real, creada/fondeada en
   `https://portal.hedera.com/`.
3. Resolver el `facilitatorClient` placeholder contra un facilitador
   real (Blocky402 u otro compatible) antes de esperar que `/verify` o
   `/settle` funcionen -- ahora mismo el servidor solo expone `/health`.
4. Si el negocio real termina cobrando en un token HTS en vez de HBAR,
   recordar la asociacion de token obligatoria (ver
   `../tecnico/technical-reference.md` y el README de `@x402/hedera` --
   tanto pagador como receptor deben asociar el token antes de que la
   transferencia funcione, o falla on-chain con
   `TOKEN_NOT_ASSOCIATED_TO_ACCOUNT`).

## Por que HBAR (`0.0.0`) como default y no un stablecoin

Decision temporal, no definitiva: HBAR no requiere asociacion de token
(a diferencia de cualquier HTS FT, incluido USDC en testnet). Simplifica
el scaffold inicial. Si el producto final cobra en un stablecoin, este
default debe cambiarse explicitamente en `server.ts` y documentarse el
cambio en `MEMORY.md`.
