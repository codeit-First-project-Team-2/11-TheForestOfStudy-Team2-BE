import { PrismaClient } from '#generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import { ALLOWED_BACKGROUND_PATHS } from '#constants';

faker.setLocale('ko'); // 한국어 설정

const NUM_STUDIES_TO_CREATE = 35;

// 1부터 n까지 배열 생성
const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

// 허용 이모지 타입
const EMOJI_TYPES = ['🔥', '💪', '📚', '✅', '🌱'];

// 문자열 자르기
const slice = (str, max) => str.slice(0, max);

// 랜덤 날짜 문자열
const randomDateString = () =>
  faker.date
    .between({ from: '2026-01-01', to: '2026-02-06' })
    .toISOString()
    .split('T')[0];

// Study 생성
const makeStudyInput = () => ({
  nickname: slice(faker.person.firstName(), 4),
  title: slice(faker.word.words({ count: 1 }), 6),
  introduction: slice(faker.lorem.sentence(), 100),
  background: faker.helpers.arrayElement(ALLOWED_BACKGROUND_PATHS),
  password: faker.internet.password({
    length: faker.number.int({ min: 4, max: 10 }),
    memorable: false,
    pattern: /[a-zA-Z0-9]/,
  }),
  totalPoint: faker.number.int({ min: 0, max: 500 }),
});

// Habit 생성
const makeHabitsForStudy = (studyId) => {
  const habitCount = faker.number.int({ min: 1, max: 10 });
  return xs(habitCount).map(() => ({
    name: slice(faker.lorem.words({ count: 1 }), 15),
    studyId,
  }));
};

// HabitRecord 생성
const makeHabitRecordsForHabit = (habitId) => {
  const recordCount = faker.number.int({ min: 3, max: 20 });
  return xs(recordCount).map(() => ({
    habitId,
    date: randomDateString(),
    isCompleted: faker.datatype.boolean(),
  }));
};

// Emoji 생성
const makeEmojisForStudy = (studyId) => {
  const emojiCount = faker.number.int({ min: 1, max: 5 });
  return xs(emojiCount).map(() => ({
    type: faker.helpers.arrayElement(EMOJI_TYPES),
    studyId,
  }));
};

// 기존 데이터 삭제
const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.habitRecord.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.emoji.deleteMany(),
    prisma.study.deleteMany(),
  ]);

// Study 시딩
const seedStudies = async (prisma, count) => {
  const studiesData = xs(count).map(makeStudyInput);
  await prisma.study.createMany({ data: studiesData });
  return prisma.study.findMany({
    where: { nickname: { in: studiesData.map((s) => s.nickname) } },
    select: { id: true },
  });
};

// Habit + HabitRecord 시딩
const seedHabitsAndRecords = async (prisma, studies) => {
  for (const study of studies) {
    const habits = makeHabitsForStudy(study.id);
    await prisma.habit.createMany({ data: habits });

    const createdHabits = await prisma.habit.findMany({
      where: { studyId: study.id },
      select: { id: true },
    });

    for (const habit of createdHabits) {
      const records = makeHabitRecordsForHabit(habit.id);
      await prisma.habitRecord.createMany({ data: records });
    }
  }
};

// Emoji 시딩
const seedEmojis = async (prisma, studies) => {
  for (const study of studies) {
    const emojis = makeEmojisForStudy(study.id);
    await prisma.emoji.createMany({ data: emojis });
  }
};

async function main(prisma) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const studies = await seedStudies(prisma, NUM_STUDIES_TO_CREATE);
  await seedHabitsAndRecords(prisma, studies);
  await seedEmojis(prisma, studies);

  console.log(`✅ ${studies.length}개의 스터디가 생성되었습니다`);
  console.log('✅ 데이터 시딩 완료');
}

// Prisma Client 설정
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
