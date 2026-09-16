import api from './axios';

export const teamService = {
  async getAll(search = '') {
    const params = search ? { search } : {};
    const response = await api.get('/teams', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/teams', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/teams/${id}`);
  },

  async uploadLogo(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/teams/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
