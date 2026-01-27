import express from 'express';
import * as todayFocusController from '../controllers/todayFocus.controller.js';

export const todayFocusRouter = express.Router();

todayFocusRouter.post(
  'studies/:studyId/password/verify',
  todayFocusController.authorizePassword,
);
todayFocusRouter.post('studies/:studyId/focus', todayFocusController.settlePoints);
