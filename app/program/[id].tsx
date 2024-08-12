import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import Program from "@/screens/Program";

export default function ProgramRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Learning Program",
        }}
      />
      {id ? <Program programId={id} /> : <Text>Loading...</Text>}
    </>
  );
}
