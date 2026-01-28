import { z } from 'zod';
import { STUDY_LIMITS } from './validation.constant.js';
import { REGEX } from '#constants';
import { STUDY_ERROR_MESSAGES } from '#constants';
import { ALLOWED_BACKGROUND_PATHS } from '#constants';

export const createStudySchema = z.object({
  nickname: z
    .string({ required_error: STUDY_ERROR_MESSAGES.NICKNAME_INVALID })
    .trim()
    .min(1, STUDY_ERROR_MESSAGES.NICKNAME_INVALID)
    .max(
      STUDY_LIMITS.NICKNAME.MAX_LENGTH,
      STUDY_ERROR_MESSAGES.NICKNAME_INVALID,
    ),
  title: z
    .string({ required_error: STUDY_ERROR_MESSAGES.TITLE_INVALID })
    .trim()
    .min(1, STUDY_ERROR_MESSAGES.TITLE_INVALID)
    .max(STUDY_LIMITS.TITLE.MAX_LENGTH, STUDY_ERROR_MESSAGES.TITLE_INVALID),
  introduction: z
    .string({ required_error: STUDY_ERROR_MESSAGES.INTRODUCTION_INVALID })
    .min(1, STUDY_ERROR_MESSAGES.INTRODUCTION_INVALID)
    .max(
      STUDY_LIMITS.INTRODUCTION.MAX_LENGTH,
      STUDY_ERROR_MESSAGES.INTRODUCTION_INVALID,
    ),
  background: z
    .string({ required_error: STUDY_ERROR_MESSAGES.BACKGROUND_INVALID })
    .min(1, STUDY_ERROR_MESSAGES.BACKGROUND_INVALID)
    .refine((val) => ALLOWED_BACKGROUND_PATHS.includes(val), {
      message: STUDY_ERROR_MESSAGES.BACKGROUND_INVALID,
    }),
  password: z
    .string({ required_error: STUDY_ERROR_MESSAGES.PASSWORD_INVALID })
    .trim()
    .min(STUDY_LIMITS.PASSWORD.MIN_LENGTH)
    .max(STUDY_LIMITS.PASSWORD.MAX_LENGTH)
    .regex(REGEX.NO_SPACE, STUDY_ERROR_MESSAGES.PASSWORD_NO_SPACE),
});
export const studyIdParamSchema = z.object({
  studyId: z
    .string()
    .length(STUDY_LIMITS.ID.LENGTH, {
      message: STUDY_ERROR_MESSAGES.STUDY_INVALID,
    })
    .regex(REGEX.ULID, { message: STUDY_ERROR_MESSAGES.STUDY_FORMAT_INVALID }),
});

export const updateStudySchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(1, STUDY_ERROR_MESSAGES.NICKNAME_INVALID)
      .max(
        STUDY_LIMITS.NICKNAME.MAX_LENGTH,
        STUDY_ERROR_MESSAGES.NICKNAME_INVALID,
      ),
    title: z
      .string()
      .trim()
      .min(1, STUDY_ERROR_MESSAGES.TITLE_INVALID)
      .max(STUDY_LIMITS.TITLE.MAX_LENGTH, STUDY_ERROR_MESSAGES.TITLE_INVALID),
    introduction: z
      .string()
      .min(1, STUDY_ERROR_MESSAGES.INTRODUCTION_INVALID)
      .max(
        STUDY_LIMITS.INTRODUCTION.MAX_LENGTH,
        STUDY_ERROR_MESSAGES.INTRODUCTION_INVALID,
      ),
    background: z
      .string()
      .refine((val) => ALLOWED_BACKGROUND_PATHS.includes(val), {
        message: STUDY_ERROR_MESSAGES.BACKGROUND_INVALID,
      }),
    password: z
      .string({ required_error: STUDY_ERROR_MESSAGES.PASSWORD_INVALID })
      .trim()
      .min(STUDY_LIMITS.PASSWORD.MIN_LENGTH)
      .max(STUDY_LIMITS.PASSWORD.MAX_LENGTH)
      .regex(REGEX.NO_SPACE, STUDY_ERROR_MESSAGES.PASSWORD_NO_SPACE),
  })
  .partial({
    // 이 아래 필드들은 선택사항(보낼 수도 있고 안 보낼 수도 있음)
    nickname: true,
    title: true,
    introduction: true,
    background: true,
  });
