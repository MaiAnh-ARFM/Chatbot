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
  const message = req.body.message;
  try {
    const response = await axios.post(
      "https://api.coze.com/open_api/v3/chat", 
      {
        bot_id: process.env.BOT_ID,
        conversation_id: "user_" + Date.now(),
        user: "user_" + Date.now(),
        query: message,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`
        }
      }
    );
    const reply = response.data.choices?.[0]?.message?.content || "Bot không trả lời.";
    res.json({ reply });
  } catch (error) {
    console.error("Lỗi Coze API:", error.response?.data || error.message);
    res.status(500).json({ reply: "Có lỗi xảy ra khi gọi bot." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên port ${PORT}`);
});

module.exports = app;
