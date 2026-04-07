import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const token = response.data.data?.token;
    const user = response.data.data?.user;
    
    if (token) {
      localStorage.setItem('accessToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return { token, user };
    } else {
      console.error('No token found in response:', response.data);
      throw new Error('Invalid server response: No token received');
    }
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);

    const token = response.data.data?.token;
    const user = response.data.data?.user;
        
    if (token) {
      localStorage.setItem('accessToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return { token, user };
    } else {
      console.error('No token found in response:', response.data);
      throw new Error('Invalid server response: No token received');
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  },

  getToken() {
    const token = localStorage.getItem('accessToken');
    return token;
  },

  isAuthenticated() {
    const authenticated = !!this.getToken();
    return authenticated;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    const user = response.data.data?.user || response.data.user;
    return user;
  }
};