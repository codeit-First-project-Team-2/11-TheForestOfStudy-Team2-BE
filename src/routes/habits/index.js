import habitRouter from './habits.routes.js';

//api/studies/:studyId/habits/*
router.use('/studies/:studyId/habits', habitRouter);

export default habitRouter;
