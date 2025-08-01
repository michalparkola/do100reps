import React from "react";
import { Stack } from "expo-router";
import { Text, Pressable } from "react-native";
import { handleLogout } from "@/supabase/supabase-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "lightgreen" },
          headerRight: () => {
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
    </QueryClientProvider>
  );
}
