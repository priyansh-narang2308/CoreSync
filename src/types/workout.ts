export interface WorkoutData {
  _type: string;
  userId: string;
  date: string;
  duration: number;
  exercises: {
    _type: string;
    _key: string;
    exercise: {
      _type: string;
      _ref: string;
    };
    sets: {
      _type: string;
      _key: string;
      reps: number;
      weight: number;
      weightUnit: "lbs" | "kgs";
    }[];
  }[];
}
