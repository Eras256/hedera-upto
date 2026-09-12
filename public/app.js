const runButton = document.getElementById("run-button");
const inputText = document.getElementById("input-text");
const tracePanel = document.getElementById("trace-panel");
const traceList = document.getElementById("trace-list");
const resultPanel = document.getElementById("result-panel");
const resultBody = document.getElementById("result-body");
const errorPanel = document.getElementById("error-panel");
const errorBody = document.getElementById("error-body");

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function renderStepsProgressively(steps) {
  traceList.innerHTML = "";
  tracePanel.hidden = false;
  steps.forEach((step, i) => {
    const li = document.createElement("li");
    li.style.animationDelay = `${i * 120}ms`;
    const time = document.createElement("span");
    time.className = "step-time";
    time.textContent = fmtTime(step.at);
    const body = document.createElement("div");
    body.textContent = step.label;
    if (step.detail !== undefined) {
      const detail = document.createElement("span");
      detail.className = "step-detail";
      detail.textContent =
        typeof step.detail === "string" ? step.detail : JSON.stringify(step.detail);
      body.appendChild(detail);
    }
    li.appendChild(time);
    li.appendChild(body);
    traceList.appendChild(li);
  });
}

function renderResult(data) {
  resultPanel.hidden = false;
  resultBody.innerHTML = "";

  const amount = document.createElement("div");
  amount.className = "settlement-amount";
  amount.textContent = `Cobrado: ${data.settlement.amount} unidades atomicas de USDC testnet`;
  resultBody.appendChild(amount);

  if (data.digest) {
    const words = document.createElement("p");
    words.textContent = `${data.digest.wordCount} palabras procesadas. Mas frecuentes:`;
    resultBody.appendChild(words);

    const topWords = document.createElement("div");
    topWords.className = "top-words";
    data.digest.topWords.forEach(([word, count]) => {
      const span = document.createElement("span");
      span.textContent = `${word} (${count})`;
      topWords.appendChild(span);
    });
    resultBody.appendChild(topWords);
  }

  if (data.hashscanUrl) {
    const link = document.createElement("a");
    link.className = "hashscan-link";
    link.href = data.hashscanUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver la transaccion real en HashScan ->";
    resultBody.appendChild(link);
  }
}

function renderError(message) {
  errorPanel.hidden = false;
  errorBody.textContent = message;
}

runButton.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) return;

  tracePanel.hidden = true;
  resultPanel.hidden = true;
  errorPanel.hidden = true;
  runButton.disabled = true;
  runButton.textContent = "Procesando...";

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();

    if (data.steps?.length) {
      renderStepsProgressively(data.steps);
    }

    if (data.ok) {
      renderResult(data);
    } else {
      renderError(data.error ?? "Fallo desconocido");
    }
  } catch (err) {
    renderError(String(err));
  } finally {
    runButton.disabled = false;
    runButton.textContent = "Pagar y procesar";
  }
});
