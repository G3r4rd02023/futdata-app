import api from './axios';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(username, email) {
    const response = await api.put('/auth/profile', { username, email });
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/auth/users');
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/auth/users/${userId}/role`, { role });
    return response.data;
  }
};
