import api from './api';

export const userService = {
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  }
};