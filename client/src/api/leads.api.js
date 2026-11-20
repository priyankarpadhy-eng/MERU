import { apiClient } from './client';

export const leadsApi = {
  async getLeads(params = {}) {
    const res = await apiClient.get('/leads', { params });
    return res.data;
  },

  async getLeadById(id) {
    const res = await apiClient.get(`/leads/${id}`);
    return res.data.lead;
  },

  async createLead(data) {
    const res = await apiClient.post('/leads', data);
    return res.data.lead;
  },

  async updateLead(id, data) {
    const res = await apiClient.patch(`/leads/${id}`, data);
    return res.data.lead;
  },

  async deleteLead(id) {
    await apiClient.delete(`/leads/${id}`);
  },
};
