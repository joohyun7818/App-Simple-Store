import { createInstance } from "@optimizely/react-sdk";

// Expo의 환경 변수는 EXPO_PUBLIC_ 접두사를 사용합니다
const sdkKey = process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY;

export const optimizelyClient = createInstance({
  sdkKey: sdkKey ?? "",
});
