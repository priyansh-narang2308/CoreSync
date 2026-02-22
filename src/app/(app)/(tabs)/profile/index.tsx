import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { defineQuery } from "groq";
import { formatDuration } from "lib/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getWorkoutsQuery } from "../history";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user, isLoaded: isAuthLoaded } = useUser();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);

  const fetchWorkouts = async () => {
    if (!isAuthLoaded) return;

    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const resultss = await client.fetch(getWorkoutsQuery, {
        userId: user.id,
      });
      setWorkouts(resultss);
    } catch (error) {
      console.error("Error fetching workouts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id, isAuthLoaded]);

  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0
  );
  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/sign-in");
          } catch (e) {
            console.error("Logout error:", e);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        }
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handlehelpSupport = () => {
    router.push("/handle-support");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-gradient-to-b from-indigo-600 to-purple-700 px-6 pb-8 pt-12 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold text-black">Profile</Text>
              <Text className="text-gray-900 mt-1">
                Manage your account and stats
              </Text>
            </View>
            <TouchableOpacity className="bg-white/20 p-3 rounded-2xl">
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: user?.externalAccounts?.[0]?.imageUrl ?? user?.imageUrl,
                }}
                className="w-20 h-20 rounded-2xl border-4 border-indigo-100"
              />
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || "User"}
                </Text>
                <Text className="text-gray-600 text-base mt-1">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </Text>
                <Text className="text-indigo-600 text-sm font-medium mt-2">
                  Member since {formatJoinDate(joinDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 -mt-4">
          <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <View className="flex-row justify-between mb-2">
              <View className="items-center flex-1">
                <View className="bg-indigo-100 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="barbell-outline" size={24} color="#4F46E5" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {totalWorkouts}
                </Text>
                <Text className="text-gray-500 text-xs font-medium">
                  Workouts
                </Text>
              </View>

              <View className="items-center flex-1">
                <View className="bg-green-100 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="time-outline" size={24} color="#059669" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-gray-500 text-xs font-medium">
                  Total Time
                </Text>
              </View>

              <View className="items-center flex-1">
                <View className="bg-purple-100 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="calendar-outline" size={24} color="#7C3AED" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {daysSinceJoining}
                </Text>
                <Text className="text-gray-500 text-xs font-medium">Days</Text>
              </View>
            </View>

            {totalWorkouts > 0 && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 font-medium">
                    Average Duration
                  </Text>
                  <Text className="font-bold text-gray-900 text-lg">
                    {formatDuration(averageDuration)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="px-6 mt-6 mb-8">
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <TouchableOpacity
              onPress={handleEditProfile}
              className="flex-row items-center justify-between p-5"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="person-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-900 font-semibold">
                  Edit Profile
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlehelpSupport}
              className="flex-row items-center justify-between p-5 border-t border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-yellow-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#F59E0B"
                  />
                </View>
                <Text className="text-gray-900 font-semibold">
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 rounded-2xl p-5 shadow-lg"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
