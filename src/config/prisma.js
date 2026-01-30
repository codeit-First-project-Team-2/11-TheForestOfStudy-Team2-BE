// Adapter 패턴을 이용한 DB 연결

import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '#config';

const adapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
