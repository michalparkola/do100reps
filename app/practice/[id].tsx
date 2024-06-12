import { useLocalSearchParams, Stack } from "expo-router";
import PracticeView from "@/components/PracticeView";
import { Text } from "react-native";

export default function Practice() {
  const { id: practice_id } = useLocalSearchParams<{ id: string }>();

  if (!practice_id) return <Text>No practice selected</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Continue Practice",
        }}
      />
      <PracticeView practiceId={practice_id} />
    </>
  );
}
