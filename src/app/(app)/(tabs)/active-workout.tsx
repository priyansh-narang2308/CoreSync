import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";

const ActiveWorkout = () => {
  const [weightUnit, setWeightUnit] = useState("");

  const { seconds, minutes, hours, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor={"#1F2937"} />
      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? 55 : StatusBar.currentHeight || 0,
        }}
      >
        <View className="bg-gray-800 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-semibold">
                Active Workout
              </Text>
              <Text className="text-gray-300">{getWorkoutDuration()}</Text>
            </View>
            <View className="flex-row items-center space-x-3 gap-2">
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded ${weightUnit}==="lbs"?"bg-blue-600:""`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "lbs" ? "text-white" : "text-gray-300"
                    } `}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActiveWorkout;
