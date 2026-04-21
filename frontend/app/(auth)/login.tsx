import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, UtensilsCrossed } from 'lucide-react-native';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background justify-center items-center px-6"
    >
      <View className="items-center mb-12">
        <View className="bg-primary/20 p-4 rounded-3xl mb-6">
          <UtensilsCrossed size={48} color="#F97316" strokeWidth={2.5} />
        </View>
        
        <Text className="text-white text-4xl font-bold text-center">
          School Cafeteria
        </Text>
        <Text className="text-primary text-4xl font-bold text-center mt-1">
          Pre-Order
        </Text>
        
        <Text className="text-gray-400 text-lg mt-4 text-center">
          Enter your details to continue
        </Text>
      </View>

      <View className="w-full max-w-sm space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
        <View className="flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
          <Mail size={20} color="#6b7280" className="mr-3" />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#6b7280"
            className="flex-1 text-white text-lg ml-2"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          className="bg-primary w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/40"
        >
          <Text className="text-white text-xl font-bold">
            Get OTP Code
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text className="text-gray-500 absolute bottom-12 text-sm">
        MenuQR Powered
      </Text>
    </KeyboardAvoidingView>
  );
}
