/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

import express from 'express';
import { prisma } from '#config/prisma.js';
import { validate } from '#middlewares/validate.middleware.js';
import {
  createStudySchema,
  studyIdParamSchema,
  updateStudySchema,
} from '#schemas/study.schema.js';
import { hashPassword } from '#utils/password.utils.js';

import { HTTP_STATUS } from '#constants';
import { comparePassword, hashPassword } from '#utils/password.utils.js';

import { STUDY_ERROR_MESSAGES } from '#constants/errors.js';
import { NotFoundException, UnauthorizedException } from '#exceptions';

import { studiesRepository } from './studyrepository.js';

export const studyRouter = express.Router();

// 담당: 000
studyRouter.get('/', async (req, res, next) => {
  try {
    // getStudies 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.get(
  //todo 1.include habitRecord
  '/:studyId',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const study = await studiesRepository.findById(id);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(study);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 000
studyRouter.get('/:studyId/habits', async (req, res, next) => {
  try {
    // getStudyHabits 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 000
studyRouter.get('/:studyId/habits/today', async (req, res, next) => {
  try {
    // getTodayHabitStatus 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.get('/:studyId/emojis', async (req, res, next) => {
  try {
    const { studyId: id } = req.params;
    const { emojis } = req.body;
  } catch (error) {
    next(error);
  }
});

// 담당: 강에스더
studyRouter.post(
  '/',
  validate('body', createStudySchema),
  async (req, res, next) => {
    try {
      const { nickname, title, introduction, background, password } = req.body;

      const hashedPassword = await hashPassword(password);

      const study = await prisma.study.create({
        data: {
          nickname,
          title,
          introduction,
          background,
          password: hashedPassword,
        },
      });

      const { password: _, ...rest } = study;

      res.status(HTTP_STATUS.CREATE).json(rest);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 000
studyRouter.post('/:studyId/habits', async (req, res, next) => {
  try {
    // createHabit 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.post('/:studyId/emojis', async (req, res, next) => {
  try {
    // registerEmoji 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 000
studyRouter.post('/:studyId/focus', async (req, res, next) => {
  try {
    // recordFocusTime 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.post('/:studyId/password/verify', async (req, res, next) => {
  try {
    const { studyId: id } = req.params;
    const { password } = req.body;

    const study = await prisma.study.findUnique({ where: { id } });

    if (!study) {
      throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, study.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
      );
    }

    res.status(HTTP_STATUS.OK).json({ message: '인증 성공' });
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.patch(
  '/:studyId',
  validate('params', studyIdParamSchema),
  validate('body', updateStudySchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const { nickname, title, introduction, background } = req.body;

      const existStudy = await studiesRepository.findById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      const updatedStudy = await studiesRepository.update(id, {
        nickname,
        title,
        introduction,
        background,
      });

      res.status(HTTP_STATUS.OK).json(updatedStudy);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 안예진 - 삭제(DELETE)
studyRouter.delete(
  '/:studyId',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const existStudy = await studiesRepository.findById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      await studiesRepository.delete(id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);
export default studyRouter;
