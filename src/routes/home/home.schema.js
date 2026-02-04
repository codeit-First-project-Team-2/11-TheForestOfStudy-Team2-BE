import { z } from 'zod';

export const homePageSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(6),
  keyword: z.string().trim().default(''),
  sort: z.string().optional(),
});
