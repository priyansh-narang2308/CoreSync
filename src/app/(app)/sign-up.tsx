import { useSignUp } from "@clerk/clerk-expo";
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

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center px-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full">
          <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Verify your email
          </Text>
          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-gray-900 text-lg mb-6"
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={onVerifyPress}
            className="bg-indigo-600 py-4 rounded-xl items-center shadow-md"
          >
            <Text className="text-white font-semibold text-lg">Verify</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              Join CoreSync
            </Text>
            <Text className="text-base text-gray-500 mt-1 text-center">
              Track. Improve. Transform.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Account
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
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onChangeText={setPassword}
                  className="flex-1 ml-3 text-gray-900"
                  editable={!isLoading}
                />
              </View>
              <Text className="text-gray-500 ml-1 mt-1 text-sm">
                Password must be at least 8 characters long
              </Text>
            </View>

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={isLoading}
              activeOpacity={0.85}
              className={`w-full rounded-xl py-4 mb-4 ${
                isLoading ? "bg-gray-400" : "bg-indigo-600"
              } shadow-md`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name={isLoading ? "refresh" : "person-add-outline"}
                  size={20}
                  color="white"
                />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading ? "Creating..." : "Create Account"}
                </Text>
              </View>
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 mt-2">
              Signing up means you agree to our Terms and Privacy Policy.
            </Text>

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
            <View className="flex-row items-center mb-4">
              <Text className="text-gray-600 text-lg">
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-indigo-600 font-semibold text-lg">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Text className="text-center text-gray-800 text-lg font-semibold tracking-wide leading-snug">
              Time to move, track, and transform
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
