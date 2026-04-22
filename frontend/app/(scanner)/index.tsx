import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Scan, X, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { enterDemoMode } = useAuth();

  useEffect(() => {
    if (!permission) {
        requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // logic to handle scan (e.g. data is canteenCode)
    console.log('Scanned Canteen Code:', data);
    router.replace(`/(customer)/menu?canteenCode=${data}`);
  };

  const handleSkipToDemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(customer)/menu?canteenCode=DEMO-CANTEEN-001');
  };

  // 1. Permission Guard: If loading, show spinner
  if (!permission) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // 2. Permission Guard: If denied, show "Enable Permissions" UI instead of crashing
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-8">
        <View className="bg-red-500/10 p-6 rounded-full mb-6">
          <X size={48} color="#ef4444" />
        </View>
        <Text className="text-white text-2xl font-bold text-center mb-4">Camera Access Required</Text>
        <Text className="text-gray-400 text-center mb-8">We need camera access to scan the canteen QR code and fetch the menu.</Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-2xl w-full items-center"
        >
          <Text className="text-white font-bold text-lg">Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkipToDemo} className="mt-6">
          <Text className="text-gray-500 font-bold">Or Skip with Demo Canteen</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* UI Overlay */}
      <SafeAreaView className="flex-1 justify-between items-center py-12">
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">Scan Canteen QR</Text>
          <Text className="text-gray-300 mt-2">Point at the QR on the counter</Text>
        </View>

        {/* Scan Frame */}
        <View className="w-64 h-64 border-2 border-primary rounded-3xl items-center justify-center">
           <Scan size={48} color="#F97316" strokeWidth={1} />
        </View>

        <TouchableOpacity 
          onPress={handleSkipToDemo}
          className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20"
        >
          <View className="flex-row items-center">
            <Zap size={18} color="#F97316" className="mr-2" />
            <Text className="text-white font-bold">Skip with Demo Canteen</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
