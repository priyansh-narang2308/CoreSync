import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { user } = useUser();

  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.push("/profile")} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
          <View className="w-10" />
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">First Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 text-gray-900"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 text-gray-900"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-indigo-600 rounded-xl p-4 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
          <Text className="text-gray-700 font-medium mb-2">Email</Text>
          <Text className="text-gray-500 p-4 bg-gray-50 rounded-xl">
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
          <Text className="text-gray-400 text-sm mt-2">
            Contact support to change your email address
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
