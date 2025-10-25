import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

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
        height: 100vh;
        font-family: "Poppins", sans-serif;
        color: #fff;
        background: var(--bg-color, #000);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        transition: background 0.5s;
      }
      h1 {
        margin-top: 20px;
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
        color: #000;
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
      footer {
        margin-top: auto;
        margin-bottom: 10px;
        color: #ccc;
        font-size: 0.9rem;
      }
      #settingsModal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        border: 2px solid #00c6ff;
        border-radius: 10px;
        padding: 20px;
        z-index: 10;
        color: white;
      }
      #settingsModal h2 {
        margin-top: 0;
      }
      #settingsModal input[type="color"] {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      #settingsModal button {
        margin-top: 15px;
        background: #00c6ff;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        color: #000;
        cursor: pointer;
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

    <!-- Settings Modal -->
    <div id="settingsModal">
      <h2>🎨 Customize Background</h2>
      <input type="color" id="colorPicker" />
      <button onclick="saveSettings()">Save</button>
    </div>

    <footer>Made by Aarush Rao • Hosted on Vercel</footer>

    <script>
      // open site in new tab
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

      // background color logic
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

      // animated stars
      const c = document.getElementById("bg");
      const ctx = c.getContext("2d");
      c.width = innerWidth;
      c.height =
