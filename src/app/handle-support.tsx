import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HelpSupport = () => {
  const router = useRouter();

  const contactSupport = () => {
    Linking.openURL("mailto:support@fitnessapp.com?subject=Help & Support");
  };

  const openFAQ = () => {
    console.log("Open FAQ");
  };

  const reportProblem = () => {
    Linking.openURL("mailto:bugs@fitnessapp.com?subject=Bug Report");
  };

  const contactEmail = "coresync@support.com";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="p-2 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Help & Support
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                We're here to help you
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Get Help
            </Text>

            <TouchableOpacity
              onPress={contactSupport}
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#3B82F6"
                  />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">
                    Contact Support
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Get help from our team
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openFAQ}
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#10B981"
                  />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">FAQ</Text>
                  <Text className="text-gray-500 text-sm">
                    Frequently asked questions
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={reportProblem}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="bug-outline" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">
                    Report a Problem
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Found a bug? Let us know
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <View className="flex-row items-start mb-2">
              <Ionicons name="mail" size={20} color="#3B82F6" />
              <View className="ml-3 flex-1">
                <Text className="text-blue-800 font-semibold">
                  Email Support
                </Text>
                <Text className="text-blue-700 text-sm mt-1">
                  {contactEmail}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6 mb-8 items-center">
            <Text className="text-gray-400 text-sm">CoreSync v1.0.0</Text>
            <Text className="text-gray-400 text-sm mt-1">
              © {new Date().getFullYear()} CoreSync. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupport;
