import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { InsertUser, User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Query to check current user session
  const { data: user, isLoading: isUserLoading, refetch } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    onError: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return res.json();
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest('POST', '/api/auth/register', userData);
      return res.json();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.invalidateQueries();
    },
  });

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ username, password });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: InsertUser) => {
    setIsLoading(true);
    try {
      await registerMutation.mutateAsync(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  const value = {
    user: user || null,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
