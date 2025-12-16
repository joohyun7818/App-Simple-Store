import React from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OptimizelyProvider } from "@optimizely/react-sdk";

import { UIConfigProvider } from "./src/context/UIConfigContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { StoreProvider } from "./src/context/StoreContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { OrdersScreen } from "./src/screens/OrdersScreen";
import { optimizelyClient } from "./src/optimizely/optimizelyClient";
import { toOptimizelyUser } from "./src/optimizely/optimizelyUser";

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>준비 중…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer key={isAuthenticated ? "auth" : "guest"}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home">
              {({ navigation }) => (
                <HomeScreen
                  onGoCart={() => navigation.navigate("Cart")}
                  onGoOrders={() => navigation.navigate("Orders")}
                  onGoLogin={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Cart">
              {({ navigation }) => (
                <CartScreen
                  onGoHome={() => navigation.navigate("Home")}
                  onGoOrders={() => navigation.navigate("Orders")}
                  onGoLogin={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Orders">
              {({ navigation }) => (
                <OrdersScreen
                  onGoHome={() => navigation.navigate("Home")}
                  onGoCart={() => navigation.navigate("Cart")}
                  onGoLogin={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen onDone={() => navigation.navigate("Home")} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login">{() => <LoginScreen />}</Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function OptimizelyApp() {
  const { user } = useAuth();
  const optimizelyUser = React.useMemo(() => toOptimizelyUser(user), [user]);

  return (
    <OptimizelyProvider optimizely={optimizelyClient} user={optimizelyUser}>
      <StoreProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </StoreProvider>
    </OptimizelyProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UIConfigProvider>
        <AuthProvider>
          <OptimizelyApp />
        </AuthProvider>
      </UIConfigProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontWeight: "800",
  },
});
