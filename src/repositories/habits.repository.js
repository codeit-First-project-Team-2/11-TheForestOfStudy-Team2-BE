import { prisma } from '#config/prisma.js';

export const findHabitsByStudyId = async ({ studyId, select }) => {
  return prisma.habit.findMany({
    where: {
      studyId,
      deletedAt: null,
    },
    select: select ?? {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

//habitId로 "삭제되지 않은" habit 존재 확인/조회
export const findActiveHabitById = async ({ habitId, select }) => {
  return prisma.habit.findFirst({
    where: {
      id: habitId,
      deletedAt: null,
    },
    select: select ?? { id: true },
  });
};

export const findCompletionsByHabitIdsAndDate = async ({ habitIds, date }) => {
  if (!habitIds.length) {
    return [];
  }

  return prisma.habitCompletion.findMany({
    where: {
      habitId: { in: habitIds },
      date,
    },
    select: {
      habitId: true,
    },
  });
};

const findStudyExists = (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
};

const createHabit = ({ studyId, name }) => {
  return prisma.habit.create({
    data: {
      studyId,
      name: name.trim(),
    },
    select: {
      id: true,
      name: true,
      studyId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  });
};

const habitsRepository = {
  findHabitsByStudyId,
  findActiveHabitById,
  findCompletionsByHabitIdsAndDate,
  findStudyExists,
  createHabit,
};

export default habitsRepository;
