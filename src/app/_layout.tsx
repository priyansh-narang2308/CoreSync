import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";

export default function Layout() {
  return (
    <ClerkProvider>
      <Slot />
    </ClerkProvider>
  );
}
