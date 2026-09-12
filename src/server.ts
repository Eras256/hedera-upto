// Scaffold inicial -- NO es el producto final. Falta decidir el
// estado y las decisiones pendientes (que servicio concreto se cobra).
//
// Excluido de tsconfig.json/CI: @x402/hedera trae su propio
// @x402/core@2.25.0 anidado, distinto del @x402/core@2.21.0 fijado en
// la raiz para compatibilidad con x402-hedera-upto (ver
// package.json) -- dos instalaciones de @x402/core producen tipos
// SchemeNetworkServer estructuralmente incompatibles entre si. No se
// resuelve aqui porque requeriria romper el pin de upto o dejar de
// usar @x402/hedera -- el esquema real y probado de este proyecto es
// upto, no exact.
//
// Flujo implementado: un resource server Express que gatea una ruta
// detras del esquema "exact" de x402 en Hedera (HBAR o HTS), delegando
// verify/settle a un facilitador externo. El flujo completo
// (cliente arma TransferTransaction parcialmente firmada -> facilitador
// verifica -> facilitador cobra fee y asienta) esta documentado en
// ../../x402/specs/schemes/exact/scheme_exact_hedera.md (spec real leida
// del repo x402-foundation/x402 clonado localmente, no inventada).
//
// Imports basados en el README verificado de @x402/hedera
// (paquete real, v2.25.0) -- confirmar contra la version instalada
// antes de asumir que la forma de los constructores no cambio.

import express from "express";
import { x402ResourceServer } from "@x402/core/server";
import { ExactHederaScheme } from "@x402/hedera/exact/server";

const PORT = Number(process.env.PORT ?? 3402);
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const PAYTO = process.env.HEDERA_PAYTO_ACCOUNT_ID;
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL;

if (!PAYTO) {
  throw new Error("Falta HEDERA_PAYTO_ACCOUNT_ID en .env -- ver .env.example");
}
if (!FACILITATOR_URL) {
  throw new Error("Falta X402_FACILITATOR_URL en .env -- ver .env.example");
}

// TODO: reemplazar por un facilitatorClient real que hable HTTP con
// FACILITATOR_URL (/verify, /settle) -- @x402/core expone el tipo
// esperado, pendiente de revisar su forma exacta antes de cablear esto
// contra un facilitador real. Este placeholder existe solo para que el
// scaffold compile y documente la forma del flujo.
const facilitatorClient = {
  url: FACILITATOR_URL,
};

const server = new x402ResourceServer(facilitatorClient as never);
server.register(
  "hedera:*",
  new ExactHederaScheme({
    defaultAssets: {
      "hedera:testnet": { asset: "0.0.0", decimals: 8 }, // HBAR en testnet
      "hedera:mainnet": { asset: "0.0.0", decimals: 8 }, // HBAR en mainnet
    },
  }),
);

const app = express();
app.use(express.json());

// TODO: la ruta real de negocio va aqui, envuelta por el middleware de
// x402 que produce el 402 + PaymentRequirements cuando falta pago, y
// deja pasar la request cuando el pago ya fue verificado/asentado.
// Pendiente decidir que se cobra.
app.get("/health", (_req, res) => {
  res.json({ ok: true, network: NETWORK, payTo: PAYTO });
});

app.listen(PORT, () => {
  console.log(`hedera-x402-service escuchando en :${PORT} (${NETWORK})`);
});
