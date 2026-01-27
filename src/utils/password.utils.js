import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// 평문 비밀번호를 해시하여 반환
// 절대 응답으로 반환하지 말 것
export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// 입력된 평문 비밀번호와 저장된 해시 비밀번호 비교
export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};