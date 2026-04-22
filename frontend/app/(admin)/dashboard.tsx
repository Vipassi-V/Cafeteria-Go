import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { socket } from '../../lib/socket';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CheckCircle2, ChevronRight, LogOut, Utensils, Bell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, session, signOut } = useAuth();

  // 1. Initialize the new Expo Audio Player
  const player = useAudioPlayer(require('../../assets/sounds/notification.wav'));

  useEffect(() => {
    fetchOrders();

    // 2. Listen for new orders in real-time
    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      
      // Play sound using the new stable API
      if (player) {
        player.play();
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });

    return () => {
      socket.off('new_order');
    };
  }, [player]);

  const fetchOrders = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Fetch Admin Orders Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await axios.patch(`${apiUrl}/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error('Update Status Error:', err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const otherOrders = orders.filter(o => o.status !== 'pending');

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5">
        <View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kitchen Hub</Text>
          <Text className="text-white text-2xl font-bold">{user?.cafeteriaId?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={signOut} className="bg-white/5 p-3 rounded-2xl">
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...pendingOrders, ...otherOrders]}
        keyExtractor={(item) => item._id || item.orderId}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <View className={`bg-white/5 border rounded-3xl p-6 mb-4 ${item.status === 'pending' ? 'border-primary' : 'border-white/10'}`}>
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-white text-lg font-bold">{item.customerName}</Text>
                <Text className="text-gray-400 text-sm">Pickup: {item.timeSlot}</Text>
              </View>
              <View className="bg-primary/20 px-4 py-1 rounded-full self-start">
                <Text className="text-primary font-bold capitalize">{item.status}</Text>
              </View>
            </View>

            {/* Items List */}
            <View className="mb-6">
              {item.items.map((it: any, idx: number) => (
                <Text key={idx} className="text-gray-300 font-medium">• {it.name} x{it.quantity}</Text>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row space-x-3">
              {item.status === 'pending' && (
                <TouchableOpacity 
                   onPress={() => updateStatus(item._id || item.orderId, 'accepted')}
                   className="flex-1 bg-primary py-4 rounded-2xl items-center flex-row justify-center"
                >
                  <Utensils size={18} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Accept Order</Text>
                </TouchableOpacity>
              )}

              {item.status === 'accepted' && (
                <TouchableOpacity 
                  onPress={() => updateStatus(item._id, 'ready')}
                  className="flex-1 bg-green-600 py-4 rounded-2xl items-center flex-row justify-center"
                >
                  <CheckCircle2 size={18} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Mark Ready</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListHeaderComponent={
            pendingOrders.length > 0 ? (
                <View className="flex-row items-center mb-4 ml-1">
                    <Bell size={18} color="#F97316" className="mr-2" />
                    <Text className="text-primary font-bold">NEW ORDERS ARRIVING</Text>
                </View>
            ) : null
        }
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 opacity-20">
            <Utensils size={64} color="white" />
            <Text className="text-white text-lg mt-4">Kitchen is quiet...</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
