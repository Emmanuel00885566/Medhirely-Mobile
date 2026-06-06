import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export type Certification = {
  documentName: string;
  documentUrl: string;
  expiryDate: string;
};

export const workerService = {
  // ✅ Get Worker Profile
  getProfile: async () => {
    try {
      const response = await api.get('/workers/profile');
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      console.log('GET PROFILE ERROR:', error?.response?.data);
      throw error;
    }
  },

  // ✅ Update Basic Profile (Edit Profile Screen)
  updateProfile: async (data: {
    bio?: string;
    address?: string;
    exprienceYears?: string;
  }) => {
    try {
      const response = await api.put('/workers/profile', data);
      return response.data;
    } catch (error: any) {
      console.log('UPDATE PROFILE ERROR:', error?.response?.data);
      throw error;
    }
  },

  // ✅ Upload Credentials (Manage Credentials Screen)
  uploadCredentials: async (certifications: Certification[]) => {
    try {
      const response = await api.put('/workers/profile', {
        certifications,
      });
      return response.data;
    } catch (error: any) {
      console.log('UPLOAD CREDENTIALS ERROR:', error?.response?.data);
      throw error;
    }
  },

  // ✅ Get stored profile from AsyncStorage
  getStoredProfile: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
};