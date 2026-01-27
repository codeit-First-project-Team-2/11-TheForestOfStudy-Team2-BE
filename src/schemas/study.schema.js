import { z } from 'zod';
import { STUDY_LIMITS, REGEX } from '../constants/validation.constant.js';
import { STUDY_ERROR_MESSAGES } from '../constants/validation.constant.js';
import { ALLOWED_BACKGROUND_PATHS } from '../constants/study.constant.js';

export const createStudySchema = z.object({
  nickname: z
    .string({ required_error: STUDY_ERROR_MESSAGES.NICKNAME_INVALID })
    .trim()
    .min(1, STUDY_ERROR_MESSAGES.NICKNAME_INVALID)
    .max(
      STUDY_LIMITS.NICKNAME.MAX_LENGTH, // 최대 길이
      STUDY_ERROR_MESSAGES.NICKNAME_INVALID, // 에러 메세지
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
    .min(1, STUDY_ERROR_MESSAGES.BACKGROUND_INVALID) // 빈 문자열 방지
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
