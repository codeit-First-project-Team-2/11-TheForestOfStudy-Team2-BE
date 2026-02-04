import { prisma } from '#config/prisma.js';

function getStudyLists({ where, orderBy, skip, take }) {
  return Promise.all([
    prisma.study.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        emojis: true, // 1. 여기서 이모지 모양(type)을 가져오고
        _count: {
          select: { emojis: true }, // 2. 여기서 이모지 전체 개수를 가져옵니다.
        },
      },
    }),
    prisma.study.count({ where }),
  ]);
}

const homeRepository = {
  getStudyLists,
};

export default homeRepository;
