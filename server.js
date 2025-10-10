import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 🌌 Homepage with embedded viewer
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Aarush Proxy Browser</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: "Poppins", sans-serif;
          background: radial-gradient(circle at top left, #0f2027, #203a43, #2c5364);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }
        h1 {
          margin-top: 20px;
          font-size: 2.2rem;
          text-shadow: 0 0 8px #00c6ff;
        }
        .search-box {
          margin: 15px 0;
          display: flex;
          width: 90%;
          max-width: 600px;
        }
        input {
          flex: 1;
          padding: 10px 15px;
          border: none;
          outline: none;
          border-radius: 5px 0 0 5px;
          font-size: 1rem;
        }
        button {
          background: #00c6ff;
          border: none;
          padding: 10px 20px;
          border-radius: 0 5px 5px 0;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #0099cc;
        }
        iframe {
          flex: 1;
          width: 90%;
          max-width: 1000px;
          border: 2px solid #00c6ff;
          border-radius: 10px;
          background: white;
          margin-bottom: 10px;
        }
        footer {
          color: #ccc;
          font-size: 0.9rem;
          margin-bottom: 10px;
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
      <h1>🌐 Aarush Proxy Browser</h1>
      <div class="search-box">
        <input id="urlInput" type="text" placeholder="Enter a website URL..." />
        <button onclick="loadSite()">Go</button>
      </div>
      <iframe id="viewer" src="about:blank" height="500px"></iframe>
      <footer>Made by Aarush • Powered by Render</footer>

      <script>
        function loadSite() {
          const url = document.getElementById('urlInput').value.trim();
          if (!url) return alert("Please enter a URL first!");
          const encoded = encodeURIComponent(url.startsWith('http') ? url : 'https://' + url);
          document.getElementById('viewer').src = '/proxy?url=' + encoded;
        }

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

// 🔗 Proxy route
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

// 🚀 Start server
app.listen(PORT, () => console.log(`

