import React from "react";
import { Stack } from "expo-router";
import Programs from "@/screens/programs/Programs";

export default function ProgramRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Learn just enough to do something interesting",
        }}
      />
      <Programs />
    </>
  );
}
