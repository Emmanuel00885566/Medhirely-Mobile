import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 When your backend is ready, just change this URL
const BASE_URL = 'https://your-api-url.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach JWT token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigation to login will be handled by AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;