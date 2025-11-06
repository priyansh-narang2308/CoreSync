import React from "react";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "react-native";
import { useWorkoutStore } from "@/store/workout-store";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  const { user } = useUser();
  const { workoutExercises } = useWorkoutStore();

  const hasActiveWorkout = workoutExercises.length > 0;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="exercises"
        options={{
          headerShown: false,
          title: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          headerShown: false,
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" color={color} size={size} />
          ),
          href: hasActiveWorkout ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="active-workout"
        options={{
          headerShown: false,
          title: "Active Workout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" color={color} size={size} />
          ),
          href: hasActiveWorkout ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="clockcircleo" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: () =>
            user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 50,
                }}
              />
            ) : (
              <AntDesign name="user" size={24} color="gray" />
            ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
