import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: "kg" | "lbs";
  isCompleted: boolean;
}

interface WorkoutExercise {
  id: string;
  sanityId: string; //this to store the id of sanity
  name: string;
  sets: WorkoutSet[];
}

 