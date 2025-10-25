import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve homepage
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🌐 Rocks Proxy</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        color: #fff;
        background: var(--bg-color, #000);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        overflow-x: hidden;
        transition: background 0.5s;
      }
      h1 {
        margin: 20px 0;
        font-size: 2.2rem;
        text-shadow: 0 0 10px #00c6ff;
        text-align: center;
      }
      .top-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        flex-wrap: wrap;
      }
      .settings-btn {
        background: transparent;
        border: 2px solid #00c6ff;
        color: #00c6ff;
        border-radius: 10px;
        padding: 8px 14px;
        cursor: pointer;
        font-size: 1rem;
        transition: 0.3s;
      }
      .settings-btn:hover {
        background: #00c6ff;
        color: #000;
      }
      .search-box {
        display: flex;
        width: 90%;
        max-width: 700px;
        margin: 10px 0;
      }
      input {
        flex: 1;
        padding: 12px 15px;
        border: none;
        outline: none;
        border-radius: 8px 0 0 8px;
        font-size: 1rem;
      }
      button {
        background: #00c6ff;
        border: none;
        padding: 12px 20px;
        border-radius: 0 8px 8px 0;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover {
        background: #0099cc;
      }
      .bookmarks {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin: 15px 0;
      }
      .bookmark {
        text-decoration: none;
        background: rgba(255,255,255,0.1);
        border: 1px solid #00c6ff;
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        transition: all 0.3s;
      }
      .bookmark:hover {
        background: #00c6ff;
        color: #000;
      }
      footer {
        margin-top: auto;
        margin-bottom: 15px;
        color: #ccc;
        font-size: 0.9rem;
        text-align: center;
      }
      #settingsModal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.95);
        border: 2px solid #00c6ff;
        border-radius: 12px;
        padding: 25px;
        z-index: 10;
        width: 90%;
        max-width: 350px;
        color: white;
        text-align: center;
      }
      #settingsModal h2 {
        margin-top: 0;
      }
      #settingsModal input[type="color"] {
        margin-top: 10px;
        width: 100%;
        height: 50px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      #settingsModal button {
        margin-top: 15px;
        background: #00c6ff;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        color: #000;
        font-weight: bold;
        cursor: pointer;
      }
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
      }
      @media (max-width: 600px) {
        h1 {
          font-size: 1.7rem;
        }
        .search-box {
          flex-direction: column;
        }
        input, button {
          border-radius: 8px;
          margin: 4px 0;
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <canvas id="bg"></canvas>
    <div class="top-bar">
      <h1>🌐 Rocks Proxy</h1>
      <button class="settings-btn" onclick="toggleSettings()">⚙️ Settings</button>
    </div>

    <div class="search-box">
      <input id="urlInput" type="text" placeholder="Enter a website URL..." />
      <button onclick="loadSite()">Go</button>
    </div>

    <div class="bookmarks">
      <a class="bookmark" href="#" onclick="openLink('https://crazygames.com')">CrazyGames</a>
      <a class="bookmark" href="#" onclick="openLink('https://discord.com')">Discord</a>
      <a class="bookmark" href="#" onclick="openLink('https://whatsapp.com')">WhatsApp</a>
      <a class="bookmark" href="#" onclick="openLink('https://youtube.com')">YouTube</a>
      <a class="bookmark" href="#" onclick="openLink('https://google.com')">Google</a>
    </div>

    <div id="settingsModal">
      <h2>🎨 Customize Background</h2>
      <input type="color" id="colorPicker" />
      <button onclick="saveSettings()">Save</button>
    </div>

    <footer>Made by Aarush Rao • Hosted on Vercel</footer>

    <script>
      function loadSite() {
        const input = document.getElementById('urlInput').value.trim();
        if (!input) return alert('Please enter a URL!');
        const url = input.startsWith('http') ? input : 'https://' + input;
        window.open('/proxy?url=' + encodeURIComponent(url), '_blank');
      }

      function openLink(link) {
        window.open('/proxy?url=' + encodeURIComponent(link), '_blank');
      }

      document.getElementById('urlInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') loadSite();
      });

      function toggleSettings() {
        const modal = document.getElementById('settingsModal');
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
      }

      function saveSettings() {
        const color = document.getElementById('colorPicker').value;
        document.body.style.setProperty('--bg-color', color);
        localStorage.setItem('bgColor', color);
        toggleSettings();
      }

      window.addEventListener('load', () => {
        const savedColor = localStorage.getItem('bgColor');
        if (savedColor) {
          document.body.style.setProperty('--bg-color', savedColor);
        }
      });

      const c = document.getElementById("bg");
      const ctx = c.getContext("2d");
      c.width = innerWidth;
      c.height = innerHeight;
      const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
      }));
      function animate() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#00c6ff";
        stars.forEach(s => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          s.x += s.dx;
          s.y += s.dy;
          if (s.x < 0 || s.x > c.width) s.dx *= -1;
          if (s.y < 0 || s.y > c.height) s.dy *= -1;
        });
        requestAnimationFrame(animate);
      }
      animate();
    </script>
  </body>
  </html>
  `);
});

// Proxy route
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("❌ Missing ?url= parameter");
  try {
    const response = await fetch(targetUrl);
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, () => console.log(\`✅ Rocks Proxy running on port \${PORT}\`));
