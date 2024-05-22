import { useLocalSearchParams, Stack } from "expo-router";
import PracticeView from "@/components/PracticeView";

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Continue Practice",
        }}
      />
      <PracticeView practiceId={id} />
    </>
  );
}
