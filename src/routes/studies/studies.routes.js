import express from 'express';
import { validate } from '#middlewares/validate.middleware.js';
import { comparePassword, hashPassword } from '#utils/password.utils.js';
import {
  createStudySchema,
  studyIdParamSchema,
  updateStudyWithPasswordSchema,
  deleteStudySchema,
  verifyPasswordSchema,
  createEmojiSchema,
} from './study.schema.js';
import { HTTP_STATUS, STUDY_ERROR_MESSAGES } from '#constants';
import { NotFoundException, UnauthorizedException } from '#exceptions';
import studiesRepository from '#repositories/studies.repository.js';
import focusRouter from '../focus/focus.route.js';

export const studyRouter = express.Router();

// focusRouter 분리
studyRouter.use('/:studyId', focusRouter);

// 담당: 강에스더
studyRouter.get('/', async (req, res, next) => {
  try {
    const studies = await studiesRepository.findAllStudies();
    
    const { password: _, ...rest } = studies;

    res.status(HTTP_STATUS.OK).json(rest);
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
      const { studyId } = req.params;
      const study = await studiesRepository.findStudyById(studyId);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      const { password: _, ...rest } = study;
      res.status(HTTP_STATUS.OK).json(rest);
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

      const study = await studiesRepository.createStudy({
        nickname,
        title,
        introduction,
        background,
        password: hashedPassword,
      });

      const { password: _, ...rest } = study;

      res.status(HTTP_STATUS.CREATED).json(rest);
    } catch (error) {
      next(error);
    }
  },
);

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

      res.status(HTTP_STATUS.CREATED).json(formattedStats);
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
      const { studyId } = req.params;
      const { password } = req.body;

      const study = await studiesRepository.findStudyById(studyId);
      const emojiStats = await studiesRepository.getEmojiStats(studyId);

      if (!study) {
        throw new NotFoundException(STUDY_ERROR_MESSAGES.STUDY_NOT_FOUND);
      }

      const isPasswordValid = await comparePassword(password, study.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          STUDY_ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
        );
      }

      const { password: _, ...rest } = study;

      res.status(HTTP_STATUS.CREATED).json({ ...rest, emojiStats });
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
      const { password: _, ...rest } = updatedStudy;

      res.status(HTTP_STATUS.OK).json(rest);
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
