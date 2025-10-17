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

  /* Animated glowing gradient background */
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

  /* Floating energy orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,255,0.28), transparent 70%);
    animation: float 20s infinite ease-in-out;
    z-index: -1;
  }
  .orb:nth-child(1) { width: 200px; height: 200px; top: 18%; left: 10%; animation-delay: 0s; }
  .orb:nth-child(2) { width: 300px; height: 300px; bottom: 8%; right: 18%; animation-delay: 5s; }
  .orb:nth-child(3) { width: 150px; height: 150px; bottom: 28%; left: 38%; animation-delay: 10s; }
  @keyframes float {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 36px;
    background: rgba(12,12,16,0.6);
    backdrop-filter: blur(8px);
    box-shadow: 0 0 10px rgba(0,198,255,0.18);
  }

  h1 { font-size: 1.8rem; text-shadow: 0 0 10px #00c6ff; margin: 0; }

  .settings-btn {
    background: rgba(255,255,255,0.06);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    color: #00c6ff;
    font-size: 1.25rem;
    cursor: pointer;
  }
  .settings-btn:hover { transform: rotate(18deg); transition: .25s; }

  .search-box {
    margin: 22px 0;
    display: flex;
    width: 92%;
    max-width: 680px;
  }
  input {
    flex: 1;
    padding: 12px 14px;
    border: none;
    outline: none;
    border-radius: 8px 0 0 8px;
    font-size: 1rem;
    background: rgba(255,255,255,0.06);
    color: white;
  }
  button {
    background: #00c6ff;
    border: none;
    padding: 11px 18px;
    border-radius: 0 8px 8px 0;
    color: #002;
    font-weight: 700;
    cursor: pointer;
  }
  button:hover { background: #0099cc; }

  .bookmarks {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin: 20px 18px 36px;
  }
  .bookmark {
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 10px 14px;
    color: #00c6ff;
    text-decoration: none;
    font-weight: 600;
  }
  .bookmark:hover { transform: scale(1.04); background: rgba(0,198,255,0.14); }

  footer { color: #bfcbd6; margin-top: auto; padding: 18px; font-size: 0.9rem; }

  /* Settings panel */
  #settingsPanel {
    position: fixed; top: 0; right: -360px;
    width: 320px; height: 100%;
    background: rgba(8,8,12,0.96);
    border-left: 2px solid #00c6ff;
    padding: 20px; transition: right 0.36s ease;
    z-index: 20;
  }
  #settingsPanel.open { right: 0; }
  #settingsPanel h2 { text-align: center; color: #fff; margin-bottom: 12px; }
  .close { position: absolute; top: 12px; right: 14px; background: none; border: none; color: #fff; cursor: pointer; }
  label{display:block;margin-bottom:6px;color:#cfeaf7}
  select,input[type="range"],input[type="color"],button.save{width:100%;padding:10px;border-radius:8px;border:none;margin-bottom:10px}
  button.save{background:#00c6ff;color:#002;font-weight:700}
</style>
</head>
<body>
  <div class="orb"></div><div class="orb"></div><div class="orb"></div>

  <header>
    <h1>🪨 Rocks</h1>
    <button class="settings-btn" id="openSettings" aria-label="Open settings">⚙️</button>
  </header>

  <div class="search-box">
    <input id="urlInput" type="text" placeholder="Enter a website URL (example.com)..." autocomplete="off" />
    <button id="goBtn">Go</button>
  </div>

  <div class="bookmarks">
    <a class="bookmark" href="/proxy?url=https://crazygames.com" target="_blank" rel="noopener">🎮 CrazyGames</a>
    <a class="bookmark" href="/proxy?url=https://discord.com" target="_blank" rel="noopener">💬 Discord</a>
    <a class="bookmark" href="/proxy?url=https://web.whatsapp.com" target="_blank" rel="noopener">📱 WhatsApp</a>
    <a class="bookmark" href="/proxy?url=https://youtube.com" target="_blank" rel="noopener">▶️ YouTube</a>
    <a class="bookmark" href="/proxy?url=https://github.com" target="_blank" rel="noopener">💻 GitHub</a>
    <a class="bookmark" href="/proxy?url=https://wikipedia.org" target="_blank" rel="noopener">📚 Wikipedia</a>
    <a class="bookmark" href="/proxy?url=https://mail.google.com" target="_blank" rel="noopener">📧 Gmail</a>
  </div>

  <!-- Safe placeholder for future approved ad networks (AdSense/Ezoic) -->
  <div id="adPlaceholder" style="width:320px;height:100px;margin:10px auto;opacity:0.0;"></div>

  <footer>Created by Aarush Rao</footer>

  <div id="settingsPanel" aria-hidden="true">
    <button class="close" id="closeSettings" aria-label="Close settings">✖</button>
    <h2>⚙️ Settings</h2>
    <label for="preset">Preset theme</label>
    <select id="preset">
      <option value="default">Default (navy glow)</option>
      <option value="black">Black (clean)</option>
      <option value="sunset">Sunset</option>
      <option value="space">Dark Space</option>
    </select>

    <label for="hue">Hue rotate</label>
    <input id="hue" type="range" min="0" max="360" value="0"/>

    <label for="color">Accent color</label>
    <input id="color" type="color" value="#00c6ff"/>

    <button class="save" id="saveSettings">Save</button>
  </div>

<script>
  // DOM refs
  const urlInput = document.getElementById('urlInput');
  const goBtn = document.getElementById('goBtn');
  const openSettings = document.getElementById('openSettings');
  const closeSettings = document.getElementById('closeSettings');
  const panel = document.getElementById('settingsPanel');
  const preset = document.getElementById('preset');
  const hue = document.getElementById('hue');
  const color = document.getElementById('color');
  const saveSettings = document.getElementById('saveSettings');

  // Navigate (Enter key + button)
  function navigate() {
    let url = urlInput.value.trim();
    if (!url) { alert('Please enter a URL'); return; }
    if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;
    window.location.href = '/proxy?url=' + encodeURIComponent(url);
  }
  goBtn.addEventListener('click', navigate);
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(); });

  // Settings panel open/close
  openSettings.addEventListener('click', () => {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
  });
  closeSettings.addEventListener('click', () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
  });

  // Apply saved theme if exists
  const savedTheme = localStorage.getItem('rocks-theme');
  if (savedTheme) {
    const t = JSON.parse(savedTheme);
    applyTheme(t);
    preset.value = t.preset || 'default';
    hue.value = t.hue || 0;
    color.value = t.accent || '#00c6ff';
  }

  // Apply theme helper
  function applyTheme({ preset='default', hue=0, accent='#00c6ff' } = {}) {
    // background presets
    if (preset === 'default') {
      document.body.style.setProperty('--bg', 'radial-gradient(circle at 20% 30%, #0f2027 0%, #203a43 30%, #2c5364 80%)');
    } else if (preset === 'black') {
      document.body.style.setProperty('--bg', '#000000');
    } else if (preset === 'sunset') {
      document.body.style.setProperty('--bg', 'linear-gradient(135deg,#ff7e5f,#feb47b)');
    } else if (preset === 'space') {
      document.body.style.setProperty('--bg', 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)');
    }
    // hue rotate (applies to the whole page as a filter)
    document.body.style.filter = \`hue-rotate(\${hue}deg)\`;
    // accent color (update header shadow and bookmark color)
    document.querySelectorAll('.bookmark').forEach(a => a.style.color = accent);
    document.querySelector('header').style.boxShadow = \`0 0 10px \${accent}33\`;
  }

  // Save settings
  saveSettings.addEventListener('click', () => {
    const theme = { preset: preset.value, hue: hue.value, accent: color.value };
    localStorage.setItem('rocks-theme', JSON.stringify(theme));
    applyTheme(theme);
    alert('✅ Theme saved');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
  });
</script>
</body>
</html>`);
});

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("❌ Missing ?url= parameter");
  try {
    const response = await fetch(targetUrl);
    // forward content-type
    const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
    const text = await response.text();
    res.set('Content-Type', contentType);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err && err.message ? err.message : err);
    res.status(500).send('Proxy error: ' + (err && err.message ? err.message : String(err)));
  }
});

app.listen(PORT, () => console.log(`🚀 Rocks Proxy running on port ${PORT}`));
