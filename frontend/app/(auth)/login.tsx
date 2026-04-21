import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Mail, UtensilsCrossed, ArrowRight, Lock, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { enterDemoMode, user } = useAuth();

  const handleSendOTP = async () => {
    if (!email) return;
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      Alert.alert('Error', error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      setIsVerifying(true);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error) {
      Alert.alert('Error', error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
        <View className="items-center mb-12">
          <View className="bg-primary/20 p-4 rounded-3xl mb-6">
            <UtensilsCrossed size={48} color="#F97316" strokeWidth={2.5} />
          </View>
          <Text className="text-white text-4xl font-bold text-center">School Cafeteria</Text>
          <Text className="text-primary text-4xl font-bold text-center mt-1">Pre-Order</Text>
        </View>

        {!isVerifying ? (
          <View className="w-full max-w-sm self-center space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
            <View className="flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
              <Mail size={20} color="#6b7280" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#6b7280"
                className="flex-1 text-white text-lg ml-3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              onPress={handleSendOTP}
              disabled={loading}
              activeOpacity={0.8}
              className="bg-primary w-full py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/40"
            >
              <Text className="text-white text-xl font-bold mr-2">{loading ? 'Sending...' : 'Get OTP Code'}</Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
            
            {/* DEV TESTING BUTTONS */}
            <View className="border-t border-white/5 pt-4 space-y-2">
              <TouchableOpacity onPress={() => enterDemoMode('customer')} className="flex-row items-center justify-center py-2">
                <Text className="text-gray-500 font-medium">Test as Student</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => enterDemoMode('admin')} className="flex-row items-center justify-center py-2">
                <Text className="text-gray-500 font-medium">Test as Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => enterDemoMode('superadmin')} className="flex-row items-center justify-center py-2 bg-primary/10 rounded-xl">
                <ShieldCheck size={16} color="#F97316" className="mr-2" />
                <Text className="text-primary font-bold">SuperAdmin Master Panel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="w-full max-w-sm self-center space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
            <Text className="text-white text-center text-lg mb-2">Enter code sent to {email}</Text>
            <View className="flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
              <Lock size={20} color="#6b7280" />
              <TextInput
                placeholder="6-digit code"
                placeholderTextColor="#6b7280"
                className="flex-1 text-white text-lg ml-3 tracking-widest font-bold"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity 
              onPress={handleVerifyOTP}
              disabled={loading}
              activeOpacity={0.8}
              className="bg-primary w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/40"
            >
              <Text className="text-white text-xl font-bold">{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsVerifying(false)} className="w-full items-center">
              <Text className="text-gray-500">Back to Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
