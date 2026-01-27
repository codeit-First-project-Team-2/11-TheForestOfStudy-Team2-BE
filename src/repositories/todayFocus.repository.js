import { prisma } from '../config/prisma.js';

export const findStudyById = async (studyId) => {
  return await prisma.study.findUnique({ where: { id: studyId } });
};

export const updateFocusPoints = async (studyId, earnedPoint) => {
  return await prisma.study.update({
    where: { id: studyId },
    data: { totalPoint: { increment: earnedPoint } },
    select: { totalPoint: true },
  });
};
