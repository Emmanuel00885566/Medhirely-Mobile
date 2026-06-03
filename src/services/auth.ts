import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  // ✅ Register
  signup: async (fullName: string, email: string, password: string, phone?: string) => {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      phone,
    });
    return response.data;
  },

  // ✅ Verify Email OTP
  verifyEmail: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // ✅ Resend OTP
  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-email-otp', { email });
    return response.data;
  },

  // ✅ Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // ✅ Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // ✅ Reset Password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  // ✅ Logout
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // ✅ Get stored user
  getStoredUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // ✅ Check if logged in
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};