import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';

export class ConflictException extends HttpException {
  constructor(message = ERROR_MESSAGES.RESOURCE_CONFLICT, detailes = null) {
    super(409, message, details);
  }
}
