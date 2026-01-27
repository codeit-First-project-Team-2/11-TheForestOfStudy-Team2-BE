import express from "express";
import { config } from "./config/config.js";
import { logger } from './middlewares/logger.js';
import { cors } from './middlewares/cors.js';
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(logger);
app.use(cors);
app.use(express.json());

// Health 체크
app.get("/health", (req, res) => {
  res.json({
    message: "API Server Running",
    timestamp: new Date().toISOString(),
  });
});

// 모든 라우트 등록
app.use('/api', router);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`
  );
});

export default app;
