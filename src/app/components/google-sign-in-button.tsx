import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function GoogleButton() {
  const router = useRouter();
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              router.push("/sign-in/tasks");
              return;
            }
            router.push("/");
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-center bg-white rounded-xl py-3 px-4 shadow-md shadow-black/20 w-full"
    >
      <Svg
        width={24}
        height={24}
        viewBox="0 0 48 48"
        style={{ marginRight: 8 }}
      >
        <Path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
             c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12
             c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
             C34.046,6.053,29.268,4,24,4
             C12.955,4,4,12.955,4,24
             c0,11.045,8.955,20,20,20
             c11.045,0,20-8.955,20-20
             C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <Path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819
             C14.655,15.108,18.961,12,24,12
             c3.059,0,5.842,1.154,7.961,3.039
             l5.657-5.657
             C34.046,6.053,29.268,4,24,4
             C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <Path
          fill="#4CAF50"
          d="M24,44
             c5.166,0,9.86-1.977,13.409-5.192
             l-6.19-5.238
             C29.211,35.091,26.715,36,24,36
             c-5.202,0-9.619-3.317-11.283-7.946
             l-6.522,5.025
             C9.505,39.556,16.227,44,24,44z"
        />
        <Path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303
             c-0.792,2.237-2.231,4.166-4.087,5.571
             c0.001-0.001,0.002-0.001,0.003-0.002
             l6.19,5.238
             C36.971,39.205,44,34,44,24
             C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </Svg>
      <Text className="text-[#111] text-base font-semibold">
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
