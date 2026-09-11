# x402 en Hedera -- lo que existe ya, verificado 2026-09-11

## Resumen

Hedera no es terreno nuevo para x402: Hedera contribuyo su propio
esquema de pago (`exact`) al estandar upstream, con paquete oficial
mantenido activamente. Esto cambia el punto de partida: el trabajo no
es "portar x402 a una chain nueva" sino "integrar/extender el esquema
que Hedera ya escribio y, si hay hueco, aportar algo encima."

## El esquema "exact" de Hedera

- Documentado en `docs.hedera.com/solutions/ai/x402`.
- Permite settlements HBAR y de tokens HTS por request HTTP, sin
  intermediario custodial.
- Especificacion formal vive en el repo del x402 Foundation
  (`x402-foundation/x402`, GitHub) -- el mismo repo donde Giovanny ya
  tiene PRs mergeados.
- Paquete oficial: **`@x402/hedera`** (npm), implementacion de
  referencia TypeScript para cliente y servidor. Version verificada:
  **2.25.0**, `time.modified` = 2026-09-04 (fuente:
  `registry.npmjs.org/@x402/hedera`, consultado en vivo). Publicado por
  x402 Foundation, licencia Apache-2.0.
- El repo local `C:\DaAps\x402` (clon de x402-foundation/x402) ya trae
  config e2e especifica de Hedera en `e2e/config/mechanisms_hedera.json`
  y depende de `@hiero-ledger/cryptography` -- util como referencia de
  como el propio proyecto upstream prueba el esquema contra Hedera.

## Facilitador

- **Blocky402** (`blocky402.com`) -- facilitador abierto con soporte
  Hedera, citado directamente en la documentacion oficial de Hedera
  como el facilitador de referencia para el esquema "exact".
- Blog de Hedera (`hedera.com/blog/hedera-and-the-x402-payment-standard`,
  publicado 2026-02-10) menciona ademas "BlockyDevs' x402 Facilitator"
  como facilitador open source que verifica/asienta pagos x402 en
  multiples redes: **Hedera testnet V1**, Base, Solana, Arbitrum,
  Optimism, Avalanche. La redaccion sugiere que a la fecha del post el
  soporte de Hedera estaba en testnet -- **no confirmado si ya escalo a
  mainnet**, reverificar contra `docs.hedera.com/solutions/ai/x402` o
  directamente contra el facilitador antes de asumir mainnet-ready.

## Bounty de x402 en Hedera (ya resuelto)

- Blog de resultados: `hedera.com/blog/x402-bounty-on-hedera-winners-announced`.
- 5 desarrolladores ganadores, $1,000 USD cada uno: Pinout (sesiones
  medidas via HCS), Tally (limites de gasto off-chain con allowances de
  HTS), Xorv (marketplace de planes de IA revendidos), Qisma (cadenas
  de suministro liquidadas en un solo CryptoTransfer atomico), Mystic
  (VPN pago por minuto con HBAR).
- **Fechas de la ronda inconsistentes entre fuentes secundarias** al
  momento de esta investigacion (una fuente sugiere apertura y cierre
  el mismo dia 31-jul-2026, lo cual es implausible; otra fuente ubica
  el anuncio de ganadores el 31-ago-2026) -- si la fecha exacta importa
  para una decision real (por ejemplo, para argumentar "llegamos tarde"
  o "llegamos temprano" a la categoria), reverificar contra la fuente
  primaria antes de citarla.
- Sin mencion de una siguiente ronda especifica de x402. Ver estado
  general del programa de bounties abajo.

## Estado del programa general de bounties (`ai-bounties.hedera.com`)

Verificado en vivo 2026-09-11: **cerrado**. La pagina dice
explicitamente "No bounty is open right now. The next window opens
Monday 00:00 UTC" -- sin fecha de reapertura confirmada mas alla de esa
frase generica. Historial: ronda "Agent Bounty" corrio 18-may al
21-jun-2026, ganadores anunciados 13-jul-2026. **No asumir que este
programa sigue activo ni citarlo como oportunidad abierta sin
reabrir y revisar la pagina el mismo dia que se use el dato.**

## Implicacion para el build de este proyecto

No hace falta escribir el esquema de pago desde cero. La ruta mas
rapida es: instalar `@x402/hedera`, levantar un servidor Express/Fastify
que devuelva 402 con los requisitos de pago en el header, y usar
Blocky402 (u otro facilitador compatible) para verify/settle -- el
mismo patron que Vouch402 (Base) y Nirium (Stellar) ya implementan,
adaptado al esquema que Hedera ya definio en vez de inventar uno nuevo.
Pendiente de decidir: que servicio concreto cobrar (ver
`investigacion/README.md` para las opciones sin explorar todavia).
