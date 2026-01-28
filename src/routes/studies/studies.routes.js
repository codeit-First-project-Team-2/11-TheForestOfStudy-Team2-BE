/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

import express from 'express';
import { prisma } from '#config/prisma.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createStudySchema } from '#schemas/study.schema.js';
import { hashPassword } from '#utils/password.utils.js';
import { HTTP_STATUS } from '#constants';
import { STUDY_ERROR_MESSAGES } from '#constants/errors.js';
import { NotFoundException } from '#exceptions';

const studyRouter = express.Router();

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
  '/:studyId',
  validate(createStudySchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const study = await prisma.study.findUnique({
        where: { id: Number(id) },
        ...(include && { include }),
      });

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      res.json(study);
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

// 담당: 000
studyRouter.get('/:studyId/emojis', async (req, res, next) => {
  try {
    // getStudyEmojis 핸들러 구현
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

// 담당: 000
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

// 담당: 000
studyRouter.post('/:studyId/password/verify', async (req, res, next) => {
  try {
    // verifyStudyPassword 핸들러 구현 (password.utils 사용)
  } catch (error) {
    next(error);
  }
});

// 담당: 안예진
studyRouter.patch(
  '/:studyId',
  validate(createStudySchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nickname, title, introduction, background } = req.body;

      const updatedStudy = await prisma.study.update({
        where: { id: Number(id) },
        nickname,
        title,
        introduction,
        background,
      });

      res.status(200).json(updatedStudy);
    } catch (error) {
      next(error);
    }
  },
);

studyRouter.delete(
  '/:studyId',
  validate(createStudySchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.study.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
export default studyRouter;
