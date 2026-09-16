import api from './axios';

export const simulationService = {
  async simulate(data) {
    const response = await api.post('/simulation/simulate', data);
    return response.data;
  },

  async simulateBatch(data) {
    const response = await api.post('/simulation/batch', data);
    return response.data;
  },

  async getHistory(leagueId) {
    const params = leagueId ? { leagueId } : {};
    const response = await api.get('/simulation/history', { params });
    return response.data;
  },

  async getStats(leagueId) {
    const params = leagueId ? { leagueId } : {};
    const response = await api.get('/simulation/stats', { params });
    return response.data;
  }
};
