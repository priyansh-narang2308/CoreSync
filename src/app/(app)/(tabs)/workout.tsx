import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { defineQuery } from "groq";
import { useWorkoutStore } from "@/store/workout-store";

export const getRoutinesQuery = defineQuery(`
  *[_type == "routine" && userId == $userId] | order(_createdAt desc) {
    _id,
    name,
    description,
    exercises[]-> {
      _id,
      name
    }
  }
`);

const Workout = () => {
  const router = useRouter();
  const { user, isLoaded: isAuthLoaded } = useUser();
  const { startRoutine, workoutExercises } = useWorkoutStore();

  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoutines = async () => {
    if (!isAuthLoaded) return;
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const results = await client.fetch(getRoutinesQuery, { userId: user.id });
      setRoutines(results);
    } catch (error) {
      console.error("Error fetching routines:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [user?.id, isAuthLoaded]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutines();
  };

  const startWorkout = () => {
    if (workoutExercises.length > 0) {
      router.push("/active-workout");
    } else {
      router.push("/active-workout");
    }
  };

  const handleStartRoutine = (routine: any) => {
    const exercisesForStore = routine.exercises.map((ex: any) => ({
      name: ex.name,
      sanityId: ex._id,
    }));
    startRoutine(exercisesForStore);
    router.push("/active-workout");
  };

  const handleDeleteRoutine = (routineId: string, routineName: string) => {
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${routineName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const resp = await fetch(`/api/delete-routine?id=${routineId}`, {
                method: "DELETE",
              });

              if (resp.ok) {
                // Optimistic UI update or just refetch
                setRoutines(prev => prev.filter(r => r._id !== routineId));
              } else {
                const err = await resp.json();
                Alert.alert("Error", err.error || "Failed to delete routine.");
              }
            } catch (error) {
              console.error("Error deleting routine:", error);
              Alert.alert("Error", "Failed to connect to server.");
            }
          }
        },
      ]
    );
  };

  const fitnessTips = [
    {
      icon: "walk-outline",
      title: "Start with a Warmup",
      text: "5-10 minutes of light cardio prevents injury and primes your muscles.",
      color: "#FCD34D",
      bgColor: "bg-amber-100",
    },
    {
      icon: "water-outline",
      title: "Stay Hydrated",
      text: "Drink water before, during, and after your workout to maintain energy.",
      color: "#3B82F6",
      bgColor: "bg-blue-100",
    },
    {
      icon: "bed-outline",
      title: "Prioritize Recovery",
      text: "Aim for 7-9 hours of sleep; it's when your muscles actually repair and grow.",
      color: "#10B981",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Ready to Train?
          </Text>
          <Text className="text-lg text-gray-600">
            Start a session or choose a routine
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Quick Start
            </Text>
          </View>

          <TouchableOpacity
            onPress={startWorkout}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="play" size={24} color="#4F46E5" />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    {workoutExercises.length > 0 ? "Resume Workout" : "Empty Workout"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {workoutExercises.length > 0 ? `${workoutExercises.length} exercises in progress` : "Start a fresh session"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Your Routines
            </Text>
          </View>

          {loading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : routines.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center border border-dashed border-gray-300">
              <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-900 font-semibold mt-4">No routines found</Text>
              <Text className="text-gray-500 text-center mt-2 text-sm">
                Create routines after finishing a workout
              </Text>
            </View>
          ) : (
            routines.map((routine) => (
              <TouchableOpacity
                key={routine._id}
                onPress={() => handleStartRoutine(routine)}
                className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{routine.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="bg-blue-50 px-3 py-1 rounded-full mr-2">
                      <Text className="text-blue-600 font-medium text-xs">
                        {routine.exercises?.length || 0} exercises
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(routine._id, routine.name);
                      }}
                      className="p-1"
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-gray-500 text-sm mb-4" numberOfLines={2}>
                  {routine.description || "No description provided."}
                </Text>

                <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
                  <View className="flex-row items-center">
                    <Ionicons name="flash-outline" size={16} color="#4F46E5" />
                    <Text className="text-indigo-600 font-semibold ml-1 text-sm">Start Routine</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default Workout;
