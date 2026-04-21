import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCart } from '../../context/CartContext';

interface MenuCardProps {
  item: any;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart, cart } = useCart();
  
  const cartItem = cart.find(i => i.menuItemId === item._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart(item);
  };

  return (
    <View 
      className={`flex-row bg-white/5 border border-white/10 p-4 rounded-3xl mb-4 items-center ${!item.isAvailable ? 'opacity-50' : ''}`}
    >
      {/* Image Placeholder */}
      <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
        ) : (
          <Text className="text-primary text-xs font-bold text-center">{item.category}</Text>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
          {item.description || 'Delicious freshly prepared meal.'}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-primary text-xl font-bold">₹{item.price}</Text>
          
          {!item.isAvailable ? (
            <View className="flex-row items-center bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
               <AlertCircle size={14} color="#ef4444" className="mr-1" />
               <Text className="text-red-500 text-xs font-bold">Out of Stock</Text>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleAdd}
              activeOpacity={0.7}
              className="bg-primary px-4 py-2 rounded-xl flex-row items-center"
            >
              <Plus size={18} color="white" strokeWidth={3} />
              {quantity > 0 && (
                <Text className="text-white font-bold ml-1">{quantity}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
