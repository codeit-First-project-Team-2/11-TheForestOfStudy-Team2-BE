//마찬기지로 나중에 수정할 때 삭제예정

import bcrypt from 'bcrypt';
import * as todayFocusRepository from '../repositories/todayFocus.repository.js';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../exceptions/httpException.js';

const DEFAULT_SETTING_MINUTES = 25;
const DEFAULT_GETTING_POINTS = 3;

export const verifyPassword = async (studyId, inputPassword) => {
  const study = await todayFocusRepository.findStudyById(studyId);

  if (!study) {
    throw new NotFoundException('스터디를 찾을 수 없습니다.');
  }

  const isValidPassword = await bcrypt.compare(inputPassword, study.password);

  if (!isValidPassword) {
    throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
  }

  return { nickname: study.nickname, totalPoint: study.totalPoint };
};

export const calculatePoints = async (studyId, actualMinutes) => {
  if (actualMinutes < DEFAULT_SETTING_MINUTES) {
    throw new BadRequestException('기본 시간 미만 집중 ', { actualMinutes });
  }

  const extraPoint = Math.floor((actualMinutes - DEFAULT_SETTING_MINUTES) / 10);
  const earnedPoint = DEFAULT_GETTING_POINTS + Math.max(0, extraPoint);

  const updatedStudyPoints = await todayFocusRepository.updateFocusPoints(
    studyId,
    earnedPoint,
  );
  return { earnedPoint, totalPoint: updatedStudyPoints.totalPoint };
};
