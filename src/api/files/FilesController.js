import apiClient from '../apiClient';

export default class FilesController {
  static async uploadFile(type, file) {
    const formData = new FormData();
    formData.append(type, file);

    return await apiClient.post('/files', formData, {
       headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}