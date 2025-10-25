import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Rocks Proxy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #000;
            color: white;
            text-align: center;
            margin: 0;
            padding: 20px;
          }
          input, button {
            padding: 10px;
            font-size: 16px;
          }
          iframe {
            width: 95%;
            height: 80vh;
            border: none;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>🌐 Rocks Proxy</h1>
        <input id="urlInput" type="text" placeholder="Enter a website URL..." />
        <button onclick="loadSite()">Go</button>
        <iframe id="viewer"></iframe>
        <script>
          function loadSite() {
            const input = document.getElementById('urlInput').value.trim();
            if (!input) return alert('Enter a URL!');
            const encoded = encodeURIComponent(input.startsWith('http') ? input : 'https://' + input);
            document.getElementById('viewer').src = '/proxy?url=' + encoded;
          }
          document.getElementById('urlInput').addEventListener('keypress', e => {
            if (e.key === 'Enter') loadSite();
          });
        </script>
      </body>
    </html>
  `);
});

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing URL");
  try {
    const response = await fetch(targetUrl);
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
