import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  // ✅ Register
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    specialty: string;
    password: string;
  }) => {
    const response = await api.post(
      '/auth/register',
      data
    );

    return response.data;
  },

  // ✅ Verify Email OTP
  verifyEmail: async (
    email: string,
    otp: string
  ) => {
    console.log(
      'Sending to verify-email:',
      { email, otp }
    );

    const response = await api.post(
      '/auth/verify-email',
      {
        email,
        otp,
      }
    );

    console.log(
      'Verify response:',
      response.data
    );

    return response.data;
  },

  // ✅ Resend OTP
  resendOtp: async (email: string) => {
    const response = await api.post(
      '/auth/resend-email-otp',
      { email }
    );

    return response.data;
  },

  // ✅ Login
  login: async (
    email: string,
    password: string
  ) => {
    console.log(
      'Sending to login:',
      { email, password }
    );

    const response = await api.post(
      '/auth/login',
      {
        email,
        password,
      }
    );

    console.log(
      'Login response:',
      response.data
    );

    const { token } = response.data;

await AsyncStorage.setItem('token', token);

await AsyncStorage.setItem(
  'user',
  JSON.stringify({
    id: '',
    firstName: '',
    lastName: '',
    email,
    role: 'worker',
    specialty: '',
    phoneNumber: '',
    verified: true,
  })
);

return { token };
  },

  // ✅ Forgot Password
  forgotPassword: async (
    email: string
  ) => {
    const response = await api.post(
      '/auth/forgot-password',
      { email }
    );

    return response.data;
  },

  // ✅ Reset Password
  resetPassword: async (
    token: string,
    newPassword: string
  ) => {
    const response = await api.post(
      '/auth/reset-password',
      {
        token,
        newPassword,
      }
    );

    return response.data;
  },

  // ✅ Logout
  logout: async () => {
    await AsyncStorage.removeItem(
      'token'
    );

    await AsyncStorage.removeItem(
      'user'
    );
  },

  // ✅ Get Stored User
  getStoredUser: async () => {
    try {
      const user =
        await AsyncStorage.getItem(
          'user'
        );

      return user
        ? JSON.parse(user)
        : null;
    } catch {
      return null;
    }
  },

  // ✅ Check Authentication
  isAuthenticated: async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          'token'
        );

      return !!token;
    } catch {
      return false;
    }
  },
};