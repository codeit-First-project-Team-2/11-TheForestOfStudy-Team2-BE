import express from 'express';
import { config } from '#config';
import { logger } from '#middlewares/logger.middleware.js';
import { cors } from '#middlewares/cors.middleware.js';
import router from './routes/index.js';
import { errorHandler } from '#middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors);
app.use(logger);

// Health 체크
app.get('/health', (req, res) => {
  res.json({
    message: 'API Server Running',
    timestamp: new Date().toISOString(),
  });
});

// 모든 라우트 등록
app.use('/', router); // api 넣고 에러 발생해서 제거

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

export default app;
