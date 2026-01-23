import { findAllStudies } from '../repository/study.repository.js';

export const getStudies = async () => {
  return findAllStudies();
};