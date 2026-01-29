import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';
import { HTTP_STATUS } from '#constants';

export class ConflictException extends HttpException {
  constructor(message = ERROR_MESSAGES.RESOURCE_CONFLICT, detailes = null) {
    super(HTTP_STATUS.CONFLICT, message, details);
  }
}
