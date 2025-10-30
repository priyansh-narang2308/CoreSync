import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const WorkoutRecord = () => {
  const { workoutId } = useLocalSearchParams();
  console.log("Workout Id: ", workoutId);

  return (
    <View>
      <Text>WorkoutRecord</Text>
    </View>
  );
};

export default WorkoutRecord;
