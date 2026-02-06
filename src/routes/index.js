import express from 'express';
import homeRouter from './home/index.js';
import studyRouter from './studies/index.js';
import habitRouter from './habits/index.js';
import focusRouter from './focus/index.js';

const router = express.Router();

router.use('/', homeRouter);
router.use('/studies', studyRouter);
router.use('/habits', habitRouter);
router.use('/studies', focusRouter);

export default router;
