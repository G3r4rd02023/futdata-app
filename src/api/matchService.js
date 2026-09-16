import api from './axios';

export const matchService = {
  async getAll(filters = {}, page = 1, pageSize = 12) {
    const params = { page, pageSize };
    if (filters.leagueId) params.leagueId = filters.leagueId;
    if (filters.teamId) params.teamId = filters.teamId;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.status) params.status = filters.status;
    if (filters.round) params.round = filters.round;
    const response = await api.get('/matches', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/matches', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/matches/${id}`, data);
    return response.data;
  },

  async registerResult(id, data) {
    const response = await api.put(`/matches/${id}/result`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/matches/${id}`);
  },

  async updateStatus(id, status) {
    const response = await api.post(`/matches/${id}/status`, { status });
    return response.data;
  },

  async getLeagueStats(leagueId) {
    const response = await api.get(`/matches/stats/${leagueId}`);
    return response.data;
  }
};
