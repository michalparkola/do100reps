import { Stack } from "expo-router";
import { Text, Pressable } from "react-native";
import { supabase } from "@/helpers/supabase";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

const handleLogout = async () => {
  if (!supabase) {
    console.error("Supabase context is null");
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error.message);
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Do 100 reps",
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <Text style={{ marginRight: 12 }}>Logout ({})</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
