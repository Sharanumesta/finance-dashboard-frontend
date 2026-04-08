import api from "./api";

export const transactionService = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.category) params.append("category", filters.category);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await api.get(`/transactions?${params.toString()}`);
    console.log(response.data);
    console.log(response.data.data);
    console.log(response.data.meta);
    // Extract the transactions array from the nested structure
    return {
      transactions: response.data.data || [], // ← key change
      pagination: response.data.meta.page,
    };
  },

  async getTransactionById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async createTransaction(data) {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  async updateTransaction(id, data) {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};
