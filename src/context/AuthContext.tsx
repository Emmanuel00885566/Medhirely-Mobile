import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  verified: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  hasSeenOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
        if (storedUser) setUser(storedUser);
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
      const { user } = await authService.login(email, password);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signup(name, email, password);
      setUser(user);
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

  // ✅ For when admin approves — flip verified to true
  const setUserVerified = () => {
    if (user) setUser({ ...user, verified: true });
  };
  const updateUser = (updates: Partial<User>) => {
  if (user) setUser({ ...user, ...updates });
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
        signup,
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};