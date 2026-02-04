import { prisma } from '#config/prisma.js';

function getStudyLists({ where, orderBy, skip, take }) {
  return Promise.all([
    prisma.study.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true, // 작성자의 모든 정보(id, nickname, profileImage 등)를 가져옴
        emojis: true, // 이모지 리스트 전체 포함
      },
    }),
    prisma.study.count({ where }),
  ]);
}

const homeRepository = {
  getStudyLists,
};

export default homeRepository;
