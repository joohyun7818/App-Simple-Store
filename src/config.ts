import { Platform } from "react-native";

// For Expo Go on iOS Simulator: localhost points to your Mac.
// For Android Emulator: use 10.0.2.2 to reach host machine.
// For a physical device: set EXPO_PUBLIC_API_BASE_URL to your machine LAN IP.
const DEFAULT_API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:3000/api",
  default: "http://localhost:3000/api",
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  DEFAULT_API_BASE_URL;
