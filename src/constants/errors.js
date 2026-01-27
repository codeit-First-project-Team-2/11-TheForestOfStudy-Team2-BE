export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002', // Unique constraint 위반
  RECORD_NOT_FOUND: 'P2025', // 레코드를 찾을 수 없습니다.
};

export const ERROR_MESSAGES = {
  // 사용자 및 이메일
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  EMAIL_REQUIRED: '이메일은 필수 입력 항목입니다.',
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',

  // 인증 (Auth) 관련
  NO_AUTH_TOKEN: '인증 토큰이 없습니다.',
  INVALID_TOKEN: '유효하지 않거나 만료된 토큰입니다.',
  USER_NOT_FOUND_FROM_TOKEN: '해당 토큰의 사용자 정보를 찾을 수 없습니다.',
  AUTH_FAILED: '인증에 실패하였습니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',

  // 유효성 검사 (Validation)
  INVALID_INPUT: '올바르지 않은 입력값입니다.',
  VALIDATION_FAILED: '입력값 검증에 실패하였습니다.',

  // Permission
  FORBIDDEN_RESOURCE: '접근 권한이 없습니다.',

  // 일반 에러
  RESOURCE_NOT_FOUND: '리소스를 찾을 수 없습니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
  RESOURCE_CONFLICT: '이미 존재하는 데이터입니다.',
  INTERNAL_SERVER_ERROR: '서버에 오류가 발생했습니다.',
};
