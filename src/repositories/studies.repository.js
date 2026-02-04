import { prisma } from '#config/prisma.js';

export const findAllStudies = async () => {
  return prisma.study.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// ID로 상세 조회
export const findStudyById = async (id) => {
  return prisma.study.findUnique({
    where: { id },
    include: {
      habits: {
        include: {
          records: true,
        },
      },
      //   emojis: true,
    },
  });
};

// repository
export const existsById = async (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
};

// 생성
export const createStudy = async (data) => {
  return prisma.study.create({ data });
};

// 수정
export const updateStudy = async (id, data) => {
  return prisma.study.update({
    where: { id },
    data,
  });
};

// 삭제
export const deleteStudy = async (id) => {
  return prisma.study.delete({
    where: { id },
  });
};

//이모지 카운팅
export const getEmojiStats = async (studyId) => {
  return prisma.emoji.groupBy({
    by: ['type'],
    where: { studyId },
    _count: { type: true },
    orderBy: {
      _count: { type: 'desc' },
    },
  });
};

//이모지 생성
export const createEmoji = async (studyId, type) => {
  return prisma.emoji.create({
    data: {
      studyId, //fk
      type,
    },
  });
};

const studiesRepository = {
  findAllStudies,
  findStudyById,
  createStudy,
  updateStudy,
  deleteStudy,
  getEmojiStats,
  createEmoji,
};

export default studiesRepository;
