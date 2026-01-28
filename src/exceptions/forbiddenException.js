import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants/errors.js';

export class ForbiddenException extends HttpException {
  constructor(message = ERROR_MESSAGES.FORBIDDEN_RESOURCE, detailes = null) {
    super(403, message, details);
  }
}
