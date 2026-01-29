import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { fakerKO as faker } from '@faker-js/faker';
import { ALLOWED_BACKGROUND_PATHS } from '#constants';
import {
  SUBJECTS,
  INTRO_TEMPLATES,
  EMOJI_TYPES,
  HABITS,
} from './seed.constants.js';

const NUM_STUDIES_TO_CREATE = 1;

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

const slice = (str, max) => str.slice(0, max);

const randomDateString = () =>
  // TODO: 날짜 순서대로 나오도록 수정
  faker.date
    .between({
      from: new Date(2026, 0, 1), // 2026-01-01
      to: new Date(2026, 1, 6), // 2026-02-06
    })
    .toISOString()
    .split('T')[0];

const title = faker.helpers.arrayElement(SUBJECTS);

const makeIntroduction = (subject) => {
  // 40% 확률로 긴 introduction 생성
  const isLong = faker.datatype.boolean({ probability: 0.3 });

  const blocks = faker.helpers.shuffle(INTRO_TEMPLATES);
  let result = '';

  for (const block of blocks) {
    if (result.length >= (isLong ? 95 : 50)) break; // ??

    const sentence = block.replace(/과목/g, subject);
    result += (result ? ' ' : '') + sentence;
  }

  return result;
};

// Study
const makeStudy = () => {
  const studyId = faker.string.ulid();

  const study = {
    id: studyId,
    nickname: slice(faker.person.firstName(), 4),
    title,
    introduction: makeIntroduction(title),
    background: faker.helpers.arrayElement(ALLOWED_BACKGROUND_PATHS),
    password: faker.internet.password({
      length: faker.number.int({ min: 4, max: 10 }),
      memorable: false,
      pattern: /[a-zA-Z0-9]/,
    }),
    totalPoint: faker.number.int({ min: 0, max: 100 }),
    habits: [],
    emojis: [],
  };

  return study;
};

// Habit
const makeHabitsForStudy = (studyId) => {
  const habitCount = faker.number.int({ min: 3, max: 10 });

  return xs(habitCount).map(() => {
    const habitId = faker.string.ulid();

    return {
      id: habitId,
      name: faker.helpers.arrayElement(HABITS),
      studyId,
      records: makeHabitRecordsForHabit(habitId),
    };
  });
};

// HabitRecord
const makeHabitRecordsForHabit = (habitId) => {
  const recordCount = faker.number.int({ min: 3, max: 20 });

  return xs(recordCount).map(() => ({
    id: faker.string.ulid(),
    habitId,
    date: randomDateString(),
    isCompleted: faker.datatype.boolean(),
  }));
};

// Emoji
const makeEmojisForStudy = (studyId) => {
  const emojiCount = faker.number.int({ min: 1, max: 20 });

  return xs(emojiCount).map(() => ({
    id: faker.string.ulid(),
    type: faker.helpers.arrayElement(EMOJI_TYPES),
    studyId,
  }));
};

function main() {
  console.log('🌱 로컬 시딩 데이터 생성 시작...\n');

  const studies = xs(NUM_STUDIES_TO_CREATE).map(() => {
    const study = makeStudy();
    study.habits = makeHabitsForStudy(study.id);
    study.emojis = makeEmojisForStudy(study.id);
    return study;
  });

  // 전체 출력
  console.dir(studies, { depth: null });

  console.log('\n✅ 생성 완료');
  console.log(`📊 Study: ${studies.length}`);
  console.log(
    `📊 Habits: ${studies.reduce((sum, s) => sum + s.habits.length, 0)}`,
  );
  console.log(
    `📊 Emojis: ${studies.reduce((sum, s) => sum + s.emojis.length, 0)}`,
  );
}
