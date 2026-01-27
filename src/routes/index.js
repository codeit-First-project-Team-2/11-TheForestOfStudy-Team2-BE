import express from 'express';
import { todayFocusRouter } from './todayFocus.route.js';

const router = express.Router();

// 기본 테스트 라우트
router.get('/', (req, res) => {
  res.json({
    message: 'API Router Running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/api', todayFocusRouter); //오늘의 집중 테스트 

export default router
