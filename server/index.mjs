// SolYoung OS 豆包 AI 代理（服务端）
// 用途：前端永不持有 API Key。本代理持有密钥（.env 中，已被 .gitignore 忽略），
// 把前端请求转发到豆包方舟 API，实现真实 AI 接入。
//
// 运行：cd server && npm install && cp .env.example .env 填好 ARK_API_KEY，然后 npm start
// 前端设置页：启用「豆包」Provider 并填 endpoint = http://localhost:8787

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 豆包方舟 API 地址（火山引擎方舟）
const ARK_ENDPOINT = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const ARK_API_KEY = process.env.ARK_API_KEY ?? '';

app.post('/chat', async (req, res) => {
  const { provider, model, messages } = req.body ?? {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages 必填' });
  }

  if (!ARK_API_KEY) {
    return res.status(500).json({ error: '服务端未配置 ARK_API_KEY，请检查 .env' });
  }

  try {
    // 豆包方舟兼容 OpenAI 格式；模型名即方舟上的接入点（如 doubao-pro-32k）
    const upstream = await fetch(ARK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify({ model: model || 'doubao-pro-32k', messages }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message ?? '上游错误' });
    }
    const text = data?.choices?.[0]?.message?.content ?? '';
    return res.json({ text });
  } catch (err) {
    console.error(String(err));
    return res.status(502).json({ error: '代理转发失败，请检查网络' });
  }
});

const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
  console.log(`SolYoung OS AI 代理已启动: http://localhost:${PORT}`);
});
