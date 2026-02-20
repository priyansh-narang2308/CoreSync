import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";

const AppLayout = () => {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={"black"} />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="exercise-detail"
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: true,
          animationTypeForReplace: "push",
        }}
      />
    </Stack>
  );
};

export default AppLayout;
