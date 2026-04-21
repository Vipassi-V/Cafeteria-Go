import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // If no Supabase session or Demo user, send to Login
  if (!session && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If logged in but user record not found/synced yet (shouldn't happen with syncWithBackend)
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Decided by AuthContext/Backend sync:
  // if (user.role === 'admin') return <Redirect href="/admin" />;
  // if (!user.cafeteriaId) return <Redirect href="/scanner" />;

  return null;
}
