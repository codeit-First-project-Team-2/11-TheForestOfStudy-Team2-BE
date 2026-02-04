import { z } from 'zod';
import { REGEX } from '#constants';
import { COMMON_ERROR_MESSAGES } from '#constants';

export const habitDateQuerySchema = z.object({
  date: z
    .string()
    .regex(REGEX.YYYY_MM_DD, COMMON_ERROR_MESSAGES.DATE_INVALID)
    .optional(),
  timezone: z.string().optional(),
});
