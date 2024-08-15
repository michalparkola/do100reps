import React from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { Text } from "react-native";
import Next from "@/screens/Next";

export default function Practice() {
  const { id: practice_id } = useLocalSearchParams<{ id: string }>();

  if (!practice_id) return <Text>No practice selected</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "What might I do next?",
        }}
      />
      <Next practiceId={practice_id} />
    </>
  );
}
