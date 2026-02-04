import express from 'express';
import { validate } from '#middlewares/validate.middleware.js';
import { homeRepository } from '../../repositories/home.repository.js';
import { HTTP_STATUS } from '#constants';
import { homePageSchema } from './home.schema.js';

const homeRouter = express.Router();

// 담당: 김민성
homeRouter.get(
  '/',
  validate('query', homePageSchema),
  async (req, res, next) => {
    try {
      const { sort, page, limit, keyword } = req.query;

      //페이지네이션 로직
      const skip = (page - 1) * limit;

      //정렬 로직 ( 기준:  key = [totalPoint, createdAt, updatedAt] )
      const orderBy = sort
        ? sort.split(',').map((key) => {
            if (key.startsWith('-')) {
              return { [key.substring(1)]: 'desc' };
            } else {
              return { [key]: 'asc' };
            }
          })
        : [{ createdAt: 'desc' }];

      //검색 로직
      const hasKeyword = keyword !== '';
      const where = hasKeyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { introduction: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {};

      //레포지토리 적용
      const [studies, totalCount] = await homeRepository.getStudyLists({
        where,
        orderBy,
        skip,
        take: limit,
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
