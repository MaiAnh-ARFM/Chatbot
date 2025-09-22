const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Phục vụ các file tĩnh từ thư mục gốc
app.use(express.static(__dirname));

// Dùng để hiển thị file HTML khi truy cập trang chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'TLA_TTKT.html'));
});

// Endpoint chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.post(
      "https://api.coze.com/open_api/v2/chat", 
      {
        bot_id: process.env.BOT_ID,
        conversation_id: "user_" + Date.now(),
        user: "user_" + Date.now(),
        query: userMessage,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`
        }
      }
    );
    const botReply = response.data.messages.find(msg => msg.type === 'answer')?.content || "Bot không trả lời.";
    console.log(`Hỏi: "${userMessage}" | Đáp: "${botReply}"`);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Lỗi Coze API:", error.response?.data || error.message);
    res.status(500).json({ reply: "Có lỗi xảy ra khi gọi bot." });
  }
});

// Start server
module.exports = app;


