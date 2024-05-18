import PracticeView from "@/components/PracticeView";
import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Practice",
        }}
      />
      <PracticeView practiceId={id} />
    </View>
  );
}
