import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rocks Proxy</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        height: 100vh;
        background: radial-gradient(circle at top left, #0f2027, #203a43, #2c5364);
        font-family: 'Poppins', sans-serif;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
      }
      h1 {
        margin: 20px 0 10px;
        font-size: 2.4rem;
        text-shadow: 0 0 10px #00c6ff;
      }
      .top-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
      }
      .settings-btn {
        background: transparent;
        border: 2px solid #00c6ff;
        color: #00c6ff;
        border-radius: 10px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s;
      }
      .settings-btn:hover {
        background: #00c6ff;
        color: #fff;
      }
      .search-box {
        margin: 10px 0;
        display: flex;
        width: 90%;
        max-width: 700px;
      }
      input {
        flex: 1;
        padding: 10px 15px;
        border: none;
        outline: none;
        border-radius: 8px 0 0 8px;
        font-size: 1rem;
      }
      button {
        background: #00c6ff;
        border: none;
        padding: 10px 20px;
        border-radius: 0 8px 8px 0;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover {
        background: #0099cc;
      }
      .bookmarks {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;
        flex-wrap: wrap;
        justify-content: center;
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
        color: black;
      }
      iframe {
        flex: 1;
        width: 90%;
        max-width: 1200px;
        border: 2px solid #00c6ff;
        border-radius: 10px;
        background: white;
        margin-bottom: 10px;
      }
      footer {
        margin-bottom: 10px;
        color: #ccc;
        font-size: 0.9rem;
      }
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
      }
    </style>
  </head>
  <body>
    <canvas id="bg"></canvas>
    <div class="top-bar">
      <h1>🌐 Rocks Proxy</h1>
      <button class="settings-btn" onclick="alert('Settings will be added soon!')">⚙️ Settings</button>
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
    <iframe id="viewer" src="about:blank"></iframe>
    <footer>Made by Aarush Rao • Hosted on Vercel</footer>

    <script>
      function loadSite() {
        const input = document.getElementById('urlInput').value.trim();
        if (!input) return alert('Please enter a URL first!');
        const url = input.startsWith('http') ? input : 'https://' + input;
        document.getElementById('viewer').src = '/proxy?url=' + encodeURIComponent(url);
      }

      function openLink(link) {
        document.getElementById('viewer').src = '/proxy?url=' + encodeURIComponent(link);
      }

      document.getElementById('urlInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') loadSite();
      });

      // ✨ Animated background stars
      const c = document.getElementById("bg");
      const ctx = c.getContext("2d");
      c.width = innerWidth;
      c.height = innerHeight;
      const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      }));
      function animate() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#00c6ff";
        stars.forEach((s) => {
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

// Start server
app.listen(PORT, () => console.log(\`✅ Rocks Proxy running on port \${PORT}\`));
