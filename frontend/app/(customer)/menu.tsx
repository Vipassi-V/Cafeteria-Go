import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Search, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import MenuCard from '../../components/Menu/MenuCard';

export default function MenuScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cafeteria, setCafeteria] = useState<any>(null);
  
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMenu();
  }, [user]);

  const fetchMenu = async () => {
    try {
      const canteenCode = user?.cafeteriaId?.canteenCode || 'DEMO-CANTEEN-001';
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/menu/${canteenCode}`);
      
      setCafeteria(response.data.cafeteria);
      setItems(response.data.items);
      
      // Extract unique categories
      const uniqueCats = ['All', ...new Set(response.data.items.map((i: any) => i.category))];
      setCategories(uniqueCats as string[]);
    } catch (err) {
      console.error('Fetch Menu Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View>
            <Text className="text-gray-400 text-xs text-center">ORDERING FROM</Text>
            <Text className="text-white font-bold text-base text-center">{cafeteria?.name || 'Canteen'}</Text>
          </View>
          <View className="w-6" /> {/* Spacer */}
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search for food..."
            placeholderTextColor="#6b7280"
            className="flex-1 text-white ml-3 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories Bar (Sticky simulation via separate component) */}
      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveCategory(item)}
              className={`mr-3 px-6 py-2.5 rounded-full border ${activeCategory === item ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
            >
              <Text className={`font-bold ${activeCategory === item ? 'text-white' : 'text-gray-400'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Menu Items List */}
      <FlatList
        ref={listRef}
        data={filteredItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        renderItem={({ item }) => <MenuCard item={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-500 text-lg">No items found matching "{searchQuery}"</Text>
          </View>
        }
      />

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <View className="absolute bottom-10 left-6 right-6">
          <TouchableOpacity 
            activeOpacity={0.9}
            className="bg-primary flex-row items-center justify-between px-6 py-5 rounded-3xl shadow-2xl shadow-primary/40"
          >
            <View className="flex-row items-center">
              <View className="bg-white/20 p-2 rounded-xl mr-4">
                <ShoppingBag size={24} color="white" />
              </View>
              <View>
                <Text className="text-white/80 text-xs font-bold uppercase tracking-wider">{cartCount} ITEMS</Text>
                <Text className="text-white text-xl font-bold">₹{cartTotal}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white text-lg font-bold mr-2">View Cart</Text>
              <ChevronRight size={20} color="white" strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
