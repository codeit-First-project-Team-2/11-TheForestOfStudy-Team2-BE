/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

import express from 'express';
import { HTTP_STATUS } from '#constants';
import { NotFoundException } from '#exceptions';
import { ERROR_MESSAGES } from '#constants';
import { findHabitsByStudyId } from '#repositories/habits.repository.js';
import { findCompletionsByHabitIdsAndDate } from '#repositories/habitCompletions.repository.js';
import { validate } from '#middlewares/validate.js';
import { habitIdParamSchema } from '#schemas/habits.schema.js';

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

  if (dateQuery && !isValidYyyyMmDd(dateQuery)) {
    const error = new Error('date 형식 오류 (YYYY-MM-DD)');
    error.statusCode = 400;
    throw error;
  }

  const date = dateQuery ?? getTodayInTimezone(timezone);

  return { date, timezone };
};

const toggleHabitCompletion = async (habitId, date) => {
  const completionModel = getCompletionModel();

  const habit = await habitsRepository.findActiveHabitById(habitId);

  if (!habit) {
    throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  const existing = await completionModel.findFirst({
    where: { habitId, date },
    select: { id: true },
  });

  if (existing) {
    await completionModel.delete({ where: { id: existing.id } });

    return { habitId, date, isCompleted: false };
  }

  await completionModel.create({
    data: { habitId, date },
  });

  return { habitId, date, isCompleted: true };
};

/**
 *  오늘의 습관 조회  GET /api/studies/:studyId/habits/today
 */
habitRouter.get('/today', async (req, res, next) => {
  try {
    const { studyId } = req.params;

    const { date } = resolveDateAndTimezone(req);

    const study = await findStudyById({ id: studyId, select: { id: true } });

    if (!study) {
      throw new NotFoundException('studyId에 해당하는 스터디 없음');
    }

    const habits = await findHabitsByStudyId({ studyId });

    // 완료 여부 계산 (date 기준)
    const completionModel = getCompletionModel();
    const habitIds = habits.map((h) => h.id);

    const completions = await findCompletionsByHabitIdsAndDate({
      habitIds,
      date,
    });

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

/**
 * 습관 생성  POST /api/studies/:studyId/habits
 */
habitRouter.post(
  '/',
  validate('params', studyIdParamSchema),
  validate('body', createHabitSchema),
  async (req, res, next) => {
    try {
      const { studyId } = req.params;
      const { name } = req.body;

      const study = await prisma.study.findUnique({
        where: { id: studyId },
        select: { id: true },
      });

      if (!study) {
        throw new NotFoundException('studyId에 해당하는 스터디 없음');
      }

      const createdHabit = await prisma.habit.create({
        data: { studyId, name: name.trim() },
        select: {
          id: true,
          name: true,
          studyId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });

      res.status(HTTP_STATUS.CREATED).json(createdHabit);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * 완료/해제 토글  PATCH /api/habits/:habitId/toggle
 */
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

/**
 *  습관 종료  DELETE /api/habits/:habitId (soft delete)
 */
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
