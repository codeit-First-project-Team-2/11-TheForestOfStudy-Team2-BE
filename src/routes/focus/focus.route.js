import express from 'express';
import {
  HTTP_STATUS,
  DEFAULT_SETTING_MINUTES,
  DEFAULT_GETTING_POINTS,
} from '#constants';
import { BadRequestException } from '#exceptions';
import focusRepository from '#repositories/focus.repository.js';

const focusRouter = express.Router({ mergeParams: true });

focusRouter.post('/:studyId/focus', async (req, res, next) => {
  const { studyId } = req.params;
  const { actualMinutes } = req.body;

  try {
    if (actualMinutes < DEFAULT_SETTING_MINUTES) {
      throw new BadRequestException('기본 시간 미만 집중', { actualMinutes });
    }

    const extraPoint = Math.floor(
      (actualMinutes - DEFAULT_SETTING_MINUTES) / 10,
    );
    const earnedPoint = DEFAULT_GETTING_POINTS + Math.max(0, extraPoint);

    const updatedStudy = await focusRepository.updateStudyPoints(
      studyId,
      earnedPoint,
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${earnedPoint}가 적립되었습니다.`,
      data: { totalPoint: updatedStudy.totalPoint, earnedPoint: earnedPoint },
    });
  } catch (error) {
    next(error);
  }
});

export default focusRouter;
