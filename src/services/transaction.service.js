import api from './api';

export const transactionService = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    
    // Add all filter parameters
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const url = `/transactions?${params.toString()}`;
    
    const response = await api.get(url);
    return response.data;
  },

  async getTransactionById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async createTransaction(data) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async updateTransaction(id, data) {
    const response = await api.patch(`/transactions/${id}`, data);
    console.log(response.data)
    return response.data;
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};