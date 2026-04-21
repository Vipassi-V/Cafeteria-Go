import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Clock, Copy, Image as ImageIcon, CheckCircle, ArrowLeft } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { uploadPaymentScreenshot } from '../../lib/upload';

export default function CheckoutScreen() {
  const { user, session } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [selectedTime, setSelectedTime] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const timeSlots = user?.cafeteriaId?.timeSlots || ["10:15", "11:30", "12:45", "14:00"];

  const handleCopyAmount = async () => {
    await Clipboard.setStringAsync(cartTotal.toString());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'Amount copied to clipboard');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedTime) return Alert.alert('Error', 'Please select a pickup time');
    if (!screenshot) return Alert.alert('Error', 'Please upload your payment screenshot');

    setLoading(true);
    try {
      // 1. Upload screenshot securely
      const imageUrl = await uploadPaymentScreenshot(screenshot, session?.access_token!);

      // 2. Create Order in Backend
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/orders`, {
        cafeteriaId: user?.cafeteriaId?._id,
        items: cart,
        totalAmount: cartTotal,
        timeSlot: selectedTime,
        paymentScreenshotUrl: imageUrl
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      // 3. Success! Clear cart and redirect
      clearCart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(customer)/status');
    } catch (error: any) {
      console.error('Checkout Error:', error);
      Alert.alert('Checkout Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}>
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Checkout</Text>
      </View>

      {/* 1. Order Summary */}
      <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-6">
        <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Order Summary</Text>
        {cart.map((item, idx) => (
          <View key={idx} className="flex-row justify-between mb-2">
            <Text className="text-white text-lg">{item.name} x{item.quantity}</Text>
            <Text className="text-primary text-lg font-bold">₹{item.price * item.quantity}</Text>
          </View>
        ))}
        <View className="border-t border-white/10 mt-4 pt-4 flex-row justify-between">
          <Text className="text-white text-xl font-bold">Total</Text>
          <Text className="text-primary text-2xl font-bold">₹{cartTotal}</Text>
        </View>
      </View>

      {/* 2. Pickup Time */}
      <View className="mb-6">
        <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Select Pickup Time</Text>
        <View className="flex-row flex-wrap">
          {timeSlots.map((slot: string) => (
            <TouchableOpacity 
              key={slot}
              onPress={() => setSelectedTime(slot)}
              className={`mr-3 mb-3 px-6 py-3 rounded-2xl border ${selectedTime === slot ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
            >
              <Text className={`font-bold ${selectedTime === slot ? 'text-white' : 'text-gray-400'}`}>{slot}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Payment Section */}
      <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-6">
        <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Payment Information</Text>
        
        <View className="items-center mb-4">
          {/* Admin QR Code display */}
          <View className="bg-white p-2 rounded-2xl mb-4 w-48 h-48 items-center justify-center">
            {user?.cafeteriaId?.paymentQRUrl ? (
              <Image source={{ uri: user.cafeteriaId.paymentQRUrl }} className="w-full h-full" />
            ) : (
              <View className="items-center justify-center p-4">
                <CreditCard size={48} color="#000" />
                <Text className="text-center font-bold mt-2">Scan QR to Pay</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={handleCopyAmount}
            className="flex-row items-center bg-primary/20 px-4 py-2 rounded-xl mb-4"
          >
            <Text className="text-primary font-bold mr-2">Copy Total: ₹{cartTotal}</Text>
            <Copy size={16} color="#F97316" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={pickImage}
          className={`w-full py-12 rounded-3xl border-2 border-dashed items-center justify-center ${screenshot ? 'border-primary bg-primary/5' : 'border-white/10'}`}
        >
          {screenshot ? (
            <View className="items-center">
              <CheckCircle size={32} color="#F97316" />
              <Text className="text-primary font-bold mt-2">Screenshot Added</Text>
            </View>
          ) : (
            <View className="items-center">
              <ImageIcon size={32} color="#6b7280" />
              <Text className="text-gray-400 mt-2 font-medium">Upload Payment Screenshot</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity 
        onPress={handlePlaceOrder}
        disabled={loading}
        activeOpacity={0.8}
        className="bg-primary w-full py-5 rounded-3xl items-center justify-center shadow-2xl shadow-primary/40"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-xl font-bold">Submit Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
