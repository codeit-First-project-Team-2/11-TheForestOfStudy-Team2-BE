import { STUDY_LIMITS, HABIT_LIMITS } from './validation.constant.js';

// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002', // Unique constraint 위반
  RECORD_NOT_FOUND: 'P2025', // 레코드를 찾을 수 없음
};

export const STUDY_ERROR_MESSAGES = {
  NICKNAME_REQUIRED: `닉네임은 필수입니다.`,
  NICKNAME_INVALID: `닉네임은 ${STUDY_LIMITS.NICKNAME.MAX_LENGTH}자 이내여야 합니다.`,
  NICKNAME_FORMAT_INVALID: `닉네임에는 공백과 특수문자를 사용 할 수 없습니다.`,

  STUDY_NOT_FOUND: `스터디를 찾을 수 없습니다.`,
  STUDY_INVALID: 'studyId는 26자 이내여야 합니다.',
  STUDY_FORMAT_INVALID: '허용되지 않는 studyId 형식입니다.',

  TITLE_REQUIRED: `스터디 이름은 필수입니다.`,
  TITLE_INVALID: `스터디 이름은 ${STUDY_LIMITS.TITLE.MAX_LENGTH}자 이내여야 합니다.`,
  TITLE_FORMAT_INVALID: `스터디 이름에 사용할 수 없는 문자가 포함되어 있습니다.`,

  INTRODUCTION_REQUIRED: `소개글은 필수입니다.`,
  INTRODUCTION_INVALID: `소개글은 ${STUDY_LIMITS.INTRODUCTION.MAX_LENGTH}자 이내여야 합니다.`,
  BACKGROUND_INVALID: `허용되지 않은 배경 이미지 경로입니다.`,

  PASSWORD_REQUIRED: `비밀번호는 필수입니다.`,
  PASSWORD_NO_SPACE: `비밀번호는 공백을 포함할 수 없습니다.`,
  PASSWORD_CONFIRM_MISMATCH: `입력하신 비밀번호가 서로 일치하지 않습니다.`,
  PASSWORD_INVALID: `비밀번호는 ${STUDY_LIMITS.PASSWORD.MIN_LENGTH}~${STUDY_LIMITS.PASSWORD.MAX_LENGTH}자 사이여야 합니다.`,
};

export const HABIT_ERROR_MESSAGES = {
  HABIT_NAME_INVALID: `습관 이름은 ${HABIT_LIMITS.NAME.MAX_LENGTH}자 이내여야 합니다.`,
};

export const EMOJI_ERROR_MESSAGES = {
  EMOJI_LIMIT_EXCEEDED: '한 스터디에 등록 가능한 이모지 개수를 초과했습니다.',
  EMOJI_FORMAT_INVALID: '허용되지 않는 이모지 타입입니다.',
};

export const ERROR_MESSAGES = {
  AUTH_FAILED: '인증에 실패하였습니다.',
  INVALID_CREDENTIALS: '비밀번호가 올바르지 않습니다.',

  INVALID_INPUT: '올바르지 않은 입력값입니다.',
  VALIDATION_FAILED: '입력값 검증에 실패하였습니다.',

  FORBIDDEN_RESOURCE: '접근 권한이 없습니다.',
  RESOURCE_NOT_FOUND: '리소스를 찾을 수 없습니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
  RESOURCE_CONFLICT: '이미 존재하는 데이터입니다.',
  INTERNAL_SERVER_ERROR: '서버에 오류가 발생했습니다.',
};
