import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: "kgs" | "lbs";
  isCompleted: boolean;
}

interface WorkoutExercise {
  id: string;
  sanityId: string; //this to store the id of sanity
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  // state variables
  workoutExercises: WorkoutExercise[];
  weightUnit: "kgs" | "lbs";

  // Actionss
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void;
  startRoutine: (exercises: { name: string; sanityId: string }[]) => void;
  setWorkoutExercises: (
    exercises:
      | WorkoutExercise[]
      | ((prev: WorkoutExercise[]) => WorkoutExercise[])
  ) => void;
  setWeightUnit: (unit: "kgs" | "lbs") => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutExercises: [],
      weightUnit: "lbs",

      addExerciseToWorkout: (exercise) =>
        set((state) => {
          const newExercise: WorkoutExercise = {
            id: Math.random().toString(),
            sanityId: exercise.sanityId,
            name: exercise.name,
            sets: [], //initially empty
          };
          return {
            workoutExercises: [...state.workoutExercises, newExercise],
          };
        }),

      startRoutine: (exercises) =>
        set(() => ({
          workoutExercises: exercises.map((ex) => ({
            id: Math.random().toString(),
            sanityId: ex.sanityId,
            name: ex.name,
            sets: [],
          })),
        })),

      setWorkoutExercises: (exercises) =>
        set((state) => ({
          workoutExercises:
            typeof exercises === "function"
              ? exercises(state.workoutExercises)
              : exercises,
        })),

      setWeightUnit: (unit) =>
        set({
          weightUnit: unit,
        }),

      resetWorkout: () =>
        set({
          workoutExercises: [],
        }),
    }),
    {
      name: "workout-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        workoutExercises: state.workoutExercises,
        weightUnit: state.weightUnit,
      }),
    }
  )
);
