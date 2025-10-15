import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

/* =======================
   MAIN PAGE
======================= */
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Rocks Proxy</title>
<style>
  *{box-sizing:border-box}
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: var(--bg, linear-gradient(135deg,#0f2027,#203a43,#2c5364));
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    transition: background 0.4s ease;
  }
  h1 {
    margin-top: 40px;
    font-size: 2.5rem;
    text-shadow: 0 0 15px #00c6ff;
    animation: glow 2s ease-in-out infinite alternate;
  }
  @keyframes glow {
    from { text-shadow: 0 0 10px #00c6ff; }
    to { text-shadow: 0 0 25px #00c6ff; }
  }
  .search-box {
    margin: 20px 0;
    display: flex;
    width: 90%;
    max-width: 600px;
  }
  input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    outline: none;
    border-radius: 8px 0 0 8px;
    font-size: 1rem;
    background: rgba(255,255,255,0.08);
    color: white;
  }
  button {
    background: #00c6ff;
    border: none;
    padding: 12px 20px;
    border-radius: 0 8px 8px 0;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  button:hover {
    background: #0099cc;
  }
  .nav {
    margin-top: 20px;
  }
  .nav a {
    color: #00c6ff;
    text-decoration: none;
    font-weight: 600;
    padding: 8px 14px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    transition: background 0.3s;
  }
  .nav a:hover {
    background: rgba(255,255,255,0.15);
  }
  footer {
    margin-top: auto;
    color: #ccc;
    font-size: 0.9rem;
    padding: 15px 0;
  }
</style>
</head>
<body>
  <h1>🌐 Rocks Proxy</h1>
  <div class="search-box">
    <input id="urlInput" type="text" placeholder="Enter a website URL..." />
    <button id="goBtn">Go</button>
  </div>
  <div class="nav">
    <a href="/settings">⚙️ Settings</a>
  </div>
  <footer>Created by Aarush Rao</footer>

<script>
  // Load saved background preference
  const savedBg = localStorage.getItem("rocks-bg");
  if (savedBg) document.body.style.setProperty("--bg", savedBg);

  const input = document.getElementById('urlInput');
  const btn = document.getElementById('goBtn');

  btn.addEventListener('click', go);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') go();
  });

  function go() {
    let url = input.value.trim();
    if (!url) return alert("Please enter a URL");
    if (!/^https?:\\/\\//i.test(url)) url = "https://" + url;
    window.location.href = '/proxy?url=' + encodeURIComponent(url);
  }
</script>
</body>
</html>`);
});

/* =======================
   SETTINGS PAGE
======================= */
app.get("/settings", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Settings - Rocks Proxy</title>
<style>
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: var(--bg, linear-gradient(135deg,#0f2027,#203a43,#2c5364));
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    transition: background 0.4s ease;
  }
  h2 { margin-top: 40px; text-shadow: 0 0 10px #00c6ff; }
  .options {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 10px;
  }
  select, input[type="color"], button {
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
  }
  button {
    background: #00c6ff;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
  }
  button:hover { background: #0099cc; }
  a { color: #00c6ff; text-decoration: none; margin-top: 20px; }
</style>
</head>
<body>
  <h2>⚙️ Settings</h2>
  <div class="options">
    <label>
      Choose a preset background:
      <select id="presetSelect">
        <option value="linear-gradient(135deg,#0f2027,#203a43,#2c5364)">Default</option>
        <option value="linear-gradient(135deg,#ff7e5f,#feb47b)">Sunset</option>
        <option value="radial-gradient(circle at top left,#1a1a2e,#16213e)">Dark Space</option>
      </select>
    </label>
    <label>
      Or pick a custom color:
      <input type="color" id="colorPicker" value="#2c5364">
    </label>
    <button id="saveBtn">Save Settings</button>
  </div>
  <a href="/">⬅️ Back to Rocks Proxy</a>

<script>
  const savedBg = localStorage.getItem("rocks-bg");
  if (savedBg) document.body.style.setProperty("--bg", savedBg);

  const presetSelect = document.getElementById("presetSelect");
  const colorPicker = document.getElementById("colorPicker");
  const saveBtn = document.getElementById("saveBtn");

  // Preview background on change
  presetSelect.addEventListener("change", () => {
    document.body.style.setProperty("--bg", presetSelect.value);
  });
  colorPicker.addEventListener("input", () => {
    document.body.style.setProperty("--bg", colorPicker.value);
  });

  saveBtn.addEventListener("click", () => {
    const bg = document.body.style.getPropertyValue("--bg");
    localStorage.setItem("rocks-bg", bg);
    alert("✅ Background saved!");
  });
</script>
</body>
</html>`);
});

/* =======================
   PROXY FUNCTION
======================= */
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("❌ Missing ?url= parameter");
  try {
    const response = await fetch(targetUrl);
    const type = response.headers.get("content-type") || "text/html";
    const data = await response.text();
    res.set("Content-Type", type);
    res.send(data);
  } catch (error) {
    res.status(500).send("Proxy error: " + error.message);
  }
});

app.listen(PORT, () => console.log(`🚀 Rocks Proxy running on port ${PORT}`));
