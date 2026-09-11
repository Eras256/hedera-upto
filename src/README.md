# src/ -- codigo del servicio

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
