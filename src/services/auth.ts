import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 Mocked user data — replace with real API calls later
const MOCK_USER = {
  id: '1',
  name: 'Emmanuel Adebayo',
  email: 'emmanuel@medhirely.com',
  role: 'worker',
  specialty: 'Registered Nurse',
  verified: false,
};

export const authService = {
  // ✅ Login
  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1000));

    if (email && password) {
      const token = 'mock-jwt-token-12345';
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
      return { token, user: MOCK_USER };
    }

    throw new Error('Invalid credentials');
  },

  // ✅ Signup
  signup: async (name: string, email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 1000));

    const newUser = { ...MOCK_USER, name, email };
    const token = 'mock-jwt-token-12345';
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return { token, user: newUser };
  },

  // ✅ Logout
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // ✅ Get stored user
  getStoredUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ✅ Check if logged in
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};