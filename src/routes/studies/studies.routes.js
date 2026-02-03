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
  updateStudyWithPasswordSchema,
  deleteStudySchema,
  verifyPasswordSchema,
  createEmojiSchema,
} from './study.schema.js';

import { HTTP_STATUS } from '#constants';
import { comparePassword, hashPassword } from '#utils/password.utils.js';

import { STUDY_ERROR_MESSAGES } from '#constants/errors.js';
import { NotFoundException, UnauthorizedException } from '#exceptions';

import studiesRepository from '../../repositories/studies.repository.js';

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
  '/:studyId',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const study = await studiesRepository.findById(id);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      const { password, ...studyDataWithoutPassword } = study;
      res.status(HTTP_STATUS.OK).json(studyDataWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 000
studyRouter.get(
  '/:studyId/habits',

  async (req, res, next) => {
    try {
      // getStudyHabits 핸들러 구현
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 000
studyRouter.get(
  '/:studyId/habits/today',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      // getTodayHabitStatus 핸들러 구현
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 안예진
studyRouter.get(
  '/:studyId/emojis',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { studyId } = req.params;
      const study = await studiesRepository.findStudyById(studyId);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }
      const emojiStatsArray = await studiesRepository.getEmojiStats(studyId);

      // 3.배열을 객체 형태로 변환 {'👩‍💻': 38, '👍': 11}
      const formattedStats = emojiStatsArray.reduce((acc, curr) => {
        // Prisma의 groupBy 결과 구조 바탕으로 작성
        acc[curr.type] = curr._count.type;
        return acc;
      }, {});
      res.status(HTTP_STATUS.OK).json(formattedStats);
    } catch (error) {
      next(error);
    }
  },
);

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
studyRouter.post(
  '/:studyId/emojis',
  validate('params', studyIdParamSchema),
  validate('body', createEmojiSchema),
  async (req, res, next) => {
    try {
      const { studyId } = req.params;
      const { type } = req.body;

      const study = await studiesRepository.findStudyById(studyId);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }
      await studiesRepository.createEmoji(studyId, type);
      //2.최신 이모지 카운팅 가져오기
      const emojiStatsArray = await studiesRepository.getEmojiStats(studyId);

      // 3.배열을 객체 형태로 변환 {'👩‍💻': 38, '👍': 11}
      const formattedStats = emojiStatsArray.reduce((acc, curr) => {
        // Prisma의 groupBy 결과 구조 바탕으로 작성
        acc[curr.type] = curr._count.type;
        return acc;
      }, {});

      res.status(HTTP_STATUS.OK).json(formattedStats);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 000
studyRouter.post(
  '/:studyId/focus',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      // recordFocusTime 핸들러 구현
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 안예진
// 스터디 들어갈 때 비밀번호치고 바로 해당 스터디 값 보내주기  검증 + 특정 스터디 조회
studyRouter.post(
  '/:studyId/password/verify',
  validate('params', studyIdParamSchema),
  validate('body', verifyPasswordSchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const { password } = req.body;

      const study = await studiesRepository.findStudyById(id);
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
  },
);

// 담당: 안예진
studyRouter.patch(
  '/:studyId',
  validate('params', studyIdParamSchema),
  validate('body', updateStudyWithPasswordSchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const { nickname, title, introduction, background, password } = req.body;

      const existStudy = await studiesRepository.findStudyById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }
      const isPasswordValid = await comparePassword(
        password,
        existStudy.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
        );
      }

      const updatedStudy = await studiesRepository.updateStudy(id, {
        nickname,
        title,
        introduction,
        background,
      });
      const { password: _, ...studyWithoutPassword } = updatedStudy;

      res.status(HTTP_STATUS.OK).json(studyWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 담당: 안예진 - 삭제
studyRouter.delete(
  '/:studyId',
  validate('params', studyIdParamSchema),
  validate('body', deleteStudySchema),
  async (req, res, next) => {
    try {
      const { studyId: id } = req.params;
      const { password } = req.body;
      const existStudy = await studiesRepository.findStudyById(id);

      if (!existStudy) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }
      const isPasswordValid = await comparePassword(
        password,
        existStudy.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
        );
      }

      await studiesRepository.deleteStudy(id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);

export default studyRouter;
