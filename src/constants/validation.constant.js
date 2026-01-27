// Study
export const STUDY_LIMITS = {
  NICKNAME: {
    MAX_LENGTH: 4,
  },
  TITLE: {
    MAX_LENGTH: 6,
  },
  INTRODUCTION: {
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 10,
  },
};

// Habit
export const HABIT_LIMITS = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 15,
  }
}

// Emoji
export const EMOJI_LIMITS = {
    TYPE: {
        // TODO: 허용 emoji 타입 정의
    }
}

export const REGEX = {
  NO_SPACE: /^\S*$/,                            // 공백 금지
  ONLY_NUMBER: /^[0-9]*$/,                      // 숫자만 가능
  ALPHANUM_KOREAN_DOT: /^[a-zA-Z0-9가-힣.]*$/,   // 영문, 숫자, 한글, 점 허용
};
