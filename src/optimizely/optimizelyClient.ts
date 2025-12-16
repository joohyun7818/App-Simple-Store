import { createInstance } from "@optimizely/react-sdk";

const sdkKey = process.env.OPTIMIZELY_SDK_KEY;

export const optimizelyClient = createInstance({
  sdkKey: sdkKey ?? "",
});
