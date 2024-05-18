import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Do 100 reps" }} />
    </Stack>
  );
}
