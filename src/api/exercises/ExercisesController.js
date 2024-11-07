import apiClient from '../apiClient';

export default class ExercisesController {
  static async getExercisesList(params) {
    return await apiClient.get('/exercises', { params });
  }

  static async getExerciseDetails(id) {
    return await apiClient.get(`/exercises/${id}`);
  }
}