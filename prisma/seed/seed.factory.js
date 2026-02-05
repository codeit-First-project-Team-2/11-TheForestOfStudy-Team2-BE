import { fakerKO as faker } from '@faker-js/faker';
import { ALLOWED_BACKGROUND_PATHS } from '#constants';
import {
  HABIT_RECORD_COUNT,
  HABIT_COUNT,
  EMOJI_COUNT,
  TOTAL_POINT_LIMIT,
  SUBJECTS,
  INTRO_TEMPLATES,
  EMOJI_TYPES,
  HABITS,
} from './seed.constants.js';
import { hashPassword } from '#utils/password.utils.js';
import { STUDY_LIMITS } from '#constants';

export const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

// const slice = (str, max) => str.slice(0, max);

export const randomDateString = () =>
  faker.date
    .between({
      from: new Date('2026-02-01'),
      to: new Date('2026-02-07'),
    })
    .toISOString();

export const makeIntroduction = (subject) => {
  const HOLDS = { LONG: 95, SHORT: 50 };

  // 30% 확률로 긴 introduction 생성
  const isLong = faker.datatype.boolean({ probability: 0.3 });

  const blocks = faker.helpers.shuffle(INTRO_TEMPLATES);
  let result = '';

  for (const block of blocks) {
    if (result.length >= (isLong ? HOLDS.LONG : HOLDS.SHORT)) break;

    const sentence = block.replace(/과목/g, subject);
    result += (result ? ' ' : '') + sentence;
  }

  return result;
};

export const makePassword = async () => {
  const raw = faker.internet.password({
    length: faker.number.int({
      min: STUDY_LIMITS.PASSWORD.MIN_LENGTH,
      max: STUDY_LIMITS.PASSWORD.MAX_LENGTH,
    }),
    memorable: false,
    pattern: /[a-zA-Z0-9]/,
  });
  return hashPassword(raw);
};

// Study
export const makeStudy = async () => {
  const studyId = faker.string.ulid();
  const title = faker.helpers.arrayElement(SUBJECTS);

  const study = {
    id: studyId,
    nickname: faker.person.firstName(),
    title,
    introduction: makeIntroduction(title),
    background: faker.helpers.arrayElement(ALLOWED_BACKGROUND_PATHS),
    password: await makePassword(),
    totalPoint: faker.number.int({
      min: TOTAL_POINT_LIMIT.MIN,
      max: TOTAL_POINT_LIMIT.MAX,
    }),
    habits: [],
    emojis: [],
  };

  return study;
};

// Habit
export const makeHabitsForStudy = (studyId) => {
  const habitCount = faker.number.int({
    min: HABIT_COUNT.MIN,
    max: HABIT_COUNT.MAX,
  });

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
export const makeHabitRecordsForHabit = (habitId) => {
  const recordCount = faker.number.int({
    min: HABIT_RECORD_COUNT.MIN,
    max: HABIT_RECORD_COUNT.MAX,
  });

  return (
    xs(recordCount)
      .map(() => ({
        id: faker.string.ulid(),
        habitId,
        date: randomDateString(),
        isCompleted: faker.datatype.boolean(),
      }))
      // 문자열 순서대로 정렬 (오름차순)
      .sort((a, b) => a.date.localeCompare(b.date))
  );
};

// Emoji
export const makeEmojisForStudy = (studyId) => {
  const emojiCount = faker.number.int({
    min: EMOJI_COUNT.MIN,
    max: EMOJI_COUNT.MAX,
  });

  return xs(emojiCount).map(() => ({
    id: faker.string.ulid(),
    type: faker.helpers.arrayElement(EMOJI_TYPES),
    studyId,
  }));
};

export const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.habit.deleteMany(),
    prisma.emoji.deleteMany(),
    prisma.study.deleteMany(), // 하위 테이블 삭제후 study 삭제
  ]);
