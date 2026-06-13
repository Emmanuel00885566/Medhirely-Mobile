import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';
import { workerService } from '../services/workerService';

type User = {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty: string;
  phoneNumber: string;
  verified: boolean;
  bio?: string;
  address?: string;
  experienceYears?: number;
  profilePicture?: string;
  verificationStatus?: string;
  certifications?: any[];
  rejectionReason?: string;
  availability?: any[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  hasSeenOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  setUserVerified: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          // Fetch fresh profile in background
          try {
            const freshProfile = await workerService.getProfile();
            setUser((prev: any) => ({
              ...prev,
              _id: freshProfile._id,
              id: freshProfile._id,
              firstName: freshProfile.firstName,
              lastName: freshProfile.lastName,
              specialty: freshProfile.specialty,
              phoneNumber: freshProfile.phoneNumber,
              bio: freshProfile.bio,
              address: freshProfile.address,
              experienceYears: freshProfile.experienceYears,
              verificationStatus: freshProfile.verificationStatus,
              profilePicture: freshProfile.profilePicture,
              email: freshProfile.user?.email || prev?.email,
              role: freshProfile.user?.role || prev?.role,
              verified: freshProfile.verificationStatus === 'Approved',
              certifications: freshProfile.certifications,
              availability: freshProfile.availability,
              rejectionReason: freshProfile.rejectionReason || '',
            }));
          } catch (e) {
            console.log('Background profile fetch failed:', e);
          }
        }
      } catch (error) {
        console.log('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      const profile = await workerService.getProfile();
      console.log('PROFILE DATA:', JSON.stringify(profile, null, 2));

      const userData: User = {
        _id: profile._id,
        id: profile._id,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.user?.email || '',
        role: profile.user?.role || '',
        specialty: profile.specialty || '',
        phoneNumber: profile.phoneNumber || '',
        verified: profile.verificationStatus === 'Approved',
        bio: profile.bio || '',
        address: profile.address || '',
        experienceYears: profile.experienceYears,
        profilePicture: profile.profilePicture || '',
        verificationStatus: profile.verificationStatus,
        certifications: profile.certifications || [],
        availability: profile.availability || [],
        rejectionReason: profile.rejectionReason || '',
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setHasSeenOnboarding(false);
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
  };

  const setUserVerified = () => {
    if (user) {
      setUser({ ...user, verified: true });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return updates as User;
      return { ...prevUser, ...updates };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isVerified: user?.verified ?? false,
        hasSeenOnboarding,
        login,
        logout,
        completeOnboarding,
        setUserVerified,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};