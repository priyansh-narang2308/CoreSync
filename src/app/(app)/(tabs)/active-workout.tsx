import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore, WorkoutSet } from "@/store/workout-store";
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
  const [isSaving, setIsSaving] = useState(false);
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

  const addNewSet = (exericseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: "",
      weight: "",
      weightUnit: weightUnit,
      isCompleted: false,
    };

    setWorkoutExercises((exercises) =>
      exercises.map((exericse) =>
        // if we alreayd have the exercise store it in the storage
        exericse.id === exericseId
          ? { ...exericse, sets: [...exericse.sets, newSet] }
          : exericse
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string
  ) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      )
    );
  };

  // CANT MODIFY THE REPS AND WEIGHTS AFTER TICKING IT AS ITS STORED
  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  // delete it from the data
  const deleteExercise = (exerciseId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const cancelWorkout = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure your want to cancel the workout?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Cancel Workout",
          onPress: () => {
            resetWorkout(), router.back();
          },
        },
      ]
    );
  };

  const endWorkout = async () => {
    const saved = await saveWorkoutToDB();

    if (saved) {
      Alert.alert("Workout Saved", "Your workout has been saved successfully!");
      // reset it to the starting
      resetWorkout();

      router.replace("/(app)/(tabs)/history?refresh=true");
    }
  };

  const saveWorkoutToDB = async () => {
    if (isSaving) {
      return false;
    }

    setIsSaving(true);

    try {
    } catch (error) {
      console.error("Error saving workout: ", error);
      Alert.alert("Save Failed", "Failed to save workout. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveWorkout = () => {
    Alert.alert(
      "Complete Workout",
      "Are you sure you want to complete the workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => await endWorkout(),
        },
      ]
    );
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
                    weightUnit === "lbs" ? "bg-indigo-600" : "bg-transparent"
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
                    weightUnit === "kg" ? "bg-indigo-600" : "bg-transparent"
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
                onPress={cancelWorkout}
                className="bg-red-600 px-5 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Cancel Workout</Text>
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
            {workoutExercises.map((exercise) => (
              <View key={exercise.id} className="mb-8">
                {/* TODO:   here is exercise header */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/exercise-detail",
                      params: {
                        id: exercise.sanityId,
                      },
                    })
                  }
                  className="bg-indigo-50 rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-2">
                        {exercise.name}
                      </Text>
                      <Text className="text-gray-600">
                        {exercise.sets.length} sets •{" "}
                        {exercise.sets.filter((set) => set.isCompleted).length}{" "}
                        completed
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => deleteExercise(exercise.id)}
                      className="w-10 h-10 rounded-xl items-center justify-center bg-red-500 ml-3"
                    >
                      <Ionicons name="trash" size={16} color={"white"} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Sets
                  </Text>
                  {exercise.sets.length === 0 ? (
                    <Text className="text-gray-500 text-center py-4">
                      No sets yet. Add your first set below.
                    </Text>
                  ) : (
                    exercise.sets.map((set, setIndex) => (
                      <View
                        key={set.id}
                        className={`py-3 px-3 mb-2 rounded-lg border ${
                          set.isCompleted
                            ? "bg-green-100 border-green-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {/* sets,reps,delete and weight, complete it  */}
                        <View className="flex-row items-center justify-between">
                          <Text className="text-gray-700 font-medium w-8">
                            {setIndex + 1}
                          </Text>

                          {/* /reps/ */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              Reps
                            </Text>
                            <TextInput
                              value={set.reps}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "reps", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? "bg-gray-100 border-gray-300 text-gray-500"
                                  : "bg-white border-gray-300"
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>

                          {/* Weight */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              Weight ({weightUnit})
                            </Text>
                            <TextInput
                              value={set.weight}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "weight", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? "bg-gray-100 border-gray-300 text-gray-500"
                                  : "bg-white border-gray-300"
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>

                          <TouchableOpacity
                            onPress={() =>
                              toggleSetCompletion(exercise.id, set.id)
                            }
                            className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${
                              set.isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            <Ionicons
                              name={
                                set.isCompleted
                                  ? "checkmark"
                                  : "checkmark-outline"
                              }
                              size={20}
                              color={set.isCompleted ? "white" : "#9CA3AF"}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="w-12 h-12 rounded-xl items-center justify-center bg-red-500 ml-1"
                            onPress={() => deleteSet(exercise.id, set.id)}
                          >
                            <Ionicons name="trash" size={16} color={"white"} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}

                  <TouchableOpacity
                    onPress={() => addNewSet(exercise.id)}
                    className="bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-lg py-3 items-center mt-2"
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add"
                        size={16}
                        color={"#3B82F6"}
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-indigo-600 font-medium">
                        Add Set
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* add exercise  */}
            <TouchableOpacity
              onPress={addExercise}
              className="bg-indigo-600 rounded-2xl py-4 items-center mb-8 active:bg-indigo-700"
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

            {/* /Complete button/ */}

            <TouchableOpacity
              onPress={saveWorkout}
              className={`rounded-2xl py-4 items-center mb-8 ${
                // Everything shoyld be completed before saving
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some((exercise) =>
                  exercise.sets.some((set) => !set.isCompleted)
                )
                  ? "bg-gray-400"
                  : "bg-green-600 active:bg-gray-700"
              }`}
              disabled={
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some((exercise) =>
                  exercise.sets.some((set) => !set.isCompleted)
                )
              }
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size={"small"} color={"white"} />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Saving...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Complete Workout
                </Text>
              )}
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
