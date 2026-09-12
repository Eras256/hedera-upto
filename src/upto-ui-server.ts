// Web UI for the metered upto-server. Real backend orchestration
// (src/upto-orchestrator.ts), real Hedera testnet settlement -- this is
// not a mock of the flow, it's a browser window onto the same flow
// src/upto-client-demo.ts already proves works.
//
// Built by Monse (M0nsxx).

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runMeteredRequest } from "./upto-orchestrator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.UPTO_UI_PORT ?? 3405);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/run", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text : "";
  if (!text.trim()) {
    return res.status(400).json({ ok: false, error: "Falta texto" });
  }
  const result = await runMeteredRequest(text);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`upto-ui-server escuchando en :${PORT}`);
});
