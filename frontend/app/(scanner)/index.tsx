import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { QrCode, X, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  if (!permission) {
    return <View className="flex-1 bg-background" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-8">
        <QrCode size={64} color="#F97316" className="mb-6" />
        <Text className="text-white text-2xl font-bold text-center mb-4">Camera Access Needed</Text>
        <Text className="text-gray-400 text-center mb-8">
          We need your camera to scan the canteen QR code and show you the menu.
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Logic: Extracts canteenCode (Mocking it for now)
    console.log('Scanned Data:', data);
    Alert.alert("QR Scanned", `Joining canteen: ${data}`, [
      { text: "OK", onPress: () => router.replace('/menu') }
    ]);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        className="flex-1"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          {/* Scan Frame */}
          <View className="w-64 h-64 border-2 border-primary rounded-3xl items-center justify-center">
             <View className="w-full h-0.5 bg-primary/50 absolute" style={{ top: '50%' }} />
          </View>
          
          <Text className="text-white mt-8 text-lg font-medium">Scan Canteen QR Code</Text>
          
          <TouchableOpacity 
            onPress={() => router.replace('/(auth)/login')} 
            className="absolute top-12 right-6 bg-black/60 p-3 rounded-full"
          >
            <X size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleBarCodeScanned({ data: 'DEMO-CANTEEN-001' })}
            className="absolute bottom-12 flex-row items-center bg-primary/20 border border-primary/40 px-6 py-3 rounded-2xl"
          >
            <Zap size={20} color="#F97316" className="mr-2" />
            <Text className="text-primary font-bold">Skip with Demo Canteen</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
