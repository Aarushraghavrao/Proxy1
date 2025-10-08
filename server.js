import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 👇 Step 1: Add a homepage so visiting the base link shows something
app.get("/", (req, res) => {
  res.send("✅ Proxy server is running! Use /proxy?url=https://example.com");
});

// 👇 Step 2: Main proxy route
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

// 👇 Step 3: Correct port for Render
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));

