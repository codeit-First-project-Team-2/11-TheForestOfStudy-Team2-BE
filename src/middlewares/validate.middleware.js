import { isProduction } from '#config';
import { flattenError } from 'zod';
import { BadRequestException } from '#exceptions';
import { ERROR_MESSAGE } from '#constants'; //ERROR_MESSAGES 로 바꿔야 할 것 같아요!

export const validate = (target, schema) => {
  if (!['body', 'query', 'params'].includes(target)) {
    throw new Error(
      `[validate middleware] Invalid target: "${target}". Expected "body", "query", or "params".`,
    );
  }

  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const { fieldErrors } = flattenError(result.error);

        if (isProduction) {
          throw new BadRequestException(ERROR_MESSAGE.INVALID_INPUT);
        }

        throw new BadRequestException(
          ERROR_MESSAGE.VALIDATION_FAILED,
          fieldErrors,
        );
      }

      Object.assign(req[target], result.data);
      next();
    } catch (error) {
      next(error);
    }
  };
};
