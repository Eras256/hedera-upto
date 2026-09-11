# Gaps tecnicos en x402/Hedera + programas de funding -- verificado 2026-09-11

Metodo: mismo que Kumply/Nirium -- se audito codigo e issues reales en
`x402-foundation/x402` via `gh api` (autenticado como Eras256), no se
asumio nada desde la documentacion. Fechas y estados de cada programa de
funding se verificaron en vivo (WebFetch/WebSearch), con contradicciones
entre fuentes marcadas explicitamente donde aparecieron.

## 1. Gaps tecnicos reales en `@x402/hedera` (esquema `exact`)

Todos verificados contra `github.com/x402-foundation/x402`, issues/PRs
abiertos al 2026-09-11 salvo que se indique lo contrario.

### 1.1 No existe esquema `upto` para Hedera -- solo `exact`
- Issue [#2918](https://github.com/x402-foundation/x402/issues/2918)
  (abierto 2026-07-22, sin asignar, 0 comentarios): "Metered services on
  Hedera -- LLM token generation, bandwidth metering, dynamic compute --
  cannot price their work up front." El unico esquema `upto` (precio
  variable con techo) que existe en x402 hoy es EVM-only (Permit2).
- PR de implementacion [#2919](https://github.com/x402-foundation/x402/pull/2919)
  (abierto el mismo dia, **sin asignar, 2 comentarios, sin actividad
  desde 2026-07-22** -- ~7 semanas estancado a la fecha de esta
  verificacion): agrega `X402UptoProxy`, contrato de enforcement
  admin-less, contraparte Hedera de `x402UptoPermit2Proxy`. Seria la
  primera implementacion `upto` no-EVM del proyecto.
- **Implicacion para este proyecto:** cualquier servicio que quiera
  cobrar por uso medido (tokens de LLM, ancho de banda, computo) en
  Hedera hoy esta forzado a usar `exact` y cotizar peor caso -- este es
  el gap mas directamente relevante si el producto final de `src/`
  termina siendo un servicio medido en vez de precio fijo.

### 1.2 Sin pagos con allowance (approved-transfer) -- solo balance propio
- Issue [#3010](https://github.com/x402-foundation/x402/issues/3010)
  (abierto 2026-07-31, sin asignar, 0 comentarios): "The Hedera `exact`
  scheme funds a payment from the payer's own balance, which makes the
  common two-key pattern impossible to realise: an owner that holds
  funds and grants a capped on-chain allowance to an agent whose key
  lives in the daemon." El autor dice haber verificado el bloqueo real
  en testnet y se ofrece a abrir el PR el mismo.
- **Implicacion:** bloquea el patron mas comun de agentes autonomos
  (agente con su propia llave, gastando de un balance que no controla
  directamente) -- justo el tipo de arquitectura que un servicio
  x402-gated para agentes IA querria usar.

### 1.3 Politica de costo de auto-creacion de cuenta por alias -- opcional, no obligatoria en la spec
- Issue [#3008](https://github.com/x402-foundation/x402/issues/3008)
  (abierto 2026-07-31, labeled `enhancement`, sin asignar, 0
  comentarios): la spec (`scheme_exact_hedera.md`) ya reconoce que un
  `payTo` como alias EVM/llave publica puede disparar auto-creacion de
  cuenta, con el facilitador pagando el costo -- y que un resource
  server malicioso o mal configurado puede abusar de esto. La spec no
  obliga a los facilitadores a tener una politica; queda "a discrecion".

### 1.4 `transferExecutor` (pagos desde fondos controlados por contrato) -- en progreso, bloqueado
- PR [#3205](https://github.com/x402-foundation/x402/pull/3205) (abierto
  2026-08-19, **actualizado 2026-09-08** -- activo hace 3 dias respecto
  a esta verificacion, 6 comentarios de review, `mergeable_state:
  blocked`): agrega un segundo metodo de transferencia de asset porque
  `cryptoTransfer` (el metodo actual, unico) requiere que la llave que
  firma el payload controle los fondos debitados directamente -- no
  sirve si los fondos estan bajo control de un smart contract. Solo
  spec por ahora; la implementacion en
  `typescript/packages/mechanisms/hedera/` va en un PR separado despues.
- **No es una oportunidad de "primero en llegar"** -- ya hay alguien
  trabajando esto activamente con review de mantenedores en curso.

### 1.5 Facilitador no verifica el credito neto real -- vulnerable a tokens HTS con custom fees
- PR [#3061](https://github.com/x402-foundation/x402/pull/3061) (abierto
  2026-08-05, 1 comentario, sin asignar, sin merge en 5+ semanas a la
  fecha de esta verificacion): "The Hedera facilitator verified the
  declared transfer legs in the transaction body and treated receipt
  SUCCESS as full settlement, but never checked the effective balance
  changes. HTS tokens with custom fees settle SUCCESS while the payee
  receives less than the required amount." Ejemplo dado: un resource
  server que cobra 1000 unidades de un token con fee custom recibe
  efectivamente 950 (50 van al fee collector) pero el facilitador
  reporta exito igual.
- **Esto es un bug de correccion/seguridad real, no solo una feature
  faltante** -- mismo tipo de hallazgo que ya se hizo en Kumply/Nirium
  (auditar codigo real, confirmar con evidencia, proponer el fix). Sin
  asignar, candidato directo a investigar y arreglar si se quiere
  replicar ese patron aqui.

### 1.6 Gap reconocido por el propio mantenedor -- verify/settle no tiene paridad completa
Del CHANGELOG real del paquete (`typescript/packages/mechanisms/hedera/CHANGELOG.md`,
entrada 2.18.0, PR [#2707](https://github.com/x402-foundation/x402/pull/2707)
por `@phdargen`, el mantenedor principal de los mecanismos Hedera de
x402): "This is not full verify⇒settle parity: **paused/frozen/KYC,
custom fees, and expiry remain out of scope**." Esto es despues del
hardening grande que ya cerro el hueco de firma invalida y token no
asociado (issue [#2701](https://github.com/x402-foundation/x402/issues/2701),
cerrado 2026-07-03). El gap de custom fees especificamente es el que
describe el PR #3061 de arriba -- todavia sin resolver.

## 2. Estado de programas de funding, verificado en vivo 2026-09-11

### 2.1 `ai-bounties.hedera.com` -- CERRADO (ya confirmado en pasada anterior)
Sin cambios respecto a lo ya documentado en
[`x402-on-hedera.md`](./x402-on-hedera.md): "No bounty is open right
now", sin fecha de reapertura.

### 2.2 Hello Future Hackathon (trilogia Origins/Ascension/Apex) -- CERRADO, CONCLUIDO
**Correccion a la cifra que traia la sesion hermana ("$550K, arrancaba
julio"):** ese dato describe el lanzamiento original de la trilogia, no
su estado actual. Verificado directamente en
[`hackathon.stackup.dev`](https://hackathon.stackup.dev/web/events/hedera-hello-future-apex-hackathon-2026)
(pagina de registro real, con badge de estado):
- **Apex** (capitulo final, $250K del total): periodo **17-feb al
  23-mar-2026**, submission deadline 23-mar 11:59pm ET, judging
  24-mar al 17-abr-2026. **Badge de la pagina: "Closed."** 1,197
  participantes.
- Ganadores de Apex anunciados en el blog oficial
  [hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon](https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/),
  publicado **2026-05-12**, confirmando que Apex fue "the final chapter
  of the Hello Future Trilogy" -- es decir, Origins y Ascension ya
  habian concluido antes de esto.
- **Conclusion: los $550K de la trilogia completa ya se repartieron.
  No hay ronda siguiente anunciada.** No citar este programa como
  abierto en ninguna aplicacion o decision futura sin volver a revisar
  `hellofuturehackathon.dev` ese mismo dia.

### 2.3 Hedera Foundation (antes "Hedera Grants Program") -- rolling, sin cifras publicas confirmadas
`hedera.com/grants` redirige (301) a `hedera.foundation` -- la marca
"Hedera Grants Program" parece haber sido absorbida por esta fundacion.
Verificado en vivo contra `hedera.foundation/` y
`hedera.foundation/submit-a-proposal`:
- Financia proyectos de tokenizacion, sustentabilidad, IA, DeFi y DePIN
  que impulsen adopcion de la red Hedera.
- **Sin montos ni tiers publicados en las paginas oficiales mismas** --
  la cifra de "$250K startups / $500K enterprises / $1.5M gobiernos"
  que aparecio en un resumen de busqueda generico **no se pudo
  confirmar contra la fuente primaria** al leer las paginas
  directamente -- tratar como no confirmada hasta verificar contra un
  documento oficial mas especifico (posible que sea de otra fuente,
  como The Hashgraph Association, ver abajo, y se haya mezclado en el
  resumen).
- Proceso: boton "Submit a Proposal" -> "Get in Touch" -- sin fecha
  limite visible, sugiere base rolling.

### 2.4 The Hashgraph Association -- ENTIDAD SEPARADA, aceptando aplicaciones ahora mismo
`hashgraph.swiss/funding`, contenido con fecha de pagina **2026-08-10**,
boton "Apply now" activo:
- Co-funding para startups (via plataforma de innovacion/grant
  management), enterprises (proyectos DeFi/activos digitales a gran
  escala) y gobiernos (iniciativas blockchain nacionales).
- Proceso con 6 pasos: Request -> Screening -> Interview (llamada de 30
  min) -> Qualification (llamada semanal Go/No-Go + NDA) -> Due
  Diligence (tecnica, negocio, legal, finanzas, KYC) -> Approval.
- **Decisiones de board una vez por trimestre**, 6-8 semanas desde
  aplicacion hasta revision de board -- no es un proceso rapido tipo
  bounty.
- Es la unica fuente de funding de Hedera confirmada como "aceptando
  aplicaciones ahora mismo" con evidencia directa (boton activo,
  contenido reciente) en toda esta investigacion.

## 3. Cruce -- que vale la pena hacer con esto

**No hay cruce limpio "gap + bounty abierto ahora mismo".** Los dos
canales de dinero rapido (bounties, hackathon) estan cerrados sin fecha
de reapertura. El unico canal de funding confirmado abierto (The
Hashgraph Association) es un proceso de semanas con due diligence
completa -- no calza con "encontrar un bug y cobrar un bounty esta
semana".

**Lo que si vale la pena independientemente del funding:**

1. **PR #3061 (underpayment con custom-fee tokens)** es el candidato
   mas directo a replicar el patron ya usado en Kumply/Nirium: auditar,
   confirmar con evidencia real en testnet, proponer el fix. Esta sin
   asignar y sin actividad de review todavia. Un PR real mergeado aqui
   es evidencia clickeable genuina (no un puntaje de auditoria
   autoemitido) para la aplicacion de Ambassador Program.
2. **Issue #3010 (allowance-funded payments)** es la pieza que mas
   importa si el producto final de `src/` es para agentes autonomos con
   llave propia gastando de un balance que no controlan directamente --
   el autor original ya se ofrecio a abrir el PR, vale la pena revisar
   si sigue sin resolverse antes de duplicar el esfuerzo.
3. **Issue #2918 / PR #2919 (esquema `upto`)** es la pieza que mas
   importa si el producto final cobra por uso medido en vez de precio
   fijo -- 7 semanas estancado, con espacio real para retomarlo.
4. Ninguno de estos requiere esperar una ronda de grant/bounty para
   empezar -- son contribuciones al repo upstream donde Giovanny ya
   tiene merge history, mismo canal que ya funciono antes.

## Fuentes (todas verificadas en vivo 2026-09-11)

- github.com/x402-foundation/x402 -- issues/PRs #2918, #2919, #3010,
  #3008, #3205, #3061, #2701, #2707 (via `gh api`, cuenta autenticada
  Eras256)
- `typescript/packages/mechanisms/hedera/CHANGELOG.md` (repo local
  `C:\DaAps\x402`)
- [hackathon.stackup.dev/.../hedera-hello-future-apex-hackathon-2026](https://hackathon.stackup.dev/web/events/hedera-hello-future-apex-hackathon-2026)
- [hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon](https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/)
- [hellofuturehackathon.dev](https://hellofuturehackathon.dev/)
- [hedera.foundation](https://hedera.foundation/) y
  [hedera.foundation/submit-a-proposal](https://hedera.foundation/submit-a-proposal)
- [hashgraph.swiss/funding](https://www.hashgraph.swiss/funding)
- `ai-bounties.hedera.com` (re-verificado, sin cambio de estado)
