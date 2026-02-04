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
