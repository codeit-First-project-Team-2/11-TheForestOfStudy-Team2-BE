import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants/errors.js';

export class NotFoundException extends HttpException {
  constructor(message = ERROR_MESSAGES.RESOURCE_NOT_FOUND, detailes = null) {
    super(404, message, details);
  }
}
