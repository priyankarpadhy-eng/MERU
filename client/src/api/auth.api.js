import { apiClient } from './client';

export const authApi = {
  async signup(data) {
    const res = await apiClient.post('/auth/signup', data);
    return res.data;
  },

  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data.user;
  },

  async updateMe(data) {
    const res = await apiClient.patch('/auth/me', data);
    return res.data.user;
  },
};
