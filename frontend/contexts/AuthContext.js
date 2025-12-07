// contexts/AuthContext.js - FIXED VERSION
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔄 Checking auth...');
    
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user'); // Check for saved user
      
      console.log('🔐 Token exists:', !!token);
      console.log('🔐 Saved user exists:', !!savedUser);
      
      if (token && savedUser) {
        try {
          // Use the saved user data instead of parsing from token
          const userData = JSON.parse(savedUser);
          console.log('✅ Restoring user from localStorage:', userData);
          setUser(userData);
        } catch (error) {
          console.error('❌ Error parsing saved user:', error);
          // Fallback to token verification
          await verifyAndSetUser(token);
        }
      } else if (token) {
        // Only token exists, verify it
        await verifyAndSetUser(token);
      } else {
        console.log('❌ No token found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSetUser = async (token) => {
    try {
      const userData = await verifyToken(token);
      if (userData) {
        console.log('✅ Auth check successful, user:', userData);
        setUser(userData);
        // Also save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.log('❌ Invalid token, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Token verification error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

 const verifyToken = async (token) => {
  try {
    console.log('🔍 Verifying token:', token?.substring(0, 30) + '...');
    
    // First try base64 decode (server format)
    try {
      const payload = JSON.parse(atob(token));
      console.log('🔍 Base64 payload decoded:', payload);
      
      return {
        _id: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp
      };
    } catch (base64Error) {
      console.log('❌ Base64 decode failed:', base64Error.message);
    }
    
    // If not base64, check if it's a demo token
    if (token && token.startsWith('demo-')) {
      console.log('🔍 Demo token detected');
      
      if (token.includes('admin')) {
        return {
          _id: 'admin-user',
          username: 'admin',
          email: 'admin@woodworks.com',
          role: 'admin'
        };
      }
      
      return {
        _id: 'demo-user',
        username: 'demo',
        email: 'demo@woodworks.com',
        role: 'customer'
      };
    }
    
    console.error('❌ Token could not be parsed in any format');
    return null;
    
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return null;
  }
};

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔐 Login response:', data);

      if (data.success && data.token && data.user) {
        // Store token AND user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Store full user object
        console.log('✅ Token and user stored in localStorage');
        
        // Set user data
        setUser(data.user);
        console.log('✅ User set in context:', data.user);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // UPDATED REGISTER FUNCTION - FIXED VERSION
  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      
      // Validate required fields before sending
      if (!userData.firstName || !userData.lastName) {
        return { 
          success: false, 
          error: 'First name and last name are required' 
        };
      }

      if (!userData.username || !userData.email || !userData.password) {
        return { 
          success: false, 
          error: 'Username, email, and password are required' 
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || ''
        }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Store token AND user data
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); // Store full user object
        }
        
        // Set user data
        setUser(data.user);
        
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.error || 'Registration failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('❌ Registration network error:', error);
      return { 
        success: false, 
        error: 'Registration failed - Network error. Please check your connection.' 
      };
    }
  };

  // UPDATE: Also update localStorage when updating user
  const updateUser = (updatedUserData) => {
    console.log('🔄 Updating user context with:', updatedUserData);
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    // Also update localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    console.log('🚪 Logging out user:', user?.username);
    // Clear both token and user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('✅ Logout complete - localStorage cleared');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}