import { ValidationError } from '../errors/validation.error.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      // Zod 에러 중 가장 첫 번째 항목의 메시지
      const firstError = error.errors[0];

      // ValidationError로 변환하여 next()로 던짐
      // 던져진 에러는 error.middleware.js에서 한꺼번에 처리
      return next(new ValidationError(firstError.message));
    }
    next(error);
  }
};
