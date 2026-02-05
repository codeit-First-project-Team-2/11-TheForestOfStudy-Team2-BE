import { z } from 'zod';
import { EMOJI_LIMITS, STUDY_LIMITS } from '#constants';
import { EMOJI_ERROR_MESSAGES, REGEX } from '#constants';
import { STUDY_ERROR_MESSAGES } from '#constants';
import { ALLOWED_BACKGROUND_PATHS } from '#constants';

export const studyIdParamSchema = z.object({
  studyId: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim().toUpperCase() : val),
    z.ulid(STUDY_ERROR_MESSAGES.STUDY_INVALID),
  ),
});

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

// 이모지
export const createEmojiSchema = z.object({
  type: z
    .string({ required_error: EMOJI_ERROR_MESSAGES.EMOJI_FORMAT_INVALID })
    .trim()
    .min(EMOJI_LIMITS.MIN_LENGTH, EMOJI_ERROR_MESSAGES.EMOJI_FORMAT_INVALID)
    .max(EMOJI_LIMITS.MAX_LENGTH, EMOJI_ERROR_MESSAGES.EMOJI_FORMAT_INVALID),
});

//검증 + @
export const verifyPasswordSchema = z.object({
  password: createStudySchema.shape.password, // 기존 비번 규칙 그대로 재사용
});

export const deleteStudySchema = z.object({
  password: createStudySchema.shape.password,
});

// 수정 + 비밀번호 포함 스키마
export const updateStudyWithPasswordSchema = z.object({
  password: createStudySchema.shape.password,

  nickname: createStudySchema.shape.nickname.optional(),
  title: createStudySchema.shape.title.optional(),
  introduction: createStudySchema.shape.introduction.optional(),
  background: createStudySchema.shape.background.optional(),
});
