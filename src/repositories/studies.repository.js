import { prisma } from '#config/prisma.js';

// 전체 조회
export const findAll = async () => {
  return await prisma.study.findMany();
};

// ID로 상세 조회
export const findById = async (id) => {
  return await prisma.study.findUnique({
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

// 생성
export const create = async (data) => {
  return await prisma.study.create({
    data,
  });
};

// 수정
export const update = async (id, data) => {
  return  prisma.study.update({
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

export default studiesrepository = {
  findAll,
  findById,
  create,
  update,
  deleteStudy,
};
