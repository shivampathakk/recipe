import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // {id, name, email}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('@current_user');
        if (json) {
          setUser(JSON.parse(json));
        }
      } catch (e) {
        console.log('Error loading user', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    const res = await client.get('/users', { params: { email, password } });
    if (res.data.length === 0) {
      throw new Error('Invalid email or password');
    }
    const u = res.data[0];
    const cleanUser = { id: u.id, name: u.name, email: u.email };
    await AsyncStorage.setItem('@current_user', JSON.stringify(cleanUser));
    setUser(cleanUser);
  };

  const signup = async ({ name, email, password }) => {
    // check if email exists
    const existing = await client.get('/users', { params: { email } });
    if (existing.data.length > 0) {
      throw new Error('Email already registered');
    }
    const res = await client.post('/users', { name, email, password });
    const u = res.data;
    const cleanUser = { id: u.id, name: u.name, email: u.email };
    await AsyncStorage.setItem('@current_user', JSON.stringify(cleanUser));
    setUser(cleanUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
