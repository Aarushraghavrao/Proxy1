// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets if needed in future
app.use(express.static("public"));

// Home page: search box with Enter key + background customizer + redirect
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Aarush Proxy Browser</title>
<style>
  *{box-sizing:border-box}
  html,body{height:100%;margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial;}
  body{
    display:flex;flex-direction:column;align-items:center;
    justify-content:flex-start;
    color:#fff;
    transition:background 0.35s ease;
    background: linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%);
    min-height:100vh;
    padding:28px 12px;
  }
  .card{width:100%;max-width:980px;display:flex;flex-direction:column;align-items:center;gap:14px}
  h1{margin:6px 0 0;font-size:2rem;text-shadow:0 4px 24px rgba(0,198,255,0.12)}
  p.lead{color:#cfeaf7; margin:0 0 6px}
  .controls{display:flex;width:100%;max-width:720px}
  input[type="text"]{
    flex:1;padding:12px 14px;border-radius:8px 0 0 8px;border:none;font-size:16px;
    outline:none;background:rgba(255,255,255,0.06);color:#fff;
  }
  button{padding:12px 16px;border-radius:0 8px 8px 0;border:none;background:#00c6ff;color:#003;cursor:pointer;font-weight:600}
  button:hover{opacity:0.95}
  .options{display:flex;gap:8px;margin-top:8px;align-items:center;}
  select,input[type="color"]{padding:8px;border-radius:6px;border:none}
  .footer{color:rgba(255,255,255,0.7);font-size:13px;margin-top:18px}
</style>
</head>
<body>
  <div class="card">
    <h1>🌐 Aarush Proxy Browser</h1>
    <p class="lead">Type a URL, press Enter or click Go. Customize background below.</p>

    <div class="controls">
      <input id="urlInput" type="text" placeholder="https://example.com or example.com" autocomplete="off" />
      <button id="goBtn">Go</button>
    </div>

    <div class="options">
      <label>
        Background:
        <select id="bgSelect">
          <option value="default">Default gradient</option>
          <option value="dark">Dark nebula</option>
          <option value="sunset">Sunset</option>
          <option value="solid">Solid color</option>
        </select>
      </label>
      <label style="display:flex;align-items:center;gap:8px">
        Pick color:
        <input id="colorPicker" type="color" value="#2c5364" />
      </label>
      <button id="resetBtn" style="background:#fff;color:#003;padding:8px;border-radius:8px">Reset</button>
    </div>

    <div class="footer">Made by Aarush • Powered by Render / Your host</div>
  </div>

<script>
  // helpers
  function makeTarget(url) {
    url = url.trim();
    if (!url) return "";
    if (!/^https?:\\/\\//i.test(url)) url = "https://" + url;
    return "/proxy?url=" + encodeURIComponent(url);
  }

  function navigateTo(url) {
    // full redirect (not iframe)
    window.location.href = url;
  }

  // DOM
  const urlInput = document.getElementById("urlInput");
  const goBtn = document.getElementById("goBtn");
  const bgSelect = document.getElementById("bgSelect");
  const colorPicker = document.getElementById("colorPicker");
  const resetBtn = document.getElementById("resetBtn");

  // Enter key handler
  urlInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      goBtn.click();
    }
  });

  // Go button
  goBtn.addEventListener("click", () => {
    const target = makeTarget(urlInput.value);
    if (!target) { alert("Please enter a URL"); return; }
    navigateTo(target);
  });

  // Background customization
  function applyBackground(mode, colorHex) {
    if (mode === "default") {
      document.body.style.background = "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)";
    } else if (mode === "dark") {
      document.body.style.background = "radial-gradient(circle at 10% 20%, #0b132b, #000814)";
    } else if (mode === "sunset") {
      document.body.style.background = "linear-gradient(135deg,#ff7e5f,#feb47b)";
    } else if (mode === "solid") {
      document.body.style.background = colorHex || "#2c5364";
    } else {
      document.body.style.background = mode;
    }
  }

  bgSelect.addEventListener("change", () => {
    const mode = bgSelect.value;
    applyBackground(mode, colorPicker.value);
  });
  colorPicker.addEventListener("input", () => {
    if (bgSelect.value === "solid") applyBackground("solid", colorPicker.value);
  });
  resetBtn.addEventListener("click", () => {
    bgSelect.value = "default"; colorPicker.value = "#2c5364";
    applyBackground("default");
  });

  // initial
  applyBackground("default");
</script>
</body>
</html>`);
});

// Proxy endpoint that fetches and returns HTML (simple)
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("❌ Missing ?url= parameter");

  try {
    const response = await fetch(targetUrl, {
      // forward common headers could be added here if needed
    });
    // forward content-type if provided
    const contentType = response.headers.get("content-type") || "text/html; charset=utf-8";
    const body = await response.text();
    res.set("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy fetch error:", err && (err.message || err));
    res.status(500).send("Proxy error: " + (err && err.message ? err.message : String(err)));
  }
});

app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
