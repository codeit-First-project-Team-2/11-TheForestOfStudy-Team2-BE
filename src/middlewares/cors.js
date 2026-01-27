// CORS 미들웨어: 브라우저가 요청을 허용/차단할 때 참고하는 약속
import {
  DEVELOPMENT_ORIGINS,
  PRODUCTION_ORIGINS,
  isProduction,
} from '../config/config.js';

export const cors = (req, res, next) => {
  const origin = req.headers.origin;

  const whiteList = isProduction ? PRODUCTION_ORIGINS : DEVELOPMENT_ORIGINS;

  const isAllowed = !isProduction || (origin && whiteList.includes(origin));

  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (!isProduction) {
    // 개발 환경에서 Origin 없을 때
    res.header('Access-Control-Allow-Origin', '*');
  }

  // 공통 헤더 설정
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight(사전 요청) 처리
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
