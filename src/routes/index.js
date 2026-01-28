import express from 'express';
import studyRouter from './studies/index.js';
import habitRouter from './habits/index.js';
import focusRouter from './focus/focus.route.js'

const router = express.Router();

router.use('/studies', studyRouter);
router.use('/habits', habitRouter);
router.use('/studies/:studyId', focusRouter);

export default router
