# Referencia tecnica -- verificado 2026-09-11

Todo lo de aqui abajo se verifico en vivo el 2026-09-11 (busqueda web +
consultas directas a `registry.npmjs.org`). Revalidar si se usa con
mas de unas semanas de antiguedad respecto a esa fecha.

## SDK oficial -- CORRECCION IMPORTANTE

**`@hashgraph/sdk` esta en transicion de namespace, no es ya la
referencia mas actual.** Verificado en vivo 2026-09-11:

- Hedera migro sus proyectos a **Hiero** (Linux Foundation Decentralized
  Trust). El SDK de JS/TS se publica ahora como **`@hiero-ledger/sdk`**
  -- misma API, mismo codigo, solo cambia el nombre del paquete y los
  imports.
- Hubo un periodo de dual-publishing (ambos namespaces a la vez) de la
  v2.70.0 a la v2.82.0. **Desde la v2.83.0 en adelante, las versiones
  nuevas solo salen bajo `@hiero-ledger/sdk`.**
- Version verificada de `@hashgraph/sdk` (legacy): **2.81.0**.
- Version verificada de `@hiero-ledger/sdk` (actual): **2.88.0** --
  mas nueva, confirma que `@hashgraph/sdk` ya se quedo atras.
- Fuente: `hedera.com/blog/namespace-transition-announcement-hedera-
  projects-moving-to-hiero/`, `github.com/hiero-ledger/hiero-sdk-js`,
  `registry.npmjs.org/@hiero-ledger/sdk`.

**Para codigo nuevo en este proyecto: usar `@hiero-ledger/sdk`, nunca
`@hashgraph/sdk`.** Ademas, `@x402/hedera` (ver abajo) ya re-exporta un
subconjunto curado de `@hiero-ledger/sdk` directamente -- si el codigo
ya depende de `@x402/hedera`, preferir esos re-exports en vez de
instalar `@hiero-ledger/sdk` por separado, para evitar dos instalaciones
del SDK en disco (el propio README de `@x402/hedera` advierte que eso
rompe los chequeos `instanceof` internos del SDK con un error
`t.startsWith is not a function`).

- Alternativa si se va por la ruta de agentes: **Hedera Agent Kit**
  (mencionado por la sesion hermana como opcion; no investigado en
  detalle todavia en este workspace -- verificar tambien si ya migro a
  namespace Hiero antes de instalarlo).

## x402 en Hedera

Especificacion real: `specs/schemes/exact/scheme_exact_hedera.md` en
`x402-foundation/x402` (GitHub). Resumen: paquete `@x402/hedera`
(v2.25.0, actualizado 2026-09-04),
esquema "exact", facilitador de referencia Blocky402. El paquete se
apoya en `@x402/core` para las piezas generales de x402 (cliente,
resource server, facilitator) y expone entrypoints separados
`@x402/hedera/exact/client`, `@x402/hedera/exact/server` y
`@x402/hedera/exact/facilitator`, ademas de re-exportar primitivas de
`@hiero-ledger/sdk` (`AccountId`, `Client`, `Hbar`, `PrivateKey`,
`TransferTransaction`, `TokenAssociateTransaction`, etc.) desde el
paquete raiz `@x402/hedera` -- ver ejemplos de uso en
`src/README-x402-hedera.md` (copia local de referencia) y en
`src/server.ts`.

## Endpoints de red

### Mirror nodes (oficiales, consulta de estado/historial)

- Testnet: `https://testnet.mirrornode.hedera.com`
- Mainnet: `https://mainnet-public.mirrornode.hedera.com`
- Previewnet: `https://previewnet.mirrornode.hedera.com`

### JSON-RPC relay (compatibilidad EVM, hosteado por la comunidad -- Hashio)

| Red | Chain ID (hex / decimal) | Endpoint |
| --- | --- | --- |
| Mainnet | 0x127 / 295 | `https://mainnet.hashio.io/api` |
| Testnet | 0x128 / 296 | `https://testnet.hashio.io/api` |
| Previewnet | 0x129 / 297 | `https://previewnet.hashio.io/api` |

Nota: Hashio es un relay comunitario, no oficial de Hedera LLC -- para
produccion real, evaluar tambien relays de proveedores (Arkhia,
QuickNode, thirdweb) o correr `hiero-json-rpc-relay` propio
(`github.com/hiero-ledger/hiero-json-rpc-relay`).

## Reglas de marca -- referencia rapida

Fuente: `brand.hedera.com` (redirige desde `hedera.com/brand`) y
`docs.hedera.com/hedera/support-and-community/brand-guidelines`,
verificado en vivo 2026-09-11.

- "Hedera" con H mayuscula. Redes en minuscula: "Hedera mainnet",
  "Hedera testnet", "Hedera previewnet".
- "HBAR" siempre mayuscula, singular ("10 HBAR", nunca "10 HBARs").
- "tinybars" minuscula, plural.
- Es "hashgraph" (proof-of-stake distributed ledger), nunca
  "blockchain".
- Marks como adjetivo, siempre con sustantivo generico despues ("red
  Hedera", no "un Hedera"). Nunca como sustantivo/verbo/plural/posesivo.
- Simbolo (TM) obligatorio solo en logo/material producido
  profesionalmente -- no en texto corrido de docs, README o redes.
- **Nunca incorporar "Hedera"/"HBAR"/"Hashgraph" al nombre propio del
  proyecto, dominio, logo o icono de app.** Descripcion honesta como
  "Built on Hedera" si; como parte del nombre, no.
- Si el proyecto no es Hedera Hashgraph LLC, disclaimer de no
  afiliacion visible: "not affiliated with, sponsored, or endorsed by
  Hedera Hashgraph, LLC."

Aplicado a este proyecto: el nombre de trabajo actual (carpeta
`Hedera`) es solo interno -- cualquier nombre publico/de producto debe
evitar los marks arriba y, ademas, evitar "SDK"/"Developer" por la
regla de `AGENTS.md` sobre categorias de grants.
