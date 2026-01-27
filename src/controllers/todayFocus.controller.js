//나중에 API코드 수정할때 삭제해야 될 파일입니다..! 

import * as todayFocusService from '../services/todayFocus.service.js';

export const authorizePassword = async (req, res, next) => {
  const { studyId } = req.params;
  const { password: inputPassword } = req.body;

  try {
    const result = await todayFocusService.verifyPassword(studyId, inputPassword);

    return res.status(200).json({
      success: true,
      message: '인증 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const settlePoints = async (req, res, next) => {
  const { studyId } = req.params;
  const { actualMinutes } = req.body;

  try {
    const result = await todayFocusService.calculatePoints(studyId, actualMinutes);

    return res.status(200).json({
      success: true,
      message: `${result.earnedPoint}포인트가 적립되었습니다.`,
      data: { totalPoint: result.totalPoint },
    });
  } catch (error) {
    next(error);
  }
};
