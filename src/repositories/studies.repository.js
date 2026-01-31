import { prisma } from '#config/prisma.js';

// 전체 조회
export const findAll = async () => {
  return await prisma.study.findMany();
  //작성
};

// ID로 상세 조회
export const findStudyById = async (id) => {
  return await prisma.study.findUnique({
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

// 생성
export const create = async (data) => {
  return await prisma.study.create({
    data,
  });
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
  return await prisma.study.delete({
    where: { id },
  });
};
//이모지 카운팅
export const getEmojiStats = async (studyId) => {
  return await prisma.emoji.groupBy({
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
  return await prisma.emoji.create({
    data: {
      studyId, //fk
      type,
    },
  });
};

const studiesrepository = {
  findAll,
  findStudyById,
  create,
  updateStudy,
  deleteStudy,
  getEmojiStats,
  createEmoji,
};
export default studiesrepository;
