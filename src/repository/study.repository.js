import { prisma } from "../db/prisma.js";

export const findAllStudies = async () => {
  return prisma.study.findMany();
};