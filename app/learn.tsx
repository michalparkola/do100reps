import React from "react";
import { Stack } from "expo-router";
import Programs from "@/screens/Programs";

export default function Nuggets() {
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
