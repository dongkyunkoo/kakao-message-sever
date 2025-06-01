const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ 헬스 체크용 루트 라우트
app.get('/', (req, res) => {
  res.send('✅ 서버 살아있고 응답 중입니다');
});

app.post('/send-kakao-message', async (req, res) => {
  const message = req.body.message;
  const accessToken = process.env.KAKAO_ACCESS_TOKEN;

  if (!message || !accessToken) {
    return res.status(400).json({ error: 'Missing message or token' });
  }

  const payload = {
    object_type: 'text',
    text: message,
    link: {
      web_url: 'https://developers.kakao.com',
      mobile_web_url: 'https://developers.kakao.com'
    },
    button_title: '확인'
  };

  try {
    await axios.post(
      'https://kapi.kakao.com/v2/api/talk/memo/default/send',
      new URLSearchParams({
        template_object: JSON.stringify(payload)
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );

    console.log('✅ 메시지 전송 성공:', message);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ 메시지 전송 실패:', error.response?.data || error.message);
    res.status(500).json({ error: 'Message sending failed' });
  }
});

// ✅ 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 (포트 ${PORT})`);
});
