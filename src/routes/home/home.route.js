import { EMOJI_LIMITS } from '../../constants/validation.constant.js';
import express from 'express';
const homeRouter = express.Router;

homeRouter.get('/', async (req, res) => {
  const { page = 1, limit = 6, keyword = '', sort } = req.query;
  try {
    // 페이지네이션
    const currentPage = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (currentPage - 1) * limitNumber;
    // sort
    if (sort === 'points') {
      filtered.sort((a, b) => b.totalPoint - a.totalPoint);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // 필터링
    const filtered = allstudies.filter((study) =>
      study.title.includes(keyword),
    );
    // 전체갯수
    const totalpage = Math.ceil(totalCount);
    // 응답
    return res.status(200).json({
      totalpage,
      currentPage,
      totalCount,
    });
  } catch (error) {}
});
