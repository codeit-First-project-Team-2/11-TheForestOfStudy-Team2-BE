// ⚠️ Prisma 7에서는 env 로딩을 config 파일에서 하지 않음
// dotenv-cli로 env 주입

import { defineConfig, env } from 'prisma/config';

export default defineConfig({      // 객체를 만들어 함수에 전달하고, 그 반환값을 default export
  schema: 'prisma/schema.prisma',
//   migrations: {
//     path: 'prisma.migrations',
//   },
  datasource: {
    url: env('DATABASE_URL'),
  },
});