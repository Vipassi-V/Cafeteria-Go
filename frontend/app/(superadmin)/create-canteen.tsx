import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Store, Mail, Hash, Rocket } from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function CreateCanteenScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { session } = useAuth();
  const router = useRouter();

  const handleLaunch = async () => {
    if (!name || !email || !code) {
      return Alert.alert('Error', 'Please fill in all fields');
    }

    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/superadmin/canteen`, {
        name,
        adminEmail: email,
        canteenCode: code
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'New canteen launched and Admin linked!');
      router.back();
    } catch (error: any) {
      console.error('Launch Error:', error);
      Alert.alert('Launch Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold mb-2">Launch Canteen</Text>
        <Text className="text-gray-400 text-lg mb-8">Setup a new facility and link an administrator instantly.</Text>

        <View className="space-y-6">
          {/* Canteen Name */}
          <View>
            <Text className="text-gray-500 font-bold mb-2 uppercase text-xs ml-1">Official Name</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
              <Store size={20} color="#6b7280" />
              <TextInput
                placeholder="e.g. South Block Canteen"
                placeholderTextColor="#6b7280"
                className="flex-1 text-white ml-3 text-lg"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Admin Email */}
          <View>
            <Text className="text-gray-500 font-bold mb-2 uppercase text-xs ml-1">Administrator Email</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
              <Mail size={20} color="#6b7280" />
              <TextInput
                placeholder="admin@school.edu"
                placeholderTextColor="#6b7280"
                className="flex-1 text-white ml-3 text-lg"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Text className="text-gray-600 text-xs mt-2 ml-1">This user will be automatically promoted to Admin.</Text>
          </View>

          {/* Canteen Code */}
          <View>
            <Text className="text-gray-500 font-bold mb-2 uppercase text-xs ml-1">Canteen QR Code</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
              <Hash size={20} color="#6b7280" />
              <TextInput
                placeholder="e.g. SOUTH-01"
                placeholderTextColor="#6b7280"
                className="flex-1 text-white ml-3 text-lg font-bold"
                value={code}
                onChangeText={v => setCode(v.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLaunch}
          disabled={loading}
          activeOpacity={0.8}
          className="bg-primary mt-12 py-5 rounded-3xl flex-row items-center justify-center shadow-2xl shadow-primary/40"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Rocket size={20} color="white" className="mr-2" />
              <Text className="text-white text-xl font-bold">Launch Facility</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
