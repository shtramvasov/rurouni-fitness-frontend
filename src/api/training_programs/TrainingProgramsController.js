import apiClient from '../apiClient';

export default class TrainingProgramsController {
  static async getTrainingProgramsList(params) {
    return await apiClient.get('/training_programs', { params });
  }
}