import apiClient from '../apiClient';

export default class TrainingProgramsController {
  static async getTrainingProgramsList(params) {
    return await apiClient.get('/training_programs', { params });
  }

  static async updateTrainingProgram(program_id, params) {
    return await apiClient.put(`/training_programs/${program_id}`, { ...params });
  }
}