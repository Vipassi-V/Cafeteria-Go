import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useRouter, useSegments } from 'expo-router';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface AuthState {
  session: Session | null;
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  enterDemoMode: (role: 'customer' | 'admin' | 'superadmin') => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        syncWithBackend(session.access_token);
        connectSocket(session.access_token);
      } else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        syncWithBackend(session.access_token);
        connectSocket(session.access_token);
      } else {
        setUser(null);
        setLoading(false);
        disconnectSocket();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncWithBackend = async (token: string) => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      
      const inAuthGroup = segments[0] === '(auth)';
      
      if (response.data.redirect && inAuthGroup) {
        router.replace(response.data.redirect);
      }
    } catch (err) {
      console.error('Backend Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const enterDemoMode = (role: 'customer' | 'admin' | 'superadmin') => {
    setIsDemo(true);
    let mockUser: any = {
      name: `Demo ${role}`,
      email: `${role}@demo.edu`,
      role: role,
    };

    if (role === 'admin') {
      mockUser.cafeteriaId = { _id: 'mock_id', canteenCode: 'DEMO-CANTEEN-001', name: 'Demo Canteen' };
    }

    setUser(mockUser);
    setLoading(false);

    if (role === 'superadmin') router.replace('/(superadmin)/dashboard');
    else if (role === 'admin') router.replace('/(admin)/dashboard');
    else router.replace('/(scanner)');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsDemo(false);
    setUser(null);
    disconnectSocket();
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, enterDemoMode, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
