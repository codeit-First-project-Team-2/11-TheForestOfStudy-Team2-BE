/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

/**
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 */

import express from 'express';
import { prisma } from '#config/prisma.js';
import { HTTP_STATUS } from '#constants';
import { NotFoundException } from '#exceptions';
import { ERROR_MESSAGES } from '#constants';

const habitRouter = express.Router({ mergeParams: true });

// 공통

const candidates = ['habitCompletion', 'habitCompletionRecord', 'habitRecord'];

const getCompletionModel = () => {
  for (const key of candidates) {
    if (prisma?.[key]) {
      return prisma[key];
    }
  }

  const error = new Error(
    '완료 기록 모델(prisma.habitCompletion 등)을 찾을 수 없습니다. Prisma schema의 모델명을 확인해주세요.',
  );
  error.statusCode = 500;
  throw error;
};

const isValidYyyyMmDd = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

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
    typeof req.query.timezone === 'string' && req.query.timezone.trim().length > 0
      ? req.query.timezone
      : 'Asia/Seoul';

  const dateQuery = typeof req.query.date === 'string' ? req.query.date : undefined;

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

  // 1) habit 존재 확인 (soft delete 제외)
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, deletedAt: null },
    select: { id: true },
  });

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

    const study = await prisma.study.findUnique({
      where: { id: studyId },
      select: { id: true },
    });

    if (!study) {
      throw new NotFoundException('studyId에 해당하는 스터디 없음');
    }

    const habits = await prisma.habit.findMany({
      where: { studyId, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' },
    });

    // 완료 여부 계산 (date 기준)
    const completionModel = getCompletionModel();
    const habitIds = habits.map((h) => h.id);

    const completions = habitIds.length
      ? await completionModel.findMany({
          where: { habitId: { in: habitIds }, date },
          select: { habitId: true },
        })
      : [];

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
habitRouter.post('/', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    // validate 
    // validate(createHabitSchema, req);

    if (typeof name !== 'string' || name.trim().length === 0) {
      const error = new Error('name은 비어있을 수 없습니다.');
      error.statusCode = 400;
      throw error;
    }

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
});


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
habitRouter.delete('/:habitId', async (req, res, next) => {
  try {
    const { habitId } = req.params;

    // validate 
    // validate(deleteHabitSchema, req);

    const existHabit = await prisma.habit.findFirst({
      where: { id: habitId, deletedAt: null },
      select: { id: true },
    });

    if (!existHabit) {
      throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await prisma.habit.update({
      where: { id: habitId },
      data: { deletedAt: new Date() },
    });

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export default habitRouter;
