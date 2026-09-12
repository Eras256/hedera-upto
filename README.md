# Hedera workspace -- mapa en palabras simples

- **`tecnico/`** -- la ficha tecnica de referencia rapida: que version
  de SDK usar, a que URL le hablas en testnet vs mainnet, como se
  escribe "Hedera" y "HBAR" sin meterte en problemas de marca.
- **`src/`** -- el codigo real: un servicio que cobra por x402 en
  Hedera, con dos esquemas (`exact` y `upto`) y una interfaz web real.
- **`playbooks/`** -- reglas de trabajo reusables (como retomar sesion,
  como pegar imagenes barato, como escribir PRs/issues, cuando usar el
  MCP de Google Drive) -- cada una resumida en dos lineas dentro de
  `AGENTS.md` y detallada aqui.
- **`.claude/`** -- la config de Claude Code para este proyecto: un
  skill (`claude-antigravity-setup`) y un comando (`/session-close`).
- **`AGENTS.md`** -- las reglas que no se rompen nunca, en cualquier
  sesion.
- **`CLAUDE.md`** -- el resumen ejecutivo del proyecto, importa
  `AGENTS.md` arriba.
- **`MEMORY.md`** -- el diario de decisiones: que se decidio, cuando, y
  por que (uso local, no se publica).

Si esto es tu primera vez aqui, lee `CLAUDE.md` primero.
