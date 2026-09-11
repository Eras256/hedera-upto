# Demo real del esquema `upto` en Hedera testnet -- 2026-09-11

Corrida end-to-end real, hoy, contra Hedera testnet. Sin mocks: cuentas
reales, contrato real ya desplegado por Madhav Gupta, transaccion real
verificada de forma independiente contra el mirror node.

## Cuentas usadas

- **Cliente:** `0.0.10487296` (alias EVM `0xb081e95842b729531b7898bfa9eef8304a2070b9`).
  Finalizada, asociada a USDC testnet (`0.0.429274`), con allowance de
  5 USDC aprobada al proxy. Fondeada con 10 HBAR + 20 USDC de testnet
  (Hedera faucet + faucet.circle.com).
- **Facilitador / payTo (merchant):** `0.0.10487303` (alias EVM
  `0x9d36bf19ba53e2fda16df1cbb1621414c27dbd07`). Finalizada, asociada a
  USDC testnet. Actua como facilitador (paga el fee de red del
  `capture()`) y como merchant (recibe el pago) en este demo -- roles
  separables en un despliegue real, unificados aqui por simplicidad.
- **Proxy:** `0.0.9556979` (`X402UptoProxy`), el mismo contrato ya
  desplegado y verificado por Madhav Gupta para
  x402-foundation/x402#2919 -- reutilizado, no redesplegado (ver
  `upto-scheme-evaluacion.md`).

## Flujo real ejecutado

1. Cliente hace `POST /api/digest` con un texto, sin pago -> `402` con
   `PaymentRequirements` (`scheme: upto`, `amount: 500000` = techo de
   0.5 USDC).
2. Cliente firma una `Authorization` EIP-712 off-chain -- **cero
   transacciones, cero gas** de su parte en este paso.
3. Cliente reintenta con el header `PAYMENT-SIGNATURE`.
4. El resource server hace el trabajo real (digest de frecuencia de
   palabras sobre el texto) y descubre el costo real: **16 unidades
   atomicas** (1 por palabra, 16 palabras procesadas).
5. El resource server llama al facilitador (`/verify` + `/settle`); el
   facilitador llama `X402UptoProxy.capture(authorization, signature, 16)`
   en Hedera testnet, pagando el fee de red.
6. `SettlementResponse`: `success: true`, `amount: "16"`,
   `transaction: "0.0.10487303@1789169205.952602378"`.

## Verificacion independiente contra el mirror node (no solo el output del script)

Consultado directo (`testnet.mirrornode.hedera.com/api/v1/transactions/0.0.10487303-1789169205-952602378`),
dos transacciones reales con el mismo transaction_id (la llamada al
contrato y el efecto que dispara):

1. **CONTRACTCALL** a `0.0.9556979` (el proxy), `result: SUCCESS`, fee
   pagado por `0.0.10487303` (el facilitador).
2. **CRYPTOTRANSFER** del token `0.0.429274`, disparado por esa
   llamada: `-16` de `0.0.10487296` (cliente, `is_approval: true` --
   es decir, movido via la allowance, no una transferencia directa del
   cliente) y `+16` a `0.0.10487303` (merchant).

El monto exacto (16) coincide con las palabras reales procesadas -- no
es un numero fijo, es el resultado de trabajo real medido despues del
hecho, exactamente el punto del esquema `upto`.

**Link para verificar de forma independiente:**
[hashscan.io/testnet/transaction/0.0.10487303@1789169205.952602378](https://hashscan.io/testnet/transaction/0.0.10487303@1789169205.952602378)

## Problemas tecnicos reales encontrados y resueltos en el camino

1. **`PAYER_ACCOUNT_NOT_FOUND` al finalizar cuentas hollow** usando el
   account id en forma alias como payer -- se resuelve usando el
   account id real (`0.0.x`) ya conocido en vez de `AccountId.fromEvmAddress`.
2. **`paymentRequirements.extra.proxy is required`** -- la spec pide
   tanto `proxy` (address EVM long-zero) como `proxyContractId`
   (`0.0.x`); solo se habia incluido el segundo al principio.
3. **Incompatibilidad real de versiones, no documentada en ningun
   lado:** `x402-hedera-upto@0.1.0` (unica version publicada, 14-jul-2026)
   declara peer dependency `@x402/core >=2.18.0`, pero `@x402/core`
   introdujo un cambio incompatible en la 2.22.0 (requiere que todo
   `SchemeNetworkServer` declare `paymentFlows`) que `UptoHederaScheme`
   nunca implemento -- rompe con `TypeError: Cannot read properties of
   undefined (reading 'undefined')` contra cualquier `@x402/core >=2.22.0`.
   **Se resolvio fijando `@x402/core` a `2.21.0`** en este proyecto (ver
   `package.json`). Esto es un hallazgo real, verificado por ejecucion,
   no documentado en el README ni en los issues existentes de
   `x402-foundation/x402` -- candidato a reportar como issue nuevo
   contra `x402-hedera-upto` (repo `Madhav-Gupta-28/Tally`) si se
   decide contribuir eso tambien.
4. **`setSpendControls` no existe en `@x402/core@2.21.0`** -- esa
   funcionalidad se agrego en la 2.23.0, posterior a la version fijada.
   No hizo falta usarla: a esa version no hay spend controls que
   rechacen el asset.

## Fix real, propuesto y validado dos veces

El problema #3 de arriba (incompatibilidad `x402-hedera-upto`/`@x402/core`)
se reporto upstream con PR real, no solo documentado aqui:
[Madhav-Gupta-28/Tally#1](https://github.com/Madhav-Gupta-28/Tally/pull/1).

Antes de proponerlo se valido el fix con una segunda corrida real
completa (no solo razonamiento por analogia con `@x402/hedera`): se
parcheo localmente `node_modules/x402-hedera-upto/dist/upto/server/scheme.js`
agregando `defaultAssetTransferMethod`/`paymentFlows`, se reinstalo
`@x402/core@2.25.0` (la version actual, la que rompia antes del
parche), y se corrio el demo completo de nuevo -- exito, con un
segundo settlement real: `0.0.10487303@1789169750.717664586`
(verificado contra el mirror node igual que el primero).

## Nota de duplicacion de dependencia

Fijar `@x402/core` a `2.21.0` en el nivel raiz deja una segunda copia
(`2.25.0`) instalada debajo de `@x402/hedera` (que la fija a esa
version en su propio `package.json`). No causo problemas en esta
corrida porque `upto-server.ts`/`upto-client-demo.ts` nunca importan
`@x402/hedera`, pero si en el futuro este proyecto necesita usar
`exact` (esquema original, `src/server.ts`) y `upto` en el mismo
proceso, hay que resolver este conflicto de version primero -- no
asumir que conviven sin problema.
