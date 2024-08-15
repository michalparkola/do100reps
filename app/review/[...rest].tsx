import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import PracticeReview from "@/screens/practice/PracticeReview";

export default function Practice() {
  const { rest } = useLocalSearchParams<{ rest: string[] }>();

  if (!rest) return <Text>No user and practice identified!</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Review Practice",
        }}
      />
      <PracticeReview userId={rest[0]} practiceId={rest[1]} />
    </>
  );
}
