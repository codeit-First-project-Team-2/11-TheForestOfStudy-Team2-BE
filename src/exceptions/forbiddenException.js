import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';
import { HTTP_STATUS } from '#constants';

export class ForbiddenException extends HttpException {
  constructor(message = ERROR_MESSAGES.FORBIDDEN_RESOURCE, detailes = null) {
    super(HTTP_STATUS.FORBIDDEN, message, details);
  }
}
