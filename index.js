const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.post("/send-kakao-message", async (req, res) => {
  const { message } = req.body;

  try {
    const result = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      new URLSearchParams({
        template_object: JSON.stringify({
          object_type: "text",
          text: message,
          link: {
            web_url: "https://example.com",
            mobile_web_url: "https://example.com"
          },
          button_title: "확인"
        })
      }),
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("카카오 메시지 전송 실패:", error.response?.data || error.message);
    res.status(500).json({ error: "카카오 메시지 전송 실패" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
