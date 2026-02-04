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

export const findCompletionByHabitIdAndDate = async ({ habitId, date }) => {
  return prisma.habitCompletion.findFirst({
    where: { habitId, date },
    select: { id: true },
  });
};

const findStudyExists = (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
};

const toggleCompletionByHabitIdAndDate = async ({ habitId, date }) => {
  const existing = await prisma.habitCompletion.findFirst({
    where: { habitId, date },
    select: { id: true },
  });

  if (existing) {
    await prisma.habitCompletion.delete({
      where: { id: existing.id },
    });
    return { isCompleted: false };
  }

  await prisma.habitCompletion.create({
    data: { habitId, date },
  });

  return { isCompleted: true };
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

export const softDeleteHabitById = async ({ habitId }) => {
  return prisma.habit.update({
    where: { id: habitId },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      deletedAt: true,
    },
  });
};

export const habitsRepository = {
  findHabitsByStudyId,
  findActiveHabitById,
  findCompletionsByHabitIdsAndDate,
  findCompletionByHabitIdAndDate,
  toggleCompletionByHabitIdAndDate,
  findStudyExists,
  createHabit,
  softDeleteHabitById,
};
