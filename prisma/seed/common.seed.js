// .env 파일 DATABASE_URL 설정 필요
// 테이블 동기화: npm run prisma:migrate
// 시드 데이터 생성: npm run seed (기존 데이터는 삭제됩니다.)

import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { fakerKO as faker } from '@faker-js/faker';
import {
  makeStudy,
  makeHabitsForStudy,
  makeEmojisForStudy,
  resetDb,
} from './seed.factory.js';

const NUM_STUDIES_TO_CREATE = 34;

async function main(prisma) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  faker.seed(1);

  console.log('🌱 시딩 시작...');
  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const studies = [];

  for (let i = 0; i < NUM_STUDIES_TO_CREATE; i++) {
    // for문 수정
    const study = await makeStudy();
    study.habits = makeHabitsForStudy(study.id);
    study.emojis = makeEmojisForStudy(study.id);
    studies.push(study);
  }

  for (const study of studies) {
    await prisma.study.create({
      data: {
        id: study.id,
        nickname: study.nickname,
        title: study.title,
        introduction: study.introduction,
        background: study.background,
        password: study.password,
        totalPoint: study.totalPoint,
        habits: {
          create: study.habits.map((h) => ({
            id: h.id,
            name: h.name,
            records: {
              create: h.records.map((r) => ({
                id: r.id,
                date: r.date,
                isCompleted: r.isCompleted,
              })),
            },
          })),
        },
        emojis: {
          create: study.emojis.map((e) => ({
            id: e.id,
            type: e.type,
          })),
        },
      },
    });
  }
  // // 2. 데이터 생성 로직 통합
  // const studyPromises = xs(NUM_STUDIES_TO_CREATE).map(async () => {
  //   const study = await makeStudy();
  //   const habits = makeHabitsForStudy(study.id);
  //   const emojis = makeEmojisForStudy(study.id);

  //   return prisma.study.create({
  //     data: {
  //       ...study,
  //       habits: {
  //         create: habits.map(({ records, ...h }) => ({
  //           ...h,
  //           records: { create: records } // records는 nested create
  //         })),
  //       },
  //       emojis: {
  //         create: emojis.map(({ studyId, ...e }) => e), // studyId는 자동 매핑되므로 제외 가능
  //       },
  //     },
  //   });
  // });

  // const results = await Promise.all(studyPromises);

  console.log('✅ 시딩 완료');
  console.log(`📊 Study: ${studies.length}`);
  console.log(
    `📊 Habits: ${studies.reduce((sum, s) => sum + s.habits.length, 0)}`,
  );
  console.log(
    `📊 Emojis: ${studies.reduce((sum, s) => sum + s.emojis.length, 0)}`,
  );
}

// Prisma Client 설정
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    await main(prisma);
  } catch (e) {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
