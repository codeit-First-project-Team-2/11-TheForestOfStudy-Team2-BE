import { prisma } from '#config/prisma.js';

function getStudyLists({ where, orderBy, skip, take }) {
  return Promise.all([
    prisma.study.findMany({
      where: where || {},
      orderBy: orderBy || { createdAt: 'desc' },
      skip: Number.isInteger(skip) ? skip : 0, // NaN 방지
      take: Number.isInteger(take) ? take : 10, // 기본 10개
      include: {
        emojis: true,
        _count: { select: { emojis: true } },
      },
    }),
    prisma.study.count({ where: where || {} }),
  ]);
}

const homeRepository = {
  getStudyLists,
};

export default homeRepository;
