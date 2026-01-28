import express from 'express';
import studyRouter from './studies/index.js';
import habitRouter from './habits/index.js';

const router = express.Router();

router.use('/studies', studyRouter);
router.use('/habits', habitRouter);
router.use('/studies', focusRouter);

export default router
