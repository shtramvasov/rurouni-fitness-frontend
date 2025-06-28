import apiClient from '../apiClient';

export default class UsersController {
  static async updateUser(params) {
    return await apiClient.put(`/users`, { ...params });
  }
}