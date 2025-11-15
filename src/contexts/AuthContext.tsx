import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string; // username
  role: 'USER' | 'ADMIN';
  exp: number;
}

interface AuthContextType {
  jwt: string | null;
  username: string | null;
  role: 'USER' | 'ADMIN' | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwt, setJwt] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<'USER' | 'ADMIN' | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setJwt(token);
          setUsername(decoded.sub);
          setRole(decoded.role);
        } else {
          // Token expired, clear it
          localStorage.removeItem('jwt');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      setJwt(token);
      setUsername(decoded.sub);
      setRole(decoded.role);
      localStorage.setItem('jwt', token);
    } catch (error) {
      console.error('Invalid token:', error);
      throw new Error('Invalid authentication token');
    }
  };

  const logout = () => {
    setJwt(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem('jwt');
  };

  const value: AuthContextType = {
    jwt,
    username,
    role,
    login,
    logout,
    isAuthenticated: !!jwt,
    isAdmin: role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
