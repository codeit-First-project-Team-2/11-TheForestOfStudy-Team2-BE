import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.js';
import { HTTP_STATUS } from '#constants/http-status.js';
import { STUDY_ERROR_MESSAGES } from '#constants/errors.js';
import {
  DEFAULT_SETTING_MINUTES,
  DEFAULT_GETTING_POINTS,
} from '#constants/timer.js';
import {
  NotFoundException,
  UnathorizedException,
  BadRequestException,
} from '../exceptions/index.js';

// ===== POST /studies/{studyId}/password/verify (담당: 김민성) =====
focusRouter.POST('/:studyId/password/verify', async (req, res, next) => {
  const { studyId } = req.params;
  const { password: inputPassword } = req.body;

  try {
    const study = await prisma.study.findUnique({ where: { id: studyId } });
    const isValidPassword = await bcrypt.compare(inputPassword, study.password);

    if (!study) {
      throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
    }

    if (!isValidPassword) {
      throw new UnathorizedException(
        STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
      );
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: '인증 성공',
      data: {
        nickname: study.nickname,
        totalPoint: study.totalPoint,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ===== POST /studies/{studyId}/focus (담당: 김민성) =====
focusRouter.POST('/:studyId/focus', async (req, res, next) => {
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

    const updatedStudy = await prisma.study.update({
      where: { id: studyId },
      data: { totalpoint: { increment: earnedPoint } },
      select: { totalPoint: true },
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${earnedPoint}가 적립되었습니다.`,
      data: { totalPoint: updatedStudy.totalPoint },
    });
  } catch (error) {
    next(error);
  }
});
