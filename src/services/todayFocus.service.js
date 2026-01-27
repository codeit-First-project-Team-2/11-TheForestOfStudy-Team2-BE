import * as todayFocusRepository from '../repositories/todayFocus.repository.js';
import bcrypt from 'bcrypt';
import { HttpException } from '../exceptions/httpException.js';

export const verifyPassword = async (studyId, inputPassword) => {
  const study = await todayFocusRepository.findStudyById(studyId);

  if (!study) {
    throw new HttpException(404, '스터디를 찾을 수 없습니다.');
  }

  const isRight = await bcrypt.compare(inputPassword, study.password);

  if (!isRight) {
    throw new HttpException(401, '비밀번호가 일치하지 않습니다.');
  }

  return { nickname: study.nickname, totalPoint: study.totalPoint };
};

export const calculatePoints = async (studyId, actualMinutes) => {
  const DEFAULT_SETTING_MINUTES = 25;
  const DEFAULT_GETTING_POINTS = 3;

  if (actualMinutes < DEFAULT_SETTING_MINUTES) {
    throw new HttpException(400, '기본 시간 미만 집중 ', { actualMinutes });
  }

  const extraPoint = Math.floor((actualMinutes - DEFAULT_SETTING_MINUTES) / 10);
  const earnedPoint = DEFAULT_GETTING_POINTS + Math.max(0, extraPoint);

  const updatedStudyPoints = await todayFocusRepository.updateFocusPoints(
    studyId,
    earnedPoint,
  );
  return { earnedPoint, totalPoint: updatedStudyPoints.totalPoint };
};
