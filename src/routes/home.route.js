import express from 'express';
import { homeRepository } from '../repositories/home.repository.js';
import { HTTP_STATUS } from '#constants';
import { ERROR_MESSAGES } from '#constants';
import { BadRequestException } from '#exceptions';

const homeRouter = express.Router();

homeRouter.get('/', async (req, res, next) => {
  const { sort, page = 1, limit = 6, keyword = '' } = req.query;

  try {
    //페이지네이션 로직
    const currentPage = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (currentPage - 1) * limitNum;

    if (Number.isNaN(currentPage) || Number.isNaN(limitNum)) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    if (currentPage < 1 || limitNum < 1) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

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
    const hasKeyword = keyword && keyword.trim() !== '';
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
      take: limitNum,
    });

    const totalPage = Math.ceil(totalCount / limitNum);

    return res.status(HTTP_STATUS.OK).json({
      totalCount,
      totalPage,
      currentPage,
      data: studies,
    });
  } catch (error) {
    next(error);
  }
});
