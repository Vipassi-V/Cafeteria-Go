import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, ShoppingBag, History } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function StatusScreen() {
  const router = useRouter();

  const handleOrderMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(customer)/menu');
  };

  const handleGoHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(customer)/history');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-8">
        <View className="bg-primary/20 p-8 rounded-full mb-8">
          <CheckCircle size={80} color="#F97316" strokeWidth={1.5} />
        </View>

        <Text className="text-white text-4xl font-bold text-center mb-4">
          Order Submitted!
        </Text>
        
        <Text className="text-gray-400 text-lg text-center mb-12">
          Your payment screenshot has been sent to the canteen admin. You will receive a notification once your order is accepted.
        </Text>

        <View className="w-full space-y-4">
          <TouchableOpacity 
            onPress={handleOrderMore}
            activeOpacity={0.8}
            className="bg-primary w-full py-5 rounded-3xl flex-row items-center justify-center shadow-lg shadow-primary/40"
          >
            <ShoppingBag size={24} color="white" className="mr-2" />
            <Text className="text-white text-xl font-bold">Order More</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleGoHistory}
            className="w-full py-4 items-center"
          >
            <View className="flex-row items-center">
              <History size={18} color="#6b7280" className="mr-2" />
              <Text className="text-gray-500 font-bold text-base">View My Orders</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text className="text-gray-600 text-center mb-8 text-xs font-bold uppercase tracking-widest">
        MenuQR Authentication Verified
      </Text>
    </SafeAreaView>
  );
}
