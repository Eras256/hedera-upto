@AGENTS.md

# CLAUDE.md -- Contexto raiz del proyecto

> Codigo real para construir en Hedera.
> Ultima actualizacion: **2026-09-12**.

## Que es este proyecto

Este repositorio es el codigo real de un servicio x402-gated en Hedera
(patron verify -> settle), usando el esquema "exact" que Hedera ya
contribuyo al estandar x402, y el esquema `upto` para pagos medidos por
uso.

Reglas duras del proyecto: ver `AGENTS.md` (importado arriba).

## Como navegar este workspace

| Carpeta/Archivo | Contenido |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Reglas duras, importadas arriba con `@AGENTS.md` |
| [`README.md`](./README.md) | Mapa de la estructura en palabras simples |
| [`MEMORY.md`](./MEMORY.md) | Bitacora de decisiones y estado a traves del tiempo (uso local, no publicado) |
| [`tecnico/`](./tecnico/) | Referencia tecnica: SDK, endpoints de red, reglas de marca |
| [`src/`](./src/) | Codigo del servicio x402-gated (esquemas `exact` y `upto`, UI real) |

## Herramientas propias vs. de terceros

**No existe un skill/MCP equivalente a un paquete de investigacion
pre-armado para Hedera en este entorno** -- se busco explicitamente y
no aparecio nada especifico de Hedera en la lista de skills ni de MCP
servers disponibles. Lo que si existe y es oficial:

- `@hiero-ledger/sdk` (npm) -- SDK oficial de Hedera para JS/TS bajo su
  nombre actual (Hedera migro a namespace Hiero; `@hashgraph/sdk`
  quedo en transicion de deprecacion). Ver correccion completa en
  `tecnico/technical-reference.md`.
- `@x402/hedera` (npm) -- implementacion de referencia del esquema x402
  "exact" para Hedera, mantenida por x402 Foundation, Apache-2.0.
- `x402-hedera-upto` (npm) -- implementacion del esquema `upto` (pagos
  medidos por uso) para Hedera.

Detalle completo, con fuentes, en `tecnico/technical-reference.md`.

## Estado y fuente de verdad temporal

Este archivo y la carpeta `tecnico/` reflejan investigacion verificada
al **11-12 de septiembre de 2026**. El ecosistema de Hedera (bounties,
endpoints, versiones de SDK) se mueve rapido -- revalida contra las
fuentes primarias citadas en cada archivo antes de usar un hecho con
mas de unas semanas de antiguedad en una decision real.
