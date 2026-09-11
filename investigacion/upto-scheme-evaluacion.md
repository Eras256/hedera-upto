# Evaluacion de PR #2919 (esquema `upto` para Hedera) -- 2026-09-11

Mismo nivel de diligencia que en #3061: se verifico cada afirmacion
contra la fuente real (API de GitHub, registry de npm, mirror node de
Hedera), no se asumio nada desde la descripcion del PR/issue.

## Veredicto: (a) vale la pena retomarlo -- no reimplementar desde cero

## Que es real, verificado en vivo hoy

- **PR #2919 y issue #2918**, autor **Madhav-Gupta-28**. `mergeable:
  MERGEABLE` (sin conflictos), 368 lineas, 2 archivos, solo spec (no
  toca codigo del monorepo) -- agrega
  `specs/schemes/upto/scheme_upto_hedera.md` completo y una linea de
  indice en `scheme_upto.md`.
- **El autor es Madhav Gupta, ganador real del bounty de x402 en
  Hedera** ya documentado en
  [`x402-on-hedera.md`](./x402-on-hedera.md) -- su proyecto ganador
  "Tally" ($1,000, spending caps off-chain con allowances HTS) es
  literalmente el mismo repo (`github.com/Madhav-Gupta-28/Tally`) que
  contiene esta implementacion. No es un desconocido enviando codigo
  sin trackrecord.
- **Paquetes npm reales, verificados contra `registry.npmjs.org`:**
  - `x402-hedera-upto` v0.1.0, publicado 2026-07-14, Apache-2.0,
    descripcion coincide exacta con la spec.
  - `x402-hedera-receipts` v0.1.1, publicado 2026-07-14/15,
    Apache-2.0, para el "offer-receipt" verificable.
- **Contrato desplegado real**, verificado contra el mirror node de
  Hedera testnet (`testnet.mirrornode.hedera.com/api/v1/contracts/0.0.9556979`):
  `contract_id: 0.0.9556979`, `evm_address:
  0x000000000000000000000000000000000091d3f3` (coincide exacto con el
  address citado en la spec), `deleted: false`, activo.
- **Codigo Solidity leido completo** (`X402UptoProxy.sol`, via GitHub
  API, 8485 bytes): logica solida -- effects-before-interactions
  (nonce se consume antes del transfer), rechazo de firma malleable
  (chequeo de `s > secp256k1n/2`), binding de facilitador via
  `msg.sender == a.facilitator`, sin logica de owner/admin en el
  contrato mismo. El approach tecnico (allowance HIP-336 + `transferFrom`
  via fachada ERC-20 de HIP-376 + autorizacion EIP-712 fuera de cadena)
  es coherente y esta bien justificado contra por que un allowance HTS
  puro no alcanza (no es single-use, no expira, no ata destinatario).

## Por que esta estancado -- NO es lo que parecia

**Correccion a la hipotesis inicial ("atorado en el gate de firma de
commits de CI"):** se verifico el estado real de los checks via
`gh pr checks 2919`:

```
Vercel               fail   Authorization required to deploy.
check-verified-commits   pass
labeler               pass
```

**`check-verified-commits` ya pasa.** El unico check en rojo es
`Vercel`, y no es un problema de firma de commits ni de calidad de
codigo -- es "Authorization required to deploy", el gate estandar de
Vercel que requiere que alguien del team de Coinbase en GitHub
autorice el deploy de preview para un contribuidor externo por primera
vez. Esto se resuelve con un clic de un maintainer, no con un rebase
del autor.

**El problema real es mas simple y mas remediable: cero revision.**
`reviews: []`, `reviewRequests: []` -- nadie del lado de mantenimiento
lo toco nunca. El PR no fue rechazado ni quedo tecnicamente bloqueado;
se le paso por alto durante 7 semanas.

## Una duda tecnica real que si vale la pena señalar

El mirror node reporta un **`admin_key` no vacio** en la cuenta del
contrato desplegado (`0.0.9556979`) -- esto es un campo a nivel
plataforma Hedera, independiente de que el Solidity no tenga logica de
owner. Si ese admin_key sigue activo, quien lo controle podria en
teoria emitir un `ContractUpdateTransaction` o
`ContractDeleteTransaction` sobre esa instancia especifica -- lo cual
no cuadra del todo con el lenguaje de la spec ("no owner, no admin, no
upgrade path", "nobody to compromise"). Esto **no invalida el diseño
del contrato ni la spec en si** (que es una descripcion de protocolo,
no atada a un despliegue especifico), pero si es algo a resolver antes
de tratar este despliegue puntual como referencia totalmente
trustless -- lo mas limpio seria un redeploy explicito con
`adminKey` nulo, o una aclaracion de que el admin_key actual es un
remanente de la cuenta operadora del deploy y se planea revocar.
**No se pudo decodificar el admin_key exacto para confirmar de quien
es -- marcado como pendiente de verificar, no como hallazgo cerrado.**

## Recomendacion concreta

No reimplementar desde cero -- seria desperdiciar trabajo real, ya
verificado, de alguien con trackrecord real en este mismo espacio.
Camino recomendado, en orden:

1. Comentar en el PR/issue confirmando la verificacion independiente
   (mismo patron que #3061): que los paquetes npm y el contrato
   desplegado son reales, que el approach es solido, y señalar el
   punto del admin_key como pregunta abierta, no como bloqueo.
2. Ofrecer ayuda concreta para destrabarlo -- ya sea haciendo el
   rebase+firma de commits si Madhav no vuelve, o simplemente pidiendo
   a un maintainer que autorice el preview de Vercel y revise, ya que
   `check-verified-commits` ya esta en verde.
3. **El build de la Parte 2 (servicio real cobrando por uso medido) no
   depende de que este PR se mergee.** `x402-hedera-upto` ya esta
   publicado y es instalable hoy -- se puede construir el demo contra
   el paquete real ahora mismo, en paralelo a lo de arriba.

Pendiente antes de publicar cualquier cosa en GitHub sobre esto:
confirmacion explicita del usuario, mismo criterio que se siguio con
el comentario en #3061.
