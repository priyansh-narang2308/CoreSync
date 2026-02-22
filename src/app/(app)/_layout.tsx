import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const AppLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const inApiGroup = segments[0] === "api";
    // We don't want to redirect if we are hitting an API route
    if (inApiGroup) return;

    if (isSignedIn && (segments[0] === "sign-in" || segments[0] === "sign-up")) {
      // Redirect to home if signed in but on auth screens
      router.replace("/(tabs)");
    } else if (!isSignedIn && segments[0] !== "sign-in" && segments[0] !== "sign-up") {
      // Redirect to sign-in if not signed in and not on auth screens
      router.replace("/sign-in");
    }
  }, [isSignedIn, isLoaded, segments]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen
        name="exercise-detail"
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
});

export default AppLayout;
