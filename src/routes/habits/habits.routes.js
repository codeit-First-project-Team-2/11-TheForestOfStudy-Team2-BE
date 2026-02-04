import express from 'express';
import { HTTP_STATUS } from '#constants';
import { NotFoundException } from '#exceptions';
import { ERROR_MESSAGES } from '#constants';
import { findHabitsByStudyId } from '#repositories/habits.repository.js';
import habitsRepository from '#repositories/habitCompletions.repository.js';
import { validate } from '#middlewares/validate.js';
import { habitIdParamSchema } from './habits.schema.js';
import studiesRepository from '#repositories/studies.repository.js';

import {
  studyIdParamSchema,
  createHabitSchema,
} from '../studies/study.schema.js';

const habitRouter = express.Router({ mergeParams: true });

const getTodayInTimezone = (timezone) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(new Date()); // YYYY-MM-DD
};

const resolveDateAndTimezone = (req) => {
  const timezone =
    typeof req.query.timezone === 'string' &&
    req.query.timezone.trim().length > 0
      ? req.query.timezone
      : 'Asia/Seoul';

  const dateQuery =
    typeof req.query.date === 'string' ? req.query.date : undefined;

  if (dateQuery && !isValidYyyyMmDd(dateQuery)) { // isValidYyyyMmDd 함수가 정의되어있지 않음
    const error = new Error('date 형식 오류 (YYYY-MM-DD)');
    error.statusCode = 400;
    throw error;
  }

  const date = dateQuery ?? getTodayInTimezone(timezone);

  return { date, timezone };
};

const toggleHabitCompletion = async (habitId, date) => {
  // const completionModel = getCompletionModel();

  const habit = await habitsRepository.findActiveHabitById(habitId);

  if (!habit) {
    throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  const existing = await completionModel.findFirst({ // model 삭제, repository 분리
    where: { habitId, date },
    select: { id: true },
  });

  if (existing) {
    await completionModel.delete({ where: { id: existing.id } }); // model 삭제, repository 분리

    return { habitId, date, isCompleted: false };
  }

  await completionModel.create({ // model 삭제, repository 분리
    data: { habitId, date },
  });

  return { habitId, date, isCompleted: true };
};

// 오늘의 습관 조회  GET /api/studies/:studyId/habits/today
habitRouter.get('/today', async (req, res, next) => {
  try {
    const { studyId } = req.params;

    const { date } = resolveDateAndTimezone(req);

    const study = await studiesRepository.findStudyById({
      id: studyId,
      select: { id: true },
    });

    if (!study) {
      throw new NotFoundException('studyId에 해당하는 스터디 없음');
    }

    const habits = await findHabitsByStudyId({ studyId });

    // 완료 여부 계산 (date 기준)
    // const completionModel = getCompletionModel();
    const habitIds = habits.map((h) => h.id);

    const completions = await habitsRepository.findCompletionsByHabitIdsAndDate(
      {
        habitIds,
        date,
      },
    );

    const completedSet = new Set(completions.map((c) => c.habitId));

    res.status(HTTP_STATUS.OK).json({
      studyId,
      date,
      habits: habits.map((h) => ({
        id: h.id,
        name: h.name,
        isCompleted: completedSet.has(h.id),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// 습관 생성  POST /api/studies/:studyId/habits
habitRouter.post(
  '/',
  validate('params', studyIdParamSchema),
  validate('body', createHabitSchema),
  async (req, res, next) => {
    try {
      const { studyId } = req.params;
      const { name } = req.body;

      const study = await habitsRepository.findStudyExists(studyId);

      if (!study) {
        throw new NotFoundException('studyId에 해당하는 스터디 없음');
      }

      const createdHabit = await habitsRepository.createdHabit(studyId, name);

      res.status(HTTP_STATUS.CREATED).json(createdHabit);
    } catch (error) {
      next(error);
    }
  },
);

// 완료/해제 토글  PATCH /api/habits/:habitId/toggle
habitRouter.patch('/:habitId/toggle', async (req, res, next) => {
  try {
    const { habitId } = req.params;

    const { date } = resolveDateAndTimezone(req);

    const result = await toggleHabitCompletion(habitId, date);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
});

// 습관 종료  DELETE /api/habits/:habitId (soft delete)
habitRouter.delete(
  '/:habitId',
  validate('params', habitIdParamSchema),
  async (req, res, next) => {
    try {
      const { habitId } = req.params;

      await habitsRepository.softDeleteHabitById({ habitId });

      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);

export default habitRouter;
