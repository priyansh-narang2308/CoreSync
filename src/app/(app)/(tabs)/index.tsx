import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { client } from "@/lib/sanity/client";
import { getWorkoutsQuery } from "./profile";
import { Ionicons } from "@expo/vector-icons";
import { formatDuration } from "lib/utils";

const Index = () => {
  const { user } = useUser();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const resultss = await client.fetch(getWorkoutsQuery, {
        userId: user.id,
      });
      setWorkouts(resultss);
    } catch (error) {
      console.error("Error fetching workouts: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const totalWorkouts = workouts.length;
  const lastWorkout = workouts[0];
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout?.duration || 0),
    0
  );

  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
    return (
      workout.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  const getTotalExercises = (workout: GetWorkoutsQueryResult[number]) => {
    return workout.exercises?.length || 0;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#3B82F6"} />
          <Text className="text-gray-600 mt-4">Loading your stats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-gradient-to-b from-indigo-600 to-purple-700 px-6 pb-8 pt-12 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-gray-600 text-lg font-semibold">
                Welcome back,
              </Text>
              <Text className="text-3xl font-bold text-gray-800 mt-1">
                {user?.firstName || "Athlete"}!
              </Text>
            </View>
            <TouchableOpacity
              className="bg-black p-3 rounded-2xl"
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
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
                  Total Workouts
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
                  <Ionicons
                    name="trending-up-outline"
                    size={24}
                    color="#7C3AED"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {formatDuration(averageDuration)}
                </Text>
                <Text className="text-gray-500 text-xs font-medium">
                  Average
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>

          <TouchableOpacity
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4"
            onPress={() => router.push("/workout")}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-4">
                <Ionicons name="play-circle" size={28} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  Start Workout
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Begin your training session
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 mr-2"
              onPress={() => router.push("/history")}
            >
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="time" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-900 font-semibold text-center">
                  Workout History
                </Text>
                <Text className="text-gray-500 text-xs text-center mt-1">
                  View past sessions
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 ml-2"
              onPress={() => router.push("/exercises")}
            >
              <View className="items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="barbell" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-semibold text-center">
                  Browse Exercises
                </Text>
                <Text className="text-gray-500 text-xs text-center mt-1">
                  Explore exercises
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {lastWorkout && (
          <View className="px-6 mt-6 mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Last Workout
            </Text>
            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              onPress={() => {
                router.push({
                  pathname: "/history/workout-record",
                  params: { workoutId: lastWorkout._id },
                });
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-900">
                  {lastWorkout.date
                    ? formatDate(lastWorkout.date)
                    : "Recent Workout"}
                </Text>
                <Text className="text-indigo-600 font-medium text-lg">
                  {formatDuration(lastWorkout.duration || 0)}
                </Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Ionicons name="barbell-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {getTotalExercises(lastWorkout)} exercises ·{" "}
                  {getTotalSets(lastWorkout)} sets
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 text-sm">
                  Tap to view workout details
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {totalWorkouts === 0 && (
          <View className="px-6 mt-4">
            <View className="bg-white rounded-2xl p-5 items-center shadow-sm border border-gray-100">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="barbell-outline" size={24} color="#3B48F6" />
              </View>

              <Text className="text-lg font-semibold text-gray-900 text-center mb-1">
                Start Your Fitness Journey
              </Text>

              <Text className="text-gray-600 text-sm text-center mb-3">
                Log your first workout to begin tracking your progress.
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/workout")}
                className="bg-indigo-600 rounded-xl px-4 py-2"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-sm">
                  Start Workout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
