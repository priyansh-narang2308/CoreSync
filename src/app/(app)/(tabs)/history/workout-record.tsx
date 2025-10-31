import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { GetWorkoutRecordQueryResult } from "@/lib/sanity/types";
import { formatDuration } from "lib/utils";
import { Ionicons } from "@expo/vector-icons";

const getWorkoutRecordQuery =
  defineQuery(`*[_type == "workout" && _id == $workoutId][0] {
  _id,
  _type,
  _createdAt,
  date,
  duration,
  exercises[] {
    exercise-> {
      _id,
      name,
      description
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
}`);

const WorkoutRecord = () => {
  const { workoutId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [workout, setWorkout] = useState<GetWorkoutRecordQueryResult | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;

      try {
        const resultt = await client.fetch(getWorkoutRecordQuery, {
          workoutId,
        });
        setWorkout(resultt);
      } catch (error) {
        console.error("Error fetching workout: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]); //call only when there is workout id

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTotalSets = () => {
    return (
      workout?.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  // Took for AI 😂
  const getTotalVolume = () => {
    const result = workout?.exercises?.reduce(
      (acc, exercise) => {
        const exerciseVolume =
          exercise.sets?.reduce((setAcc, set) => {
            if (set.weight && set.reps) {
              return {
                volume: setAcc.volume + set.weight * set.reps,
                unit: set.weightUnit || "lbs",
              };
            }
            return setAcc;
          }, acc) || acc;

        return exerciseVolume;
      },
      { volume: 0, unit: "lbs" }
    ) || { volume: 0, unit: "lbs" };
    return result;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#0000ff"} />
          <Text className="text-gray-500">Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            Workout Not Found
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            This workout record could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteWorkout,
        },
      ]
    );
  };

  const deleteWorkout = async () => {
    if (!workoutId) {
      return;
    }

    setDeleting(true);

    try {
      await fetch("/api/delete-workout", {
        method: "POST",
        body: JSON.stringify({ workoutId }),
      });

      router.replace("/(app)/(tabs)/history?refresh=true");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Error", "Failed to delete workout. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setDeleting(false);
    }
  };

  const { volume, unit } = getTotalVolume();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Workout Summary */}
        <View className="bg-white p-6 border-b border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Workout Summary
            </Text>
            <TouchableOpacity
              onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {deleting ? (
                <ActivityIndicator size={"small"} color={"FFFFFF"} />
              ) : (
                <>
                  <Ionicons
                    name="trash-bin-outline"
                    size={16}
                    color={"white"}
                  />
                  <Text className="text-white font-medium ml-2">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={20} color={"#6B7280"} />

            <Text className="text-gray-700 ml-3 font-medium">
              {formatDate(workout?.date)} at {formatTime(workout?.date)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time-outline" size={20} color={"#6B7280"} />

            <Text className="text-gray-700 ml-3 font-medium">
              {formatWorkoutDuration(workout?.duration)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="fitness-outline" size={20} color={"#6B7280"} />

            <Text className="text-gray-700 ml-3 font-medium">
              {workout?.exercises?.length || 0} exercises
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="bar-chart-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {getTotalSets()} total sets
            </Text>
          </View>

          {volume > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="barbell-outline" size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-3 font-medium">
                {volume.toLocaleString()} {unit} total volume
              </Text>
            </View>
          )}
        </View>

        {/* Exericse list */}
        <View className="space-y-4 p-6 gap-6">
          {workout?.exercises?.map((exerciseDataa, index) => (
            <View
              key={exerciseDataa?._key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {exerciseDataa.exercise?.name || "Unknown Exercise"}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {exerciseDataa.sets?.length || 0} sets completed
                  </Text>
                </View>
                <View className="bg-blue-100 rounded-full w-10 h-10 items-center justify-center">
                  <Text className="text-blue-600 font-bold">{index + 1}</Text>
                </View>
              </View>
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Sets:
                </Text>
                {exerciseDataa.sets?.map((set, setIndex) => (
                  <View
                    key={set._key}
                    className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
                        <Text className="text-gray-700 text-xs font-medium">
                          {setIndex + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-medium">
                        {set.reps} reps
                      </Text>
                    </View>
                    {set.weight && (
                      <View className="flex-row items-center">
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color={"6B7280"}
                        />
                        <Text className="text-gray-700 font-medium ml-2">
                          {set.weight} {set.weightUnit || "lbs"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* Calculate the overall weoght */}
                {exerciseDataa.sets && exerciseDataa.sets.length > 0 && (
                  <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-gray-600">
                        Exercise Volume:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {exerciseDataa.sets
                          .reduce((total, set) => {
                            return total + (set.weight || 0) * (set.reps || 0);
                          }, 0)
                          .toLocaleString()}{" "}
                        {exerciseDataa.sets[0]?.weightUnit || "lbs"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutRecord;
