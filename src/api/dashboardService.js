import api from './axios';

export const dashboardService = {
  async getDashboard() {
    const response = await api.get('/dashboard');
    return response.data;
  },

  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getCharts() {
    const response = await api.get('/dashboard/charts');
    return response.data;
  }
};
