import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Rocks Proxy</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Poppins',sans-serif;
    background:var(--bg,linear-gradient(135deg,#0f2027,#203a43,#2c5364));
    color:white;
    display:flex;
    flex-direction:column;
    align-items:center;
    min-height:100vh;
    overflow:hidden;
    transition:background 0.4s ease;
  }
  h1{
    margin-top:40px;
    font-size:2.5rem;
    text-shadow:0 0 15px #00c6ff;
    animation:glow 2s ease-in-out infinite alternate;
  }
  @keyframes glow{
    from{text-shadow:0 0 10px #00c6ff;}
    to{text-shadow:0 0 25px #00c6ff;}
  }
  .search-box{
    margin:20px 0;
    display:flex;
    width:90%;
    max-width:600px;
  }
  input{
    flex:1;
    padding:12px 15px;
    border:none;
    outline:none;
    border-radius:8px 0 0 8px;
    font-size:1rem;
    background:rgba(255,255,255,0.08);
    color:white;
  }
  button{
    background:#00c6ff;
    border:none;
    padding:12px 20px;
    border-radius:0 8px 8px 0;
    color:white;
    font-size:1rem;
    cursor:pointer;
    transition:background 0.3s;
  }
  button:hover{background:#0099cc;}
  .settings-btn{
    position:fixed;
    top:20px;
    right:20px;
    background:rgba(255,255,255,0.1);
    border:none;
    border-radius:50%;
    width:48px;
    height:48px;
    color:#00c6ff;
    font-size:1.4rem;
    cursor:pointer;
    backdrop-filter:blur(6px);
    transition:transform 0.3s;
  }
  .settings-btn:hover{transform:rotate(20deg);}
  footer{
    margin-top:auto;
    padding:15px;
    color:#ccc;
    font-size:0.9rem;
  }

  /* Slide-in settings panel */
  #settingsPanel{
    position:fixed;
    top:0;right:-400px;
    width:320px;height:100%;
    background:rgba(10,10,20,0.95);
    backdrop-filter:blur(10px);
    border-left:2px solid #00c6ff;
    box-shadow:-2px 0 10px rgba(0,198,255,0.3);
    padding:20px;
    transition:right 0.4s ease;
    display:flex;
    flex-direction:column;
    gap:20px;
    z-index:10;
  }
  #settingsPanel.open{right:0;}
  #settingsPanel h2{text-align:center;text-shadow:0 0 10px #00c6ff;}
  select,input[type="color"],button.save{
    width:100%;
    padding:10px;
    font-size:1rem;
    border:none;
    border-radius:8px;
  }
  button.save{
    background:#00c6ff;
    color:white;
    cursor:pointer;
  }
  button.save:hover{background:#0099cc;}
  .close{
    position:absolute;
    top:15px;
    right:20px;
    font-size:1.2rem;
    background:none;
    border:none;
    color:#fff;
    cursor:pointer;
  }
</style>
</head>
<body>
  <h1>🌐 Rocks Proxy</h1>
  <div class="search-box">
    <input id="urlInput" type="text" placeholder="Enter a website URL...">
    <button id="goBtn">Go</button>
  </div>
  <button class="settings-btn" id="openSettings">⚙️</button>

  <footer>Created by Aarush Rao</footer>

  <div id="settingsPanel">
    <button class="close" id="closeSettings">✖</button>
    <h2>⚙️ Settings</h2>
    <label>Choose a preset background:</label>
    <select id="presetSelect">
      <option value="linear-gradient(135deg,#0f2027,#203a43,#2c5364)">Default</option>
      <option value="linear-gradient(135deg,#ff7e5f,#feb47b)">Sunset</option>
      <option value="radial-gradient(circle at top left,#1a1a2e,#16213e)">Dark Space</option>
      <option value="linear-gradient(135deg,#0f0c29,#302b63,#24243e)">Violet Nights</option>
    </select>
    <label>Or pick a custom color:</label>
    <input type="color" id="colorPicker" value="#2c5364">
    <button class="save" id="saveSettings">Save</button>
  </div>

<script>
  const urlInput=document.getElementById("urlInput");
  const goBtn=document.getElementById("goBtn");
  const panel=document.getElementById("settingsPanel");
  const openSettings=document.getElementById("openSettings");
  const closeSettings=document.getElementById("closeSettings");
  const presetSelect=document.getElementById("presetSelect");
  const colorPicker=document.getElementById("colorPicker");
  const saveBtn=document.getElementById("saveSettings");

  // Apply saved background
  const savedBg=localStorage.getItem("rocks-bg");
  if(savedBg)document.body.style.setProperty("--bg",savedBg);

  goBtn.addEventListener("click",navigate);
  urlInput.addEventListener("keydown",e=>{if(e.key==="Enter")navigate();});

  function navigate(){
    let url=urlInput.value.trim();
    if(!url)return alert("Please enter a URL");
    if(!/^https?:\\/\\//i.test(url))url="https://"+url;
    window.location.href="/proxy?url="+encodeURIComponent(url);
  }

  openSettings.onclick=()=>panel.classList.add("open");
  closeSettings.onclick=()=>panel.classList.remove("open");

  presetSelect.onchange=()=>{document.body.style.setProperty("--bg",presetSelect.value);}
  colorPicker.oninput=()=>{document.body.style.setProperty("--bg",colorPicker.value);}

  saveBtn.onclick=()=>{
    const bg=document.body.style.getPropertyValue("--bg");
    localStorage.setItem("rocks-bg",bg);
    alert("✅ Background saved!");
    panel.classList.remove("open");
  }
</script>
</body>
</html>`);
});

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

app.listen(PORT, () => console.log(\`🚀 Rocks Proxy running on port \${PORT}\`));
