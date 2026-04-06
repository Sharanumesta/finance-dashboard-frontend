import api from './api';

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getCategoryBreakdown() {
    const response = await api.get('/dashboard/categories');
    return response.data;
  },

  async getMonthlyTrends() {
    const response = await api.get('/dashboard/monthly');
    return response.data;
  },

  async getWeeklyTrends() {
    const response = await api.get('/dashboard/weekly');
    return response.data;
  },

  async getRecentActivity(limit = 10) {
    const response = await api.get('/dashboard/recent', {
      params: { limit }
    });
    return response.data;
  }
};