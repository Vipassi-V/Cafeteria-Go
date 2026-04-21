import { Redirect } from "expo-router";

export default function Index() {
  // Mocking auth and connection status for Stage 0 UI demonstration
  const isAuthenticated = false; // Always redirected to login for now
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Future logic:
  // if (!hasCanteenLink) return <Redirect href="/scanner" />;
  // return <Redirect href="/menu" />;

  return null;
}
