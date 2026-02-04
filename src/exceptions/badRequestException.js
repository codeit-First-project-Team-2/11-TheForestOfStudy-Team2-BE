import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';
import { HTTP_STATUS } from '#constants';

export class BadRequestException extends HttpException {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST, details = null) {
    super(HTTP_STATUS.BAD_REQUEST, message, details);
  }
}
