import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { formatDuration } from "lib/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const getWorkoutsQuery = defineQuery(`
  *[_type == "workout" && userId == $userId] | order(date desc){
    _id,
    date,
    duration,
    exercises[] {
      exercise-> {
        _id,
        name
      },
      sets[] {
        reps,
        weight,
        weightUnit,
        _type,
        _key
      },
      _type,
      _key
    }
  }
`);

export default function Page() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

  const fetchWorksouts = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const results = await client.fetch(getWorkoutsQuery, { userId: user.id });
      setWorkouts(results);
    } catch (error) {
      console.error("❌ Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorksouts();
  }, [user?.id]);

  useEffect(() => {
    if (refresh === "true") {
      fetchWorksouts();
      router.replace("/(app)/(tabs)/history");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorksouts();
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

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds);
  };

  const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
    return (
      workout.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
    return (
      workout.exercises
        ?.map((exercisee) => exercisee.exercise?.name)
        .filter(Boolean) || []
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Workout History
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#3B82F6"} />
          <Text className="text-gray-600 mt-2">Loading your workouts...</Text>
          <Text className="text-gray-400 text-sm mt-1">
            This might take a few seconds
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Workout History
        </Text>
        <Text className="text-gray-600 mt-1">
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} completed
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No workouts yet
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Your completed workouts will appear here
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {workouts.map((workout, index) => {
              return (
                <TouchableOpacity
                  key={workout._id}
                  activeOpacity={0.7}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3"
                  onPress={() => {
                    router.push({
                      pathname: "/history/workout-record",
                      params: { workoutId: workout._id },
                    });
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {formatDate(workout.date || "")}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2">
                          {formatWorkoutDuration(workout.duration)}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                      <Ionicons
                        name="fitness-outline"
                        size={24}
                        color="#3B82F6"
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-sm font-medium text-gray-700">
                        {workout.exercises?.length || 0} exercises
                      </Text>
                    </View>
                    <View className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-700">
                        {getTotalSets(workout)} sets
                      </Text>
                    </View>
                  </View>
                  {workout.exercises && workout.exercises.length > 0 && (
                    <View className="mt-5">
                      <Text className="text-base font-semibold text-gray-800 mb-3">
                        Exercises
                      </Text>

                      <View className="flex-row flex-wrap">
                        {getExerciseNames(workout)
                          .slice(0, 3)
                          .map((name, index) => (
                            <View
                              key={index}
                              className="bg-blue-100 border border-blue-200 rounded-xl px-4 py-1.5 mr-2 mb-2 shadow-sm"
                            >
                              <Text className="text-blue-800 text-sm font-semibold">
                                {name}
                              </Text>
                            </View>
                          ))}

                        {getExerciseNames(workout).length > 3 && (
                          <View className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-1.5 mr-2 mb-2 shadow-sm">
                            <Text className="text-gray-600 text-sm font-medium">
                              +{getExerciseNames(workout).length - 3} more
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
