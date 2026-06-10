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
    console.log('GET PROFILE RESPONSE:', JSON.stringify(response.data, null, 2));
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
    experienceYears?: string | number;
  }) => {
    try {
      const response = await api.put('/workers/profile', data);
      return response.data;
    } catch (error: any) {
      console.log('UPDATE PROFILE ERROR:', error?.response?.data);
      throw error;
    }
  },

  // ✅ Upload Avatar via PATCH /workers/profile/avatar (multipart/form-data)
  uploadAvatar: async (image: {
    uri: string;
    fileName: string;
    mimeType: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: image.uri,
        name: image.fileName,
        type: image.mimeType,
      } as any);

      const response = await api.patch('/workers/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.log('UPLOAD AVATAR ERROR:', error?.response?.data);
      throw error;
    }
  },

  // ✅ Upload Credentials via PATCH /workers/profile/credentials (multipart/form-data)
  uploadCredentials: async (files: {
    uri: string;
    fileName: string;
    mimeType: string;
  }[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('credentials', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        } as any);
      });

      const response = await api.patch('/workers/profile/credentials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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