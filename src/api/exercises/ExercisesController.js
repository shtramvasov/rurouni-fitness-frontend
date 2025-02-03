import apiClient from '../apiClient';

export default class ExercisesController {
  static async getExercisesList(params) {
    return await apiClient.get('/exercises', { params });
  }

  static async getExerciseDetails(id) {
    return await apiClient.get(`/exercises/${id}`);
  }

  static async getMuscleGroupUsedCount(params) {
    return await apiClient.get('/exercises/stat_by_muscle_group', { params });
  }
}