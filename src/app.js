import express from "express";
import studyRouter from "./routes/study.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

app.use("/studies", studyRouter);

app.get("/health", (req, res) => {
  res.json({
    message: "API Server Running",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
