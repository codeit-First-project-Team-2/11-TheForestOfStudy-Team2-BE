import { isProduction } from '#config';
import { flattenError } from 'zod';
import { BadRequestException } from '#exceptions';
import { ERROR_MESSAGES } from '#constants';

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
          throw new BadRequestException(ERROR_MESSAGES.INVALID_INPUT);
        }

        throw new BadRequestException(
          ERROR_MESSAGES.VALIDATION_FAILED,
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
