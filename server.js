const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ⚠️ Thay bằng API KEY và BOT ID thật của bạn
const API_KEY = "GWLsotSpgmipXz7NaM3SM_-Qdn1uK9zS9phvZVUzFMo";  
const BOT_ID = "7538361057372028946";    

// Endpoint chat
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await axios.post(
     "https://api.coze.com/open_api/v3/chat/completions",
      {
        bot_id: BOT_ID,
        user_id: "user_" + Date.now(),
        query: message,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        }
      }
    );

    // Lấy phản hồi bot
    const reply =
      response.data.choices?.[0]?.message?.content ||
      "Không có phản hồi từ bot.";

    res.json({ reply });
  } catch (error) {
    console.error("Lỗi Coze API:", error.response?.data || error.message);
    res.json({ reply: "Có lỗi xảy ra khi gọi bot." });
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server chạy tại http://localhost:3000");
});
