import { prisma } from '#config/prisma.js';

export const findAllStudies = async () => {
  return prisma.study.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const findStudyById = async (id) => {
  return prisma.study.findUnique({
    where: { id },
    include: {
      habits: {
        include: {
          records: true,
        },
      },
      emojis: true,
    },
  });
};

export const existsById = async (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
};

export const createStudy = async (data) => {
  return prisma.study.create({ data });
};

export const updateStudy = async (id, data) => {
  return prisma.study.update({
    where: { id },
    data,
  });
};

export const deleteStudy = async (id) => {
  return prisma.study.delete({
    where: { id },
  });
};

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

export const createEmoji = async (studyId, type) => {
  return prisma.emoji.create({
    data: {
      studyId,
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
