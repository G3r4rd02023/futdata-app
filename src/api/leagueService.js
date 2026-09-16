import api from './axios';

export const leagueService = {
  async getAll() {
    const response = await api.get('/leagues');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/leagues/${id}`);
    return response.data;
  },

  async search(searchTerm) {
    const response = await api.get('/leagues/search', { params: { searchTerm } });
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
