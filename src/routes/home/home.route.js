import express from 'express';
import { validate } from '#middlewares/validate.middleware.js';
import { HTTP_STATUS } from '#constants';
import { homePageSchema } from './home.schema.js';
import homeRepository from '#repositories/home.repository.js';

export const homeRouter = express.Router();

// 담당: 김민성
homeRouter.get(
  '/',
  validate('query', homePageSchema),
  async (req, res, next) => {
    try {
      const { sort, page, limit, keyword } = req.query;

      // 1. 페이지네이션 로직
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // 2. 정렬 로직
      const VALID_KEYS = ['totalPoint', 'createdAt', 'updatedAt'];

      const orderBy = sort
        ? sort
            .split(',')
            .map((item) => {
              const trimmed = item.trim();
              const isDesc = trimmed.startsWith('-');
              const field = isDesc ? trimmed.substring(1) : trimmed;

              if (!VALID_KEYS.includes(field)) return null;

              return { [field]: isDesc ? 'desc' : 'asc' };
            })
            .filter(Boolean)
        : [{ createdAt: 'desc' }];

      const finalOrderBy =
        orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }];

      // 3. 검색 로직 (긴급 수정: 데이터 확인을 위해 기존 로직 주석 처리)
      // const hasKeyword = keyword !== '';
      // const where = hasKeyword
      //   ? {
      //       OR: [
      //         { title: { contains: keyword, mode: 'insensitive' } },
      //         { introduction: { contains: keyword, mode: 'insensitive' } },
      //       ],
      //     }
      //   : {};

      const where = {};

      if (keyword && keyword.trim() !== '') {
        where.OR = [
          { title: { contains: keyword, mode: 'insensitive' } },
          { introduction: { contains: keyword, mode: 'insensitive' } },
        ];
      }

      // 4. 레포지토리 적용
      const [studies, totalCount] = await homeRepository.getStudyLists({
        where,
        orderBy: finalOrderBy,
        skip,
        take,
      });

      const totalPage = Math.max(1, Math.ceil(totalCount / limit));

      return res.status(HTTP_STATUS.OK).json({
        totalCount,
        totalPage,
        currentPage: page,
        data: studies,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default homeRouter;
