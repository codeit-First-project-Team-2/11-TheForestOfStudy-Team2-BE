import { prisma } from '#config/prisma.js';

function findStudyId(studyId) {
  return prisma.study.findUnique({ where: { id: studyId } });
}

function updateStudyPoints(studyId, earnedPoint) {
  return prisma.study.update({
    where: { id: studyId },
    data: { totalPoint: { increment: earnedPoint } },
    select: { totalPoint: true },
  });
}

const focusRepository = { findStudyId, updateStudyPoints };

export default focusRepository;
