import { useLocalSearchParams, Stack } from "expo-router";
import { Text } from "react-native";
import PracticeNext from "@/components/PracticeNext";

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
      <PracticeNext practiceId={practice_id} />
    </>
  );
}
