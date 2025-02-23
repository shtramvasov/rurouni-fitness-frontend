import apiClient from '../apiClient';

export default class WorkoutsController {
  static async getWorkoutsList(params) {
    return await apiClient.get('/workouts', { params });
  }

  static async getWorkoutDetails(id) {
    return await apiClient.get(`/workouts/${id}`);
  }

  static async postWorkout(params) {
    return await apiClient.post(`/workouts`, params);
  }
}