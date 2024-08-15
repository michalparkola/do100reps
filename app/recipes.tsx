import React from "react";
import { Stack } from "expo-router";
import RecipeList from "@/screens/recipes/RecipeList";

export default function RecipesRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Learn just enough to do something interesting",
        }}
      />
      <RecipeList />
    </>
  );
}
