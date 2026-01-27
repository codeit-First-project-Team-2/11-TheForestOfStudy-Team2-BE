/**
 * studies.routes.js
 *
 * 📌 파일 작성 규칙
 * - 각각 담당하신 API 파트에 담당 이름 작성하시고 내용 추가해주세요.
 * - validate 사용해 유효성 검사
 * - 공통 에러 처리는 error middleware로 위임
 *
 * 작성 양식:
 * ===== HTTP METHOD / EndPoint (담당: 이름) =====
 */

import express from 'express';
import { prisma } from '../../config/prisma.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createStudySchema } from '../../schemas/study.schema.js';
import { hashPassword } from '../../utils/password.utils.js';

const studyRouter = express.Router();

/* ============================== */
/*              GET               */
/* ============================== */

// ===== GET /studies (담당: 000) =====

// ===== GET /studies/{studyId} (담당: 000) =====

// ===== GET /studies/{studyId}/habits (담당: 000) =====

// ===== GET /studies/{studyId}/habits/today (담당: 000) =====

// ===== GET /studies/{studyId}/emojis (담당: 000) =====


/* ============================== */
/*              POST              */
/* ============================== */

// ===== POST /studies (담당: 강에스더) =====
studyRouter.post('/', validate(createStudySchema), async (req, res, next) => {
  try {
    const {
      nickname,
      title,
      introduction,
      background,
      password,
    } = req.body;

    const hashedPassword = await hashPassword(password);

    const study = await prisma.study.create({
      data: {
        nickname,
        title,
        introduction,
        background,
        password: hashedPassword,
      },
      select: {
        id: true,
        nickname: true,
        title: true,
        introduction: true,
        background: true,
        totalPoint: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(study);
  } catch (error) {
    next(error);
  }
});

// ===== POST /studies/{studyId}/habits (담당: 000) =====

// ===== POST /studies/{studyId}/emojis (담당: 000) =====

// ===== POST /studies/{studyId}/focus (담당: 000) =====

// ===== POST /studies/{studyId}/password/verify (담당: 000) =====


/* ============================== */
/*             PATCH              */
/* ============================== */

// ===== PATCH /studies/{studyId} (담당: 000) =====

/* ============================== */
/*             DELETE             */
/* ============================== */

// ===== DELETE /studies/{studyId} (담당: 000) =====

export default studyRouter;