# src/ -- codigo del servicio

## Entregable principal: el esquema `upto`

El entregable principal es el esquema `upto` (pago medido/variable) en
vez de `exact` -- infraestructura que falta en Hedera hoy, no un
producto de nicho.

**Archivos de la Parte 2 (esquema `upto`):**

- `upto-server.ts` -- resource server real: expone `POST /api/digest`,
  un endpoint de trabajo medido genuino (digest de frecuencia de
  palabras) que cobra por palabra procesada, no un precio fijo. Usa
  `x402-hedera-upto` (paquete real publicado, v0.1.0) y un proxy
  `X402UptoProxy` ya desplegado en Hedera testnet (`0.0.9556979`).
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
  interfaz web real del flujo `upto` (construida por Monse/M0nsxx). El
  backend firma con la key demo del servidor (nunca pide una private
  key al navegador), pero el flujo -- 402, firma EIP-712, settlement
  real -- es el mismo real de `upto-client-demo.ts`, solo expuesto
  como pagina en vez de CLI. Correr con `npm run dev:upto-ui` ademas
  del server y el facilitador.

**Como correr esto:** `npm run setup:upto-client` una vez (requiere
cuentas testnet fondeadas via el faucet publico de Hedera), despues
`npm run dev:upto-facilitator` + `npm run dev:upto-server` en paralelo,
despues `npm run demo:upto-client` (CLI) o `npm run dev:upto-ui`
(interfaz web) para la corrida real.

`server.ts` (esquema `exact`) es un scaffold anterior, no terminado --
el `facilitatorClient` es un placeholder (ver TODO en el archivo).

## Antes de correr esto

1. `npm install`
2. Copiar `.env.example` a `.env` y llenar `HEDERA_PAYTO_ACCOUNT_ID` con
   una cuenta testnet real, creada/fondeada en
   `https://portal.hedera.com/`.
3. Si se usa `server.ts` (esquema `exact`), resolver el
   `facilitatorClient` placeholder contra un facilitador real antes de
   esperar que `/verify` o `/settle` funcionen -- ahora mismo ese
   servidor solo expone `/health`.
4. Si el negocio real termina cobrando en un token HTS en vez de HBAR,
   recordar la asociacion de token obligatoria (ver
   `../tecnico/technical-reference.md` -- tanto pagador como receptor
   deben asociar el token antes de que la transferencia funcione, o
   falla on-chain con `TOKEN_NOT_ASSOCIATED_TO_ACCOUNT`).
