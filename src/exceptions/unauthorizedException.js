import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';
import { HTTP_STATUS } from '#constants';

export class UnauthorizedException extends HttpException {
  constructor(message = ERROR_MESSAGES.AUTH_FAILED, details = null) {
    super(HTTP_STATUS.UNAUTHORIZED, message, details);
  }
}
