import { prisma } from '#config/prisma.js';

function getStudyLists({ where, orderBy, skip, take }) {
  return Promise.all([
    prisma.study.findMany({ where, orderBy, skip, take }),
    prisma.study.count({ where }),
  ]);
}

export const homeRepository = {
  getStudyLists,
};
