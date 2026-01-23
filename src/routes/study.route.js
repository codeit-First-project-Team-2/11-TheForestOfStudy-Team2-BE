import { Router } from 'express';
import { getStudyList } from '../controllers/study.controller.js';

const router = Router();

router.get('/', getStudyList);

export default router;
