import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { ArrowLeft, History as HistoryIcon, Clock, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function HistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/orders/my-history`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Fetch History Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'accepted': return 'text-blue-500';
      case 'ready': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-400';
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
      <View className="px-6 py-4 flex-row items-center border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchHistory} tintColor="#F97316" />
        }
        renderItem={({ item }) => (
          <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-4">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">{item.cafeteriaId?.name || 'Canteen'}</Text>
                <Text className="text-white text-xl font-bold">₹{item.totalAmount}</Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold capitalize ${getStatusColor(item.status)}`}>{item.status}</Text>
                <Text className="text-gray-500 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>

            <View className="flex-row items-center bg-black/20 p-3 rounded-2xl">
              <Clock size={16} color="#6b7280" className="mr-2" />
              <Text className="text-gray-400 font-medium">Pickup: {item.timeSlot}</Text>
            </View>

            <View className="mt-4">
              {item.items.map((it: any, idx: number) => (
                <Text key={idx} className="text-gray-300 text-sm">{it.name} x{it.quantity}</Text>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <HistoryIcon size={64} color="#1f2937" className="mb-4" />
            <Text className="text-gray-500 text-lg">No orders yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
