import { Stack } from "expo-router";
import { Text, Pressable } from "react-native";
import { handleLogout } from "@/helpers/supabase";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "lightgreen" },
        headerRight: (props: HeaderButtonProps) => {
          return (
            <Pressable onPress={handleLogout}>
              <Text style={{ marginRight: 12 }}>Logout</Text>
            </Pressable>
          );
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Do 100 reps",
        }}
      />
    </Stack>
  );
}
