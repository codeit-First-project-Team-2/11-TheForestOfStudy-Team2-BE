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

import { studiesRepository } from './studiesrepository.js';
import { emojiStats } from '../../repositories/studies.repository.js';

export const studyRouter = express.Router();

// 담당: 000
studyRouter.get('/', async (req, res, next) => {
  try {
    // getStudies 핸들러 구현
  } catch (error) {
    next(error);
  }
});

// // 담당: 안예진
// studyRouter.get(
//   '/:studyId',
//   validate('params', studyIdParamSchema),
//   async (req, res, next) => {
//     try {
//       const { studyId: id } = req.params;
//       const study = await studiesRepository.findById(id);

//       if (!study) {
//         throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
//       }

//       const { password, ...studyDataWithoutPassword } = study;
//       res.status(HTTP_STATUS.OK).json(studyDataWithoutPassword);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

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
    const { studyId } = req.params;
    const stats = await studiesRepository.getEmojiStats(studyId);

    res.status(HTTP_STATUS.OK).json(stats);
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
    const { studyId } = req.params;
    const { type } = req.body;

    await studiesRepository.createEmoji(studyId, type);

    const updateEmoji = await studiesRepository.getEmojiStats(studyId);

    res.status(HTTP_STATUS.OK).json(updateEmoji);
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
// 스터디 들어갈 때 비밀번호치고 바로 해당 스터디 값 보내주기  검증 + 특정 스터디 조회
studyRouter.post('/:studyId/password/verify', async (req, res, next) => {
  try {
    const { studyId: id } = req.params;
    const { password } = req.body;

    const study = await findStudyById(id);
    const emojiStats = await studiesRepository.getEmojiStats(id);

    if (!study) {
      throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, study.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
      );
    }

    const { password: _, ...studyData } = study;

    res.status(HTTP_STATUS.OK).json({ ...studyData, emojiStats });
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

      const existStudy = await studiesRepository.findStudyById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      const updatedStudy = await studiesRepository.updateStudy(id, {
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
      const existStudy = await studiesRepository.findStudyById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      await studiesRepository.delete(id);
      res.status(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
export default studyRouter;
