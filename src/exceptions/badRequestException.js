import { HttpException } from './httpException.js';
import { ERROR_MESSAGES } from '#constants';

export class badRequestException extends HttpException {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST, detailes = null) {
    super(400, message, details);
  }
}
