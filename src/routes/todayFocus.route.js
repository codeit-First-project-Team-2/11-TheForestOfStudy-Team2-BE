import express from 'express';
import * as todayFocusController from '../controllers/todayFocus.controller.js';

export const todayFocusRouter = express.Router();

todayFocusRouter.post(
  '/:studyId/password/verify',
  todayFocusController.authorizePassword,
);
todayFocusRouter.post('/:studyId/focus', todayFocusController.settlePoints);
