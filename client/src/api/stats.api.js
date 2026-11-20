import { apiClient } from './client';

export const statsApi = {
  async getStats() {
    const res = await apiClient.get('/stats');
    return res.data;
  },
};
