import apiClient from '../apiClient';

export default class UsersController {
  static async updateUser(params) {
    return await apiClient.put(`/users`, { ...params });
  }

  static async resetPassword() {
    return await apiClient.post(`/users/reset-password`);
  }

  static async getRecentLogins() {
    return await apiClient.get(`/users/logins`);
  }

  static async updateUserSettings(params) {
    return await apiClient.put(`/users/settings`, { ...params });
  }
}