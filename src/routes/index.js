import express from "express";

const router = express.Router();

// 기본 테스트 라우트
router.get("/", (req, res) => {
  res.json({
    message: "API Router Running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
