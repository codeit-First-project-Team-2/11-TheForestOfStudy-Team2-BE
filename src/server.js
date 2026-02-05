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

app.get('/health', (req, res) => {
  res.json({
    message: 'API Server Running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', router);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

export default app;
