import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 🌌 Homepage with Enter key + background customizer
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
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          overflow: hidden;
          transition: background 0.5s ease;
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
          border-radius: 5px
