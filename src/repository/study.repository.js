import { prisma } from "../config/prisma.js";

export const findAllStudies = async () => {
  return prisma.study.findMany();
};