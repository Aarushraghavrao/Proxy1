import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Rocks Proxy</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Poppins', sans-serif;
    color: white;
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 🔥 Animated glowing gradient background */
  body::before {
    content: "";
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at 20% 30%, #0f2027 0%, #203a43 30%, #2c5364 80%);
    animation: pulse 10s infinite alternate ease-in-out;
    z-index: -2;
  }
  @keyframes pulse {
    0% { filter: hue-rotate(0deg) brightness(1); }
    100% { filter: hue-rotate(60deg) brightness(1.2); }
  }

  /* Floating orbs for energy feel */
  .orb {
    position: fixed;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,255,0.4), transparent 70%);
    animation: float 20s infinite ease-in-out;
    z-index: -1;
  }
  .orb:nth-child(1) { width: 200px; height: 200px; top: 20%; left: 15%; animation-delay: 0s; }
  .orb:nth-child(2) { width: 300px; height: 300px; bottom: 10%; right: 20%; animation-delay: 5s; }
  .orb:nth-child(3) { width: 150px; height: 150px; bottom: 30%; left: 40%; animation-delay: 10s; }
  @keyframes float {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgba(20,20,20,0.6);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(0,198,255,0.3);
  }

  h1 {
    font-size: 2rem;
    text-shadow: 0 0 12px #00c6ff;
  }

  .settings-btn {
    background: rgba(255,255,255,0.1);
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    color: #00c6ff;
    font-size: 1.4rem;
    cursor: pointer;
    transition: transform 0.3s;
  }
  .settings-btn:hover { transform: rotate(25deg); }

  .search-box {
    margin: 25px 0;
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
  }
  button:hover { background: #0099cc; }

  .bookmarks {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin: 25px;
  }
  .bookmark {
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 18px;
    color: #00c6ff;
    text-decoration: none;
    transition: 0.3s;
  }
  .bookmark:hover {
    background: rgba(0,198,255,0.3);
    transform: scale(1.05);
  }

  footer {
    color: #ccc;
    margin: auto 0 20px;
  }

  /* Settings panel */
  #settingsPanel {
    position: fixed;
    top: 0; right: -400px;
    width: 300px;
    height: 100%;
    background: rgba(10,10,20,0.95);
    border-left: 2px solid #00c6ff;
    padding: 20px;
    transition: right 0.4s ease;
  }
  #settingsPanel.open { right: 0; }
  #settingsPanel h2 {
    text-align: center;
    text-shadow: 0 0 10px #00c6ff;
  }
  .close { position: absolute; top: 15px; right: 20px; background: none; border: none; color: white; cursor: pointer; }
</style>
</head>
<body>
  <div class="orb"></div><div class="orb"></div><div class="orb"></div>
  <header>
    <h1>🪨 Rocks</h1>
    <button class="settings-btn" id="openSettings">⚙️</button>
  </header>

  <div class="search-box">
    <input id="urlInput" type="text" placeholder="Enter a website URL..." />
    <button id="goBtn">Go</button>
  </div>

  <div class="bookmarks">

    <a class="bookmark" href="/proxy?url=https://crazygames.com">🎮 CrazyGames</a>
    <a class="bookmark" href="/proxy?url=https://discord.com">💬 Discord</a>
    <a class="bookmark" href="/proxy?url=https://web.whatsapp.com">📱 WhatsApp</a>
    <a class="bookmark" href="/proxy?url=https://youtube.com">▶️ YouTube</a>
    <a class="bookmark" href="/proxy?url=https://github.com">💻 GitHub</a>
    <a class="bookmark" href="/proxy?url=https://mail.google.com">📧 Gmail</a>
  </div>

  <footer>Created by Aarush Rao</footer>

  <div id="settingsPanel">
    <button class="close" id="closeSettings">✖</button>
    <h2>Settings</h2>
    <label>Change background hue:</label>
    <input type="range" id="hueSlider" min="0" max="360" />
  </div>

<script>
  const urlInput = document.getElementById("urlInput");
  const goBtn = document.getElementById("goBtn");
  const panel = document.getElementById("settingsPanel");
  const openSettings = document.getElementById("openSettings");
  const closeSettings = document.getElementById("closeSettings");
  const hueSlider = document.getElementById("hueSlider");

  goBtn.onclick = navigate;
  urlInput.addEventListener("keydown", e => { if (e.key === "Enter") navigate(); });

  function navigate() {
    let url = urlInput.value.trim();
    if (!url) return alert("Please enter a URL");
    if (!/^https?:\\/\\//i.test(url)) url = "https://" + url;
    window.location.href = "/proxy?url=" + encodeURIComponent(url);
  }

  openSettings.onclick = () => panel.classList.add("open");
  closeSettings.onclick = () => panel.classList.remove("open");

  hueSlider.oninput = () => {
    document.body.style.filter = \`hue-rotate(\${hueSlider.value}deg)\`;
  };
</script>
</body>
</html>`);
});

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("❌ Missing ?url= parameter");
  try {
    const response = await fetch(targetUrl);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(500).send("Proxy error: " + error.message);
  }
});

app.listen(PORT, () => console.log(`🚀 Rocks Proxy running on port ${PORT}`));
