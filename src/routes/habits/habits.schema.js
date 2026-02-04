import { z } from 'zod';
import { REGEX } from '#constants';
import { ERROR_MESSAGES } from '#constants';

export const habitDateQuerySchema = z.object({
  date: z
    .string()
    .regex(REGEX.YYYY_MM_DD, ERROR_MESSAGES.DATE_INVALID)
    .optional(),
  timezone: z.string().optional(),
});
