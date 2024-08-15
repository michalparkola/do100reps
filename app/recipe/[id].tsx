import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import Recipe from "@/screens/recipes/Recipe";

export default function RecipeRoute() {
  const { id: nugget_id } = useLocalSearchParams<{ id: string }>();

  if (!nugget_id) return <Text>No recipe selected</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Turn this idea into action!",
        }}
      />
      <Recipe nugget_id={nugget_id} />
    </>
  );
}
