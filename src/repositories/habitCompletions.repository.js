import { prisma } from '#config/prisma.js';

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
