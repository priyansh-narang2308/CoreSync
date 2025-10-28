import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Markdown from "react-native-markdown-display";

// Fetch for only that particular ID
const singleExerciseQuery = defineQuery(`*[_type=="exercise" && _id ==$id][0]`);

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-yellow-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "Unknown";
  }
};

const ExerciseDetailPage = () => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  // By this way it doesnt go to stack navigator
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchingExericse = async () => {
      if (!id) {
        return;
      }

      try {
        const exerciseDaata = await client.fetch(singleExerciseQuery, { id });
        setExercise(exerciseDaata);
      } catch (error) {
        console.error("Error fetching exercise: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchingExericse();
  }, [id]);

  const getAIGuidance = async () => {
    if (!exercise) return;

    try {
      setAiLoading(true);
      const resp = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseName: exercise?.name }),
      });

      if (!resp.ok) {
        throw new Error("Failed to fetch AI Guidance");
      }

      const data = await resp.json();
      setAiGuidance(data.message);
    } catch (error) {
      console.error("Error fetching AI guidance: ", error);
      setAiGuidance(
        "Sorry, There was an error getting AI Guidace! Please try again later."
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#0000ff"} />
          <Text className="text-gray-500">Loading exercise...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Exercise not found: {id}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-indigo-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor={"#000"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="absolute top-12 left-0 right-0 z-10 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
          >
            <Ionicons name="close" size={24} color={"white"} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise?.image?.asset?._ref).url() }}
              style={{ width: "100%", height: 160, marginTop: 15 }}
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="fitness" size={80} color={"white"} />
            </View>
          )}

          <View className="absolute bottom-0 left-0 right-0 h-20 "></View>

          <View className="px-6 py-6">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-3xl font-bold text-gray-800 mb-2">
                  {exercise?.name}
                </Text>
                <View
                  className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
                    exercise?.difficulty
                  )}`}
                >
                  <Text className="text-sm font-semibold text-white">
                    {getDifficultyText(exercise?.difficulty)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </Text>
              <Text className="text-gray-600 leading-6 text-base">
                {exercise?.description ||
                  "No description available for this exercise."}
              </Text>
            </View>

            {exercise?.videoUrl && (
              <View className="mb-6">
                <Text className="text-xl font-semibold text-gray-800 mb-3">
                  Video Tutorial
                </Text>
                <TouchableOpacity
                  className="bg-red-600 rounded-xl p-4 flex-row items-center"
                  onPress={() => Linking.openURL(exercise?.videoUrl)}
                >
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                    <Ionicons name="play" size={20} color={"#EF4444"} />
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-lg">
                      Watch Tutorial
                    </Text>
                    <Text className="text-red-100 text-sm">
                      Learn proper form
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {(aiGuidance || aiLoading) && (
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="fitness" size={24} color="#3B82F6" />
                  <Text className="text-xl font-semibold text-gray-800 ml-2">
                    AI Coach says...
                  </Text>
                </View>

                {aiLoading ? (
                  <View className="bg-gray-50 rounded-xl p-4 items-center">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className="text-gray-600 mt-2">
                      Getting personalized guidance...
                    </Text>
                  </View>
                ) : (
                  <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <Markdown
                      style={{
                        body: {
                          paddingBottom: 20,
                        },
                        heading2: {
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#1f2937",
                          marginTop: 12,
                          marginBottom: 6,
                        },
                        heading3: {
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#374151",
                          marginTop: 8,
                          marginBottom: 4,
                        },
                      }}
                    >
                      {aiGuidance}
                    </Markdown>
                  </View>
                )}
              </View>
            )}

            <View className="mt-8 gap-2">
              <TouchableOpacity
                className={`rounded-xl py-4 items-center ${
                  aiLoading
                    ? "bg-gray-400"
                    : aiGuidance
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                onPress={getAIGuidance}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size={"small"} color="white">
                      <Text className="text-white font-bold text-lg ml-2">
                        Loading...
                      </Text>
                    </ActivityIndicator>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center space-x-4 gap-2">
                    <Ionicons name="sparkles" size={22} color="gold" />
                    <Text className="text-white font-bold text-lg">
                      {aiGuidance
                        ? "Refresh AI Coach Insights"
                        : "Ask the AI Coach for Help"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-gray-200 rounded-xl py-4 items-center"
              >
                <Text className="text-gray-800 font-bold text-lg">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseDetailPage;
