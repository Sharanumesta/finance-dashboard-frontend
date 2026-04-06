import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    console.log('Register API response:', response.data);
    
    // Your backend returns: { success, message, data: { user, token } }
    const token = response.data.data?.token;
    const user = response.data.data?.user;
    
    console.log('Extracted token:', token);
    console.log('Extracted user:', user);
    
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
    console.log('Login API response:', response.data);
    
    // Your backend returns: { success, message, data: { user, token } }
    const token = response.data.data?.token;
    const user = response.data.data?.user;
    
    console.log('Extracted token:', token);
    console.log('Extracted user:', user);
    
    if (token) {
      localStorage.setItem('accessToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      console.log('Stored in localStorage - Token:', token.substring(0, 50) + '...');
      console.log('Stored in localStorage - User:', user);
      return { token, user };
    } else {
      console.error('No token found in response:', response.data);
      throw new Error('Invalid server response: No token received');
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    console.log('Cleared localStorage');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    console.log('Getting current user from storage:', userStr ? 'User exists' : 'No user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Parsed user:', user);
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
    console.log('Getting token from storage:', token ? 'Token exists' : 'No token');
    return token;
  },

  isAuthenticated() {
    const authenticated = !!this.getToken();
    console.log('Is authenticated:', authenticated);
    return authenticated;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    console.log('Profile response:', response.data);
    // Handle your backend's response format for profile
    const user = response.data.data?.user || response.data.user;
    return user;
  }
};