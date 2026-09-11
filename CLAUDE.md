@AGENTS.md

# CLAUDE.md -- Contexto raiz del proyecto

> Workspace de investigacion + codigo real para construir en Hedera.
> Ultima actualizacion: **2026-09-11**.

## Que es este proyecto

Este repositorio combina investigacion de ecosistema con el codigo real
de un servicio x402-gated en Hedera (patron verify -> settle, el mismo
que Giovanny ya tiene en produccion en Base y Stellar). Dos objetivos en
paralelo, sin que uno bloquee al otro:

1. **Aplicacion al Hedera Ambassador Program** (formulario en
   `investigacion/ambassador-program.md`).
2. **Build real:** un servicio pagado por x402 corriendo en Hedera
   testnet, usando el esquema "exact" que Hedera ya contribuyo al
   estandar x402 -- ver `investigacion/x402-on-hedera.md`.

Reglas duras del proyecto: ver `AGENTS.md` (importado arriba).

## Como navegar este workspace

| Carpeta/Archivo | Contenido |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Reglas duras, importadas arriba con `@AGENTS.md` |
| [`README.md`](./README.md) | Mapa de la estructura en palabras simples |
| [`MEMORY.md`](./MEMORY.md) | Bitacora de decisiones y estado a traves del tiempo |
| [`investigacion/`](./investigacion/) | Ecosistema Hedera, x402-on-Hedera, Ambassador Program -- todo con fecha de verificacion |
| [`tecnico/`](./tecnico/) | Referencia tecnica: SDK, endpoints de red, reglas de marca |
| [`legal/`](./legal/) | Jurisdiccion y consideraciones legales (placeholder, sin confirmar todavia) |
| [`src/`](./src/) | Codigo del servicio x402-gated |

## Herramientas propias vs. de terceros

**No existe un skill/MCP equivalente a "stellar-build" para Hedera en
este entorno** -- se busco explicitamente el 2026-09-11 y no aparecio
nada especifico de Hedera en la lista de skills ni de MCP servers
disponibles. Lo que si existe y es oficial:

- `@hiero-ledger/sdk` (npm) -- SDK oficial de Hedera para JS/TS bajo su
  nombre actual (Hedera migro a namespace Hiero; `@hashgraph/sdk`
  quedo en transicion de deprecacion). Ultima version verificada:
  **2.88.0**. Ver correccion completa en `tecnico/technical-reference.md`.
- `@x402/hedera` (npm) -- implementacion de referencia del esquema x402
  "exact" para Hedera, mantenida por x402 Foundation, Apache-2.0. Ultima
  version verificada: **2.25.0**, publicada 2026-09-04 (hace una
  semana respecto a hoy).
- El repo local `C:\DaAps\x402` (clon de `x402-foundation/x402`) ya
  trae config e2e para Hedera en `e2e/config/mechanisms_hedera.json` --
  util como referencia de como el propio proyecto upstream prueba el
  esquema.

Detalle completo, con fuentes, en `tecnico/technical-reference.md`.

## Estado y fuente de verdad temporal

Este archivo y las carpetas `investigacion/`, `tecnico/`, `legal/`
reflejan investigacion verificada al **11 de septiembre de 2026**. El
ecosistema de Hedera (bounties, endpoints, versiones de SDK) se mueve
rapido -- revalida contra las fuentes primarias citadas en cada archivo
antes de usar un hecho con mas de unas semanas de antiguedad en una
aplicacion o decision real.
