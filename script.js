const temperatureHistory = [23.2, 23.8, 24.4, 24.9, 25.2, 25.8, 25.1, 24.7, 24.5, 24.3, 24.0, 23.9];
const historyLog = [
  { hour: "08:00", value: 23.2, status: "Normal" },
  { hour: "08:15", value: 23.7, status: "Normal" },
  { hour: "08:30", value: 24.1, status: "Normal" },
  { hour: "08:45", value: 24.8, status: "Normal" },
  { hour: "09:00", value: 25.2, status: "Normal" },
  { hour: "09:15", value: 25.7, status: "Normal" },
  { hour: "09:30", value: 26.1, status: "Normal" },
  { hour: "09:45", value: 27.2, status: "Atenção" },
  { hour: "10:00", value: 28.4, status: "Alerta" },
  { hour: "10:15", value: 27.9, status: "Atenção" },
  { hour: "10:30", value: 26.8, status: "Normal" },
  { hour: "10:45", value: 25.9, status: "Normal" }
];

const alertLog = [
  { hour: "08:35", value: 29.1, level: "Alto", status: "Urgente" },
  { hour: "09:12", value: 28.5, level: "Medio", status: "Atenção" },
  { hour: "10:00", value: 28.8, level: "Alto", status: "Urgente" },
  { hour: "10:45", value: 27.6, level: "Baixo", status: "Normal" }
];

const temperatureValue = document.getElementById("temperatureValue");
const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");
const statusLabel = document.getElementById("statusLabel");
const sensorState = document.getElementById("sensorState");
const connectBtn = document.getElementById("connectBtn");
const canvas = document.getElementById("temperatureChart");
const historyChart = document.getElementById("historyChart");
const historyTable = document.getElementById("historyTable");
const alertTable = document.getElementById("alertTable");

let port = null;
let reader = null;
let keepReading = false;

const updateStatus = (value) => {
  if (!statusLabel) return;

  const temp = Number(value);

  if (temp >= 28) {
    statusLabel.textContent = "Alerta";
    statusLabel.classList.remove("ok");
    statusLabel.classList.add("alert");
  } else {
    statusLabel.textContent = "Estável";
    statusLabel.classList.remove("alert");
    statusLabel.classList.add("ok");
  }
};

const updateStats = (value) => {
  if (!temperatureValue || !minValue || !maxValue) return;

  temperatureValue.textContent = Number(value).toFixed(1);
  updateStatus(value);

  const numericValues = temperatureHistory.concat(Number(value));
  const currentMin = Math.min(...numericValues).toFixed(1);
  const currentMax = Math.max(...numericValues).toFixed(1);

  minValue.textContent = currentMin;
  maxValue.textContent = currentMax;
};

const drawChart = () => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 24;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const values = temperatureHistory;
  const minTemp = Math.min(...values) - 2;
  const maxTemp = Math.max(...values) + 2;

  ctx.beginPath();
  values.forEach((point, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point - minTemp) / (maxTemp - minTemp || 1)) * (height - padding * 2);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = "#64d3ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  values.forEach((point, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point - minTemp) / (maxTemp - minTemp || 1)) * (height - padding * 2);

    ctx.moveTo(x, y);
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  });
  ctx.fillStyle = "#64d3ff";
  ctx.fill();
};

const addReading = (value) => {
  temperatureHistory.push(Number(value));
  if (temperatureHistory.length > 12) {
    temperatureHistory.shift();
  }

  updateStats(value);
  drawChart();
};

const simulateTemperature = () => {
  const randomTemp = (18 + Math.random() * 12).toFixed(1);
  addReading(randomTemp);
};

const parseTemperature = (text) => {
  const match = text.match(/TEMP[:=]\s*([-+]?\d+(?:\.\d+)?)/i) || text.match(/([-+]?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]);
};

const readFromSerial = async () => {
  if (!sensorState) return;

  if (!navigator.serial) {
    sensorState.textContent = "Fallback";
    setInterval(simulateTemperature, 2000);
    return;
  }

  try {
    sensorState.textContent = "Conectando...";
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    sensorState.textContent = "Online";
    if (connectBtn) connectBtn.textContent = "Arduino conectado";

    while (port.readable && keepReading) {
      reader = port.readable.getReader();
      const { value, done } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value).trim();
      const temp = parseTemperature(text);

      if (temp !== null) {
        addReading(temp);
      }
    }
  } catch (error) {
    console.error(error);
    sensorState.textContent = "Offline";
    setInterval(simulateTemperature, 2000);
  } finally {
    if (reader) {
      reader.releaseLock();
    }
  }
};

const renderHistoryChart = () => {
  if (!historyChart) return;

  const max = Math.max(...historyLog.map((item) => item.value)) + 1;
  const min = Math.min(...historyLog.map((item) => item.value)) - 1;

  historyChart.innerHTML = historyLog
    .map((item) => {
      const height = ((item.value - min) / (max - min || 1)) * 100;
      const colorClass = item.status === "Alerta" ? "alert-bar" : item.status === "Atenção" ? "warn-bar" : "normal-bar";

      return `
        <div class="history-column">
          <span class="history-value">${item.value.toFixed(1)}°</span>
          <div class="history-bar ${colorClass}" style="height: ${Math.max(height, 16)}%"></div>
          <small>${item.hour}</small>
        </div>
      `;
    })
    .join("");
};

const renderHistoryTable = () => {
  if (!historyTable) return;

  historyTable.innerHTML = historyLog
    .map(
      (item) => `
        <tr>
          <td>${item.hour}</td>
          <td>${item.value.toFixed(1)}°C</td>
          <td>${item.status}</td>
        </tr>
      `
    )
    .join("");
};

const renderAlertsTable = () => {
  if (!alertTable) return;

  alertTable.innerHTML = alertLog
    .map(
      (item) => `
        <tr>
          <td>${item.hour}</td>
          <td>${item.value.toFixed(1)}°C</td>
          <td>${item.level}</td>
          <td><span class="alert-status ${item.status === "Urgente" ? "danger" : item.status === "Atenção" ? "warning" : "normal"}">${item.status}</span></td>
        </tr>
      `
    )
    .join("");
};

if (connectBtn) {
  connectBtn.addEventListener("click", async () => {
    keepReading = true;
    await readFromSerial();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (canvas) {
    updateStats(temperatureHistory[temperatureHistory.length - 1]);
    drawChart();

    if (!navigator.serial) {
      if (sensorState) sensorState.textContent = "Fallback";
      setInterval(simulateTemperature, 2000);
    }
  }

  renderHistoryChart();
  renderHistoryTable();
  renderAlertsTable();
});
