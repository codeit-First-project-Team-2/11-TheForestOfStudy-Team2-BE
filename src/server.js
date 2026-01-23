import app from './app.js';
import { config } from "./config/config.js";

// 서버 시작
app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});
