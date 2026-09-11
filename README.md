# Hedera workspace -- mapa en palabras simples

Piensa en este directorio como una carpeta de campo con dos secciones:
la libreta de apuntes (investigacion) y la caja de herramientas + el
proyecto que se esta construyendo (codigo).

- **`investigacion/`** -- todo lo que se investigo sobre el ecosistema
  Hedera: como funciona x402 ahi, que dice el programa de Ambassador,
  que bounties existen o existieron. Cada archivo dice cuando se
  verifico, como la fecha en una etiqueta de leche.
- **`tecnico/`** -- la ficha tecnica de referencia rapida: que version
  de SDK usar, a que URL le hablas en testnet vs mainnet, como se
  escribe "Hedera" y "HBAR" sin meterte en problemas de marca.
- **`legal/`** -- notas sobre en que pais opera esto y que implica,
  todavia sin confirmar con el usuario para este proyecto especifico.
- **`src/`** -- el codigo real: un servicio que cobra por x402 en
  Hedera, usando el mismo patron verify -> settle de los proyectos
  hermanos.
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
  por que.

Si esto es tu primera vez aqui, lee `CLAUDE.md` primero.
