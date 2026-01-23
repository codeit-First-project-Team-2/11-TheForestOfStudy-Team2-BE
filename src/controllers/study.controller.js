import { getStudies } from '../services/study.service.js';

export const getStudyList = async (req, res) => {
    const studies = await getStudies();
    res.status(200).json(studies);
};