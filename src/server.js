import express from 'express';
import  router  from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { config } from './config/config.js';

const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 등록
app.use('/api', router);

// Health 체크 라우트
app.get('/health', (req, res) => {
  res.json({
    message: 'API Server Running',
    timestamp: new Date().toISOString(),
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

export default app;
