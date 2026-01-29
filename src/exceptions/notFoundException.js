import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';
import { HTTP_STATUS } from '#constants';

export class NotFoundException extends HttpException {
  constructor(message = ERROR_MESSAGES.RESOURCE_NOT_FOUND, detailes = null) {
    super(HTTP_STATUS.NOT_FOUND, message, details);
  }
}
