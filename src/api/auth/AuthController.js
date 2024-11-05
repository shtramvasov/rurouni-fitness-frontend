import apiClient from '../apiClient';

export default class AuthController {
  static async checkAuth() {
    return await apiClient.get('/auth/status');
  }

  static async login(loginData) {
    return await apiClient.post('/auth/login', loginData);
  }

  static async register(registerData) {
    return await apiClient.post('/auth/register', registerData);
  }
}