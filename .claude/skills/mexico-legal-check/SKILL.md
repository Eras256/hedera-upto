---
name: mexico-legal-check
description: >
  Checks whether hedera-upto -- an x402-gated resource server on Hedera
  using the `upto` metered-payment scheme -- needs Mexican
  financial-regulatory registration: IFPE under Ley Fintech/LRITF,
  LFPIORPI's "actividad vulnerable" (art. 17 fr. XVI), facilitacion/
  intermediacion (art. 24 Bis 4 of the Acuerdo 115/2026 Reglas de
  Caracter General -- NOT the LFPIORPI law's own article numbering, see
  the law-vs-reglamento warning below), or intermediacion con valores
  under the Ley del Mercado de Valores. Use before scaling past testnet,
  before citing this project as "software-only" traction, or before a
  grant/bounty/investor submission leans on that claim. Covers where to
  get the real statute text and how to extract it when the PDF resists
  WebFetch, plus two portable citation-verification rules that apply to
  any Mexican legal citation, not just these eight tests.
allowed-tools: [Read, Write, Edit, WebFetch, WebSearch, Bash]
---

# Mexico legal check -- regtech posture for hedera-upto

AGENTS.md already states the standing inference for this project:
**"Jurisdiccion del operador: inferida Mexico, no confirmada para este
proyecto especificamente todavia."** This skill is the repeatable
*process* for testing whether a "software-only, non-custodial" posture
actually holds for hedera-upto's own design (the x402 `exact` and
`upto` schemes) -- not the substantive law itself, which is verified
below and should be re-checked live before it ages.

**This is not a first pass -- two real prior verifications already
exist, read both before starting:**

- **`lfpiorpi-24bis4-acuerdo-115`** (this project's persistent memory,
  verified 2026-09-12) -- confirms Art. 24 Bis 4 lives in the Acuerdo
  115/2026 reglamento, not the LFPIORPI law's own text, and that
  fraccion XVI has been in force since ~2019, not 2026/2027. Every
  numbering/date claim in this skill traces back to that verification.
- **`_strategy/legal/mexico.md`** (private, local-only, this project's
  own separate repo, ~238 lines, verified 2026-09-12) -- already applies
  this exact analysis to hedera-upto's own facilitator role specifically
  (the `X402UptoProxy` / `x402-hedera-upto` facilitator process, not a
  generic product), including the one concrete risk-escalation point
  identified so far: the facilitator staying single-merchant-only
  (serving only this project's own resource server) vs. becoming a
  public service any third-party resource server can use -- the README
  of `x402-hedera-upto` already invites the latter ("no public Hedera
  facilitator supports upto today, so you must run your own"). That
  document's own section 6 ("Zonas grises") already flags what's still
  genuinely unresolved -- read it before re-deriving the same open
  questions from scratch.

## READ THIS FIRST -- the law is not the same document as its reglamento

**Mexican financial regulation here comes in two independent layers,
each with its own article numbering. Confusing them produces false
negatives that look like careful research:**

1. **The law itself** (e.g. LFPIORPI, `diputados.gob.mx/LeyesBiblio/pdf/
   LFPIORPI.pdf`) -- has its own article numbers. LFPIORPI's own text has
   no "24 Bis" article of any kind (only 22 Bis, 33 Bis/Ter/Quater, 41
   Bis, 51 Bis/Ter, 54 Bis).
2. **The reglamento/Reglas de Caracter General SHCP issues to implement
   the law**, amended periodically by a numbered **Acuerdo** (e.g.
   Acuerdo 115/2026, DOF, edicion vespertina, 7-ago-2026) -- has its
   **own, separate** article numbering layered on top. **Art. 24 Bis 4
   lives here, not in the law.**

**If a search of only the law's own PDF for an article number doesn't
find it, that does not mean the article is fabricated -- it may live in
the reglamento instead.** Before concluding any citation "doesn't
exist," confirm which of the two document types it was originally
attributed to, and fetch that document specifically.

## The four tests, in order

Run these in this order -- each is independent, passing one does not
answer the next:

1. **IFPE (LRITF art. 22)** -- does hedera-upto open or hold a
   per-client electronic-payment-fund *account* (a balance it
   credits/debits over time)? The `upto` scheme accrues a metered debt
   that settles via the facilitator's verify/settle flow -- check
   whether that accrual is a stored balance the service itself moves
   unilaterally, or a time-boxed, non-custodial pending-settlement state
   the client's own signature still controls. If it only ever moves
   money in one-off direct transfers with no stored balance per client,
   this is a "no."
2. **LFPIORPI art. 17 fr. XVI ("actividad vulnerable")** -- is
   hedera-upto habitually and professionally commercializing or
   exchanging virtual assets as its own business (acting as the
   exchange), as opposed to selling an unrelated service (metered API
   access) that happens to be paid for in HBAR/HTS tokens? **This
   fraccion has been IN FORCE since ~10-Sep-2019** (added by the decree
   published DOF 9-Mar-2018, in force the day after publication, with an
   18-month vacatio legis on fraccion XVI specifically per that decree's
   own "Disposicion Transitoria" -- 18 months from ~10-Mar-2018 lands in
   September 2019, not a future date). It was later reformed/expanded
   (paragraphs 1-2 amended, paragraphs 3-4 added -- the custody/
   consideration thresholds) by the DOF 16-Jul-2025 decree, effective the
   very next day (17-Jul-2025), with no delay of its own.
3. **Art. 24 Bis 4 of the Acuerdo 115/2026 Reglas de Caracter General
   (facilitacion/intermediacion, does NOT require custody -- this
   article lives in the reglamento, not the LFPIORPI law's own
   numbering, see above)** -- the load-bearing question. **Art. 24 Bis 4
   is NOT an independent trigger separate from test #2 -- it is
   interpretive/operational content anchored to fraccion XVI itself.**
   Its own text opens "*Para efectos de lo previsto en la fraccion XVI
   del articulo 17 de la Ley, se entendera que se realiza la facilitacion
   o intermediacion...*" -- i.e., it defines what "facilitar" and
   "transferir" (words fraccion XVI's own text already uses) MEAN, and
   separately sets the aviso/reporting mechanics for that case (amount or
   fee charged, per the article's second paragraph). Treat tests #2 and
   #3 as one combined inquiry, not two independent gates: ask whether
   hedera-upto's infrastructure *connects, reconciles, or matches* a
   client's own buy/sell/exchange/custody operation with a counterparty,
   on the client's behalf -- that functional test does not require
   custody. The key distinction: being paid for your *own* work product
   (metered API responses) is not the same as *executing* someone else's
   transaction for them. If the service only ever computes and returns
   information, or only records a fact about a transaction that happened
   elsewhere, it does not "celebrar" or "conectar" that operation.
   The same anchoring pattern applies to Art. 24 Bis 2, 24 Bis 3
   (custodia), and 24 Bis 5 too -- all open "Para efectos de [lo previsto
   en] la fraccion XVI del articulo 17 de la Ley..." (24 Bis 2 uses
   "Tratandose de la Actividad Vulnerable a que se refiere la fraccion
   XVI..." instead, same anchoring effect). **24 Bis 6 anchors to
   fraccion XV instead** (real-estate leasing, unrelated). **The base
   Art. 24 Bis and 24 Bis 1 are NOT part of this fraccion-XVI-specific
   unit** -- they're general procedural provisions (Aviso timing/
   frequency rules) that touch many different fracciones at once (I, II,
   III, V Bis, IX, X, XI, XIII, XVI among others for 24 Bis; all
   Actividades Vulnerables generally for 24 Bis 1), not XVI exclusively.
   The actual fraccion-XVI-specific interpretive unit is just **24 Bis 2
   through 24 Bis 5 (four articles)**, not "the whole 24 Bis block." When
   citing any of them, cite which specific piece of fraccion XVI's own
   text it's elaborating, not just the article number in isolation.
   **Effective date of Art. 24 Bis 2-5 themselves, per the Acuerdo
   115/2026's own 12 transitorios:** the Acuerdo's Transitorio Primero
   sets a general 30-Nov-2026 entry into force "salvo las excepciones
   previstas en los siguientes articulos transitorios" -- Transitorios
   Segundo through Duodecimo each name specific later dates (1-Mar-2027
   for the risk-based methodology/Manual/Capitulos III Bis-Quinquies,
   1-Jun-2027 for automated mechanisms, 1-Ene-2028 for the first audit
   period, a ~30-May-2027 grace period -- see below -- plus a few 6/8/9-
   month relative deltas), **none of which name Art. 24 Bis 2, 3, 4, or 5
   specifically.** By elimination, these four articles fall under the
   general rule: **enforceable from 30-Nov-2026.** This is separate from
   fraccion XVI's own effective date (in force since 2019, per above) --
   the law's trigger has been live for years; the reglamento's specific
   elaboration of what "facilitar" means and its aviso mechanics becomes
   formally required 30-Nov-2026.
   **One real, narrower exception worth knowing -- Transitorio Decimo
   Segundo, verbatim:** *"Quienes realicen la Actividad Vulnerable
   establecida en la fraccion XVI del articulo 17 de la Ley, que se
   encuentren dados de alta en el Portal en Internet, deberan actualizar
   y entregar la informacion a la que se refiere el articulo 10 Bis de
   estas reglas, dentro de los seis meses contados a partir de la entrada
   en vigor de este Acuerdo."* Narrower than it first sounds: it gives
   **actors already registered under fraccion XVI before this Acuerdo** a
   6-month grace period from 30-Nov-2026 (landing ~30-May-2027) to
   *update their Art. 10 Bis registration info* (VASP registration
   details -- a Capitulo II Bis matter) -- it does **not** delay fraccion
   XVI's own applicability, and does **not** touch Art. 24 Bis 2-5 (a
   different chapter, Avisos e Informes). Don't conflate this
   administrative grace period with a substantive delay of the
   facilitacion/custodia tests.
4. **LMV art. 2, "Intermediacion con valores"** -- only relevant if
   hedera-upto ever touches securities/tokenized equities specifically
   (it currently does not -- it gates API access via HBAR/HTS token
   payment). Ask: does it (a) match buyers to sellers, (b) *execute* a
   securities transaction on a third party's behalf (as commissioner/
   mandatary/any capacity), or (c) trade its own account? A product that
   only reports facts about securities exposure, with zero valuation/
   profitability/buy-sell commentary, fails all three prongs.

## Other regimes to rule out -- don't stop at the four core tests

5. **ITF de fondeo colectivo / crowdfunding (LRITF arts. 15-21)** -- does
   hedera-upto pool capital from multiple funders into a project/company/
   loan, or match investors to a specific funding target? A separate
   CNBV-licensed figure from IFPE (art. 22) -- a product can clear the
   IFPE test (no stored per-client balance) and still trip this one if it
   operates a funding pool or matches funders to fundees, even briefly or
   non-custodially. Not currently applicable to a metered x402 resource
   server, but re-check if the product shape ever changes.
6. **Banxico Circular 4/2019 (activos virtuales)** -- restricts what
   Banxico-*regulated* entities (banks, IFPEs, IFCs, ITFs already
   licensed) can do with virtual assets; it does **not** by itself
   regulate an unregulated software product. Only becomes relevant if
   hedera-upto ever partners with, white-labels for, or is acquired by an
   entity Banxico already regulates.
7. **Beneficiario Controlador disclosure (CFF arts. 32-B Ter/Quater/
   Quinquies)** -- a general corporate-transparency regime that applies
   to essentially **every** Mexican legal entity, gated by *having a
   company*, not by activity type. Easy to conflate with LFPIORPI's
   "actividad vulnerable" AML regime (both are AML-adjacent, both use
   "Beneficiario Controlador" language) but they are legally distinct
   triggers. Relevant the moment this project's operator incorporates a
   company around it, independent of what the product does.
8. **Territorial/jurisdiction nexus -- genuinely open, flag as
   inference, not resolved yet.** Does LFPIORPI/LRITF reach a product
   whose company and servers sit outside Mexico but that markets to or is
   used by people in Mexico (or the reverse -- operator in Mexico,
   testnet/mainnet infrastructure and users elsewhere)? Don't assume
   either answer; this needs actual counsel before a real incorporation-
   jurisdiction decision leans on it.

## Software-only design checklist -- build it so each test comes back "no"

The affirmative, build-time counterpart to the four diagnostic tests
above:

- **Stay outside IFPE (test #1):** never accrue a per-client balance
  hedera-upto itself credits/debits over time outside the time-boxed
  metered-accrual window the `upto` scheme already uses. Every
  settlement should resolve directly to/from the client's own on-chain
  address via the facilitator's verify/settle step, client signature
  still controlling release.
- **Stay outside LFPIORPI actividad vulnerable / art. 17 fr. XVI
  (test #2):** don't become the counterparty that buys, sells, or
  exchanges HBAR/HTS tokens as hedera-upto's own business. Selling
  metered API access that happens to be *paid for* in HBAR/tokens is not
  the same as commercializing virtual assets.
- **Stay outside Art. 24 Bis 4 facilitacion/intermediacion (test #3,
  does NOT require custody and is the easiest to trip by accident):**
  hedera-upto's infrastructure must never be the thing that *connects,
  reconciles, or matches* two other parties' operation. It should only
  ever "compute and return a result" (serve the gated resource) or
  "record/report a fact about something that already happened elsewhere"
  (verify a payment already made). The moment it relays, routes, or
  matches an instruction between a client and a counterparty -- even
  non-custodially, even for a flat fee unrelated to transaction value --
  it is inside this article's functional test. A pure metered-API /
  resource-server shape (no matching of two transacting parties) is the
  cleanest posture here, and matches what hedera-upto already is.
  **A pure-fiat leg is not automatically exempt from this test just
  because fraccion XVI excludes fiat-denominated value** -- Art. 24 Bis 4
  covers "quien facilite... la intermediacion de flujos en moneda
  nacional o divisas" explicitly, so a bridge that only ever moves fiat
  can still be inside this article if it connects an operation where
  *some* leg in the chain touches a real virtual asset. The right
  question is transaction *topology*, not which currency hedera-upto's
  own leg happens to touch.
- **Stay outside LMV intermediacion con valores (test #4):** not
  currently applicable -- hedera-upto doesn't touch securities. Re-run
  this test the moment it ever does.
- **Stay outside the crowdfunding/ITF trigger (item #5 above):** don't
  pool capital from multiple payers toward one funding target inside
  hedera-upto itself, even transiently. If a future feature looks like
  "several clients contribute toward X," route it through a licensed
  third party rather than building the pooling mechanic in-house.
- **Watch the language, not just the code.** A technically clean,
  non-custodial architecture can still read as regulated activity to a
  reviewer or regulator if this project's own docs/marketing use words
  like "wallet," "exchange," "custody," "broker," "intermediary,"
  "matching engine," "asesor," "comisionista," "fondo," "deposit," or
  "balance" loosely. Name the actual capability (metered API access,
  settle directly between two self-custodied parties), not a
  financial-services category word -- the same instinct AGENTS.md
  already applies to project naming ("Nunca 'SDK' ni 'Developer' en el
  nombre/titulo publico del proyecto") extends here to regulatory
  framing.

## Getting the real statute text

Never rely on a compliance blog, a search-engine summary, or a secondary
aggregator (leyco.org, regcheq, etc.) as the final word for anything a
real submission or legal decision will lean on. Always get the primary
text:

- **Federal statutes** (LFPIORPI, LRITF, LMV): `diputados.gob.mx/LeyesBiblio/pdf/<ACRONYM>.pdf`, e.g. `LMV.pdf`, `LFPIORPI.pdf`.
- **DOF publications** (specific Acuerdos, reforms): `dof.gob.mx/nota_detalle.php?codigo=<CODE>&fecha=<DATE>` -- note the real download path is `nota_to_pdf.php` -> a client-side JS redirect to `abrirPDF.php?archivo=...`, which automated fetch tools often miss, following the wrapper page instead.

**Extraction, in order of preference:**

1. **`pdftotext` first.** WebFetch's own text extraction fails on these
   long PDFs ("compressed/encoded stream data"). Download the PDF
   (WebFetch saves it locally even when it can't extract text -- check
   the tool result for the saved path), then:
   ```
   pdftotext <file>.pdf <file>.txt
   grep -n -i "<term>" <file>.txt
   ```
2. **Real browser session with Ctrl+F, if `pdftotext` isn't available or
   the PDF is itself an image scan.**
3. **`dof.gob.mx/nota_detalle.php?codigo=<CODE>&fecha=<DATE>` as an HTML
   alternative to the PDF -- but its markup wraps almost every single
   word in its own `<span>`, so a plain `grep`/text-search on the raw
   HTML finds nothing even though the words are right there.** Fix: fetch
   the HTML, strip tags and HTML-unescape it in a small Python/Node
   snippet first, then grep the cleaned text. Also note: the `www.`
   subdomain of this host fails TLS cert validation; use the bare
   `dof.gob.mx` host.
4. **Cross-verify with a second independent method** before treating a
   quote as settled, not just single-sourced.
5. **A regex/grep search for a specific transitorio can silently miss
   compound Spanish ordinals** -- a search pattern that matches "Decimo"
   alone (or single-word ordinals) can fail to match "**Decimo
   Segundo**," "Decimo Primero," "Decimo Tercero," etc. Before concluding
   a transitorio doesn't exist in a document already extracted, grep
   loosely first (`grep -n -i "d.cimo"`, catching the whole family)
   rather than for one specific compound ordinal string.

## General citation discipline -- applies to any Mexican legal citation, not just these eight tests

Two portable rules, useful beyond this specific registration question --
they produced a real correction once (see `lfpiorpi-24bis4-acuerdo-115`
for that incident) and are worth keeping as a standing habit whenever a
Mexican legal citation comes up anywhere else in this project:

- **Never cite a Mexican statute article as "Art. X de \<Ley\>" alone if
  it actually lives in that law's reglamento/Reglas de Caracter
  General/Acuerdo.** Always name which of the two documents it's in,
  plus that document's own publication date -- the two have independent
  article numbering, and a bare article number is genuinely ambiguous
  between them.
- **Never propagate a legal citation relayed from another session or a
  secondary source, including a correction of an earlier claim, without
  verifying the primary PDF yourself.** Neither the original claim, nor
  a correction, nor a retraction of a correction, is trustworthy on its
  own -- download and grep the real document every time.

## Prior verified reference in this project

Two real prior passes already exist -- see the pointers at the top of
this file. Neither is a finished legal conclusion; both say so
explicitly. Update them (don't silently replace or duplicate them) after
a fresh run of this skill's eight tests, and only add a new memory entry
if this run finds something genuinely new that neither document already
covers.

## When you're done

Update `_strategy/legal/mexico.md` with anything this run adds or
changes, and update (or add to) the `lfpiorpi-24bis4-acuerdo-115` memory
entry rather than starting a fresh one, unless this run surfaces
something that memory doesn't already cover. Mark which parts are
primary-source confirmed vs. reasoned inference. This is regulatory
research for planning, **not formal legal advice** -- say so explicitly,
every time.
