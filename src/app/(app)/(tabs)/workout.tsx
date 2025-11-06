import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native";

const Workout = () => {
  const router = useRouter();

  const startWorkout = () => {
    router.push("/active-workout");
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
      <View className="flex-1 px-6 ">
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Ready to Train?
          </Text>
          <Text className="text-lg text-gray-600">
            Start your workout session
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Today's Fitness Tips
          </Text>
          {fitnessTips.map((tip, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100"
            >
              <View
                className={`w-10 h-10 ${tip.bgColor} rounded-full items-center justify-center mr-3`}
              >
                <Ionicons name={tip.icon as any} size={20} color={tip.color} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{tip.title}</Text>
                <Text className="text-sm text-gray-500">{tip.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mx-6 mb-8">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="fitness" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-xl font-semibold text-gray-900">
                Start Workout
              </Text>
              <Text className="text-gray-500">Begin your training session</Text>
            </View>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-medium text-sm">Ready</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={startWorkout}
          className="bg-indigo-600 rounded-2xl py-4 items-center active:bg-indigo-700"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="play"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Start Workout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Workout;
