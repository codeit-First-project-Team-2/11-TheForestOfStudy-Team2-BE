/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

import express from 'express';

const habitRouter = express.Router();

// 담당: 고은혜
habitRouter.patch('/habits/:habitId', async (req, res, next) => {
  try {
    // updateHabit 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 고은혜
habitRouter.delete('/habits/:habitId', async (req, res, next) => {
  try {
    // deleteHabit 핸들러 구현
  } catch (error) {
    next(error);
  }
});

export default habitRouter;
