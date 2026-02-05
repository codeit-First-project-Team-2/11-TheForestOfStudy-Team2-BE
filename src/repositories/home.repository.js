import { prisma } from '#config/prisma.js';

function getStudyLists({ where, orderBy, skip, take }) {
  return Promise.all([
    prisma.study.findMany({
      where: where || {}, // where가 undefined면 빈 객체
      orderBy: orderBy || { createdAt: 'desc' },
      skip: typeof skip === 'number' ? skip : 0, // undefined면 0
      take: typeof take === 'number' ? take : 10, // undefined면 10개 기본
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
