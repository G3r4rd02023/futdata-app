import api from './axios';

export const leagueService = {
  async getAll(page = 1, pageSize = 12) {
    const response = await api.get('/leagues', { params: { page, pageSize } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/leagues/${id}`);
    return response.data;
  },

  async search(searchTerm, page = 1, pageSize = 12) {
    const response = await api.get('/leagues', { params: { search: searchTerm, page, pageSize } });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/leagues', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/leagues/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/leagues/${id}`);
  },

  async addTeam(leagueId, teamId) {
    const response = await api.post(`/leagues/${leagueId}/teams/${teamId}`);
    return response.data;
  },

  async removeTeam(leagueId, teamId) {
    const response = await api.delete(`/leagues/${leagueId}/teams/${teamId}`);
    return response.data;
  },

  async updateStatus(leagueId, status) {
    const response = await api.put(`/leagues/${leagueId}/status`, { status });
    return response.data;
  }
};
