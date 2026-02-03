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
