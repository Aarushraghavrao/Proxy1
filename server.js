import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 🌈 Styled homepage
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Proxy Server Online</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #007BFF, #00C6FF);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          margin: 0;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.2rem;
          max-width: 600px;
          line-height: 1.6;
        }
        code {
          background: rgba(255,255,255,0.2);
          padding: 3px 6px;
          border-radius: 4px;
        }
        a {
          color: #fff;
          text-decoration: none;
          background: rgba(255,255,255,0.2);
          padding: 8px 15px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        a:hover {
          background: rgba(255,255,255,0.4);
        }
        footer {
          position: absolute;
          bottom: 20px;
          font-size: 0.9rem;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <h1>✅ Proxy Server is Live!</h1>
      <p>
        To use this proxy, append 
        <code>/proxy?url=https://example.com</code> 
        to the end of the URL.
      </p>
      <p>
        Example:
        <br />
        <a href="/proxy?url=https://example.com" target="_blank">
          Try Proxy with Example.com
        </a>
      </p>
      <footer>Powered by Render | Created by Aarush</footer>
    </body>
    </html>
  `);
});

// 🚀 Proxy route
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

// 🔊 Start server
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
