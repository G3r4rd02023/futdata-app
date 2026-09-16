import api from './axios';

export const rankingService = {
  async getLeagueStandings(leagueId) {
    const response = await api.get(`/leagues/${leagueId}/standings`);
    return response.data;
  },

  async getGeneralRanking() {
    const response = await api.get('/rankings/general');
    return response.data;
  },

  async getTopTeams(count = 10) {
    const response = await api.get('/rankings/top-teams', { params: { count } });
    return response.data;
  },

  async getTeamStats(teamId) {
    const response = await api.get(`/rankings/team/${teamId}`);
    return response.data;
  }
};
