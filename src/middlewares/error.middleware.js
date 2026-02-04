export const errorHandler = (err, req, res, _next) => {
  // HttpException에서 던진 status가 없으면 기본 500을 사용
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    success: false,
    message: message,
  });
};
