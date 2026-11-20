import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap user authentication on load
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const currentUser = await authApi.getMe();
        if (isMounted) setUser(currentUser);
      } catch (_err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    toast.success('Signed in successfully');
    return data.user;
  };

  const signup = async (formData) => {
    const data = await authApi.signup(formData);
    setUser(data.user);
    toast.success('Account created successfully');
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_err) {
      // Clear local state even if server fails
    } finally {
      setUser(null);
      toast.info('Signed out');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
