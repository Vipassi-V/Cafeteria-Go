import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Plus, Store, Users, DollarSign, LogOut, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminDashboard() {
  const [canteens, setCanteens] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { session, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const headers = { Authorization: `Bearer ${session?.access_token}` };
      
      const [canteensRes, statsRes] = await Promise.all([
        axios.get(`${apiUrl}/superadmin/canteens`, { headers }),
        axios.get(`${apiUrl}/superadmin/stats`, { headers })
      ]);
      
      setCanteens(canteensRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('SuperAdmin Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Platform Master</Text>
            <Text className="text-white text-3xl font-bold">Overview</Text>
          </View>
          <TouchableOpacity onPress={signOut} className="bg-white/5 p-3 rounded-2xl">
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards Row */}
        <View className="flex-row justify-between mb-8">
          <View className="bg-white/5 border border-white/10 p-4 rounded-3xl flex-1 mr-2">
            <Store size={20} color="#F97316" className="mb-2" />
            <Text className="text-white text-xl font-bold">{stats?.totalCanteens || 0}</Text>
            <Text className="text-gray-500 text-xs font-bold uppercase">Canteens</Text>
          </View>
          <View className="bg-white/5 border border-white/10 p-4 rounded-3xl flex-1 mx-1">
            <TrendingUp size={20} color="#3b82f6" className="mb-2" />
            <Text className="text-white text-xl font-bold">{stats?.totalOrders || 0}</Text>
            <Text className="text-gray-500 text-xs font-bold uppercase">Orders</Text>
          </View>
          <View className="bg-white/5 border border-white/10 p-4 rounded-3xl flex-1 ml-2">
            <DollarSign size={20} color="#22c55e" className="mb-2" />
            <Text className="text-white text-xl font-bold">₹{stats?.totalRevenue || 0}</Text>
            <Text className="text-gray-500 text-xs font-bold uppercase">Revenue</Text>
          </View>
        </View>

        {/* Canteen List */}
        <Text className="text-white text-lg font-bold mb-4 ml-1">Active Canteens</Text>
        {canteens.map((c) => (
          <View key={c._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-white text-xl font-bold">{c.name}</Text>
                <Text className="text-gray-400 text-xs font-bold uppercase">Code: {c.canteenCode}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${c.isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <Text className={`text-xs font-bold ${c.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between border-t border-white/5 pt-4">
              <View className="flex-row items-center">
                <Users size={16} color="#6b7280" className="mr-2" />
                <Text className="text-gray-400 text-sm">{c.adminId?.name || 'No Admin'}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white font-bold mr-1">{c.orderCount || 0}</Text>
                <Text className="text-gray-500 text-xs uppercase">Orders</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View className="h-24" /> {/* Spacer */}
      </ScrollView>

      {/* Launch New Canteen Button */}
      <TouchableOpacity 
        onPress={() => router.push('/(superadmin)/create-canteen')}
        activeOpacity={0.8}
        className="absolute bottom-10 right-6 bg-primary flex-row items-center px-8 py-5 rounded-3xl shadow-2xl shadow-primary/40"
      >
        <Plus size={24} color="white" className="mr-2" />
        <Text className="text-white text-lg font-bold">Launch Canteen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
