import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GoogleButton from "../components/google-sign-in-button";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          <View className="items-center mt-12 mb-10">
            <View className="w-20 h-20 rounded-3xl bg-neutral-900 items-center justify-center shadow-lg shadow-gray-400/40 border border-gray-700">
              <Ionicons name="fitness" size={35} color="white" />
            </View>

            <Text className="text-3xl font-bold text-gray-900 mt-5">
              CoreSync
            </Text>
            <Text className="text-base text-gray-500 mt-1 text-center">
              Track. Improve. Transform.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Welcome Back
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setEmailAddress}
                  className="flex-1 ml-3 text-gray-900"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onChangeText={setPassword}
                  className="flex-1 ml-3 text-gray-900"
                  editable={!isLoading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={isLoading}
              activeOpacity={0.85}
              className={`w-full rounded-xl py-4 mb-4 ${
                isLoading ? "bg-gray-400" : "bg-indigo-600"
              } shadow-md`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name={isLoading ? "refresh" : "log-in-outline"}
                  size={20}
                  color="white"
                />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-400 text-sm">
                or continue with
              </Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <GoogleButton />
          </View>
          <View className="pb-12 pt-6 items-center">
            <View className="flex-row items-center mb-9">
              <Text className="text-gray-600  text-lg">
                Don't have an account?{" "}
              </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-indigo-600 font-semibold text-lg">
                    Create one
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Text className="text-center text-gray-800 text-lg font-semibold tracking-wide leading-snug mt-2">
              Time to move, track, and transform.{" "}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
