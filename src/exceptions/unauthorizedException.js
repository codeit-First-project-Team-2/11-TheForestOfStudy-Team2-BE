import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants/errors.js';

export class UnauthorizedException extends HttpException {
  constructor(message = ERROR_MESSAGES.AUTH_FAILED, detailes = null) {
    super(401, message, details);
  }
}
