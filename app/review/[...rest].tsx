import PracticeReview from "@/screens/PracticeReview";
import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function Practice() {
  const { rest } = useLocalSearchParams<{ rest: string[] }>();

  if (!rest) return <Text>Error!</Text>;

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Review Practice",
        }}
      />
      <PracticeReview userId={rest[0]} practiceId={rest[1]} />
    </View>
  );
}
