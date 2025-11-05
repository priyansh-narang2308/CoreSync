import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore } from "@/store/workout-store";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ExericseSelectionModal from "@/app/components/exercise-selection-modal";

const ActiveWorkout = () => {
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();

  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const router = useRouter();

  const { seconds, minutes, reset } = useStopwatch({
    autoStart: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (workoutExercises.length === 0) {
        reset();
      }
    }, [workoutExercises.length, reset])
  );

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const addExercise = () => {
    setShowExerciseSelection(true);
  };

  const endWorkout = () => {
    Alert.alert("End Workout", "Are you sure your want to end the workout?", [
      { text: "No", style: "cancel" },
      {
        text: "End Workout",
        onPress: () => {
          resetWorkout(), router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      <StatusBar barStyle="light-content" backgroundColor={"#1F2937"} />

      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? 55 : StatusBar.currentHeight || 0,
        }}
      >
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-semibold">
                Active Workout
              </Text>
              <Text className="text-gray-300 text-lg">
                {getWorkoutDuration()}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-4 py-2 rounded ${
                    weightUnit === "lbs" ? "bg-blue-600" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "lbs" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setWeightUnit("kg")}
                  className={`px-4 py-2 rounded ${
                    weightUnit === "kg" ? "bg-blue-600" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "kg" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={endWorkout}
                className="bg-red-600 px-5 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">End Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white">
        <View className="px-6 mt-4">
          <Text className="text-center text-gray-600 mb-2">
            {workoutExercises.length} exercises
          </Text>
        </View>

        {/* If no exercises*/}
        {workoutExercises.length === 0 && (
          <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
            <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg text-center mt-4 font-medium">
              No exercises yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Get started by adding your first exercise below
            </Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 mt-4">
            {workoutExercises.map((exer) => (
              <View key={exer.id} className="mb-8">
                {/* TODO:   here is exer header */}
              </View>
            ))}
            {/* add exercise  */}
            <TouchableOpacity
              onPress={addExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center mb-8 active:bg-blue-700"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="add"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-semibold text-lg">
                  Add Exercise
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <ExericseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
      />
    </SafeAreaView>
  );
};

export default ActiveWorkout;
