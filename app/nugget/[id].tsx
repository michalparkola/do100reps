import { Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import Nugget from "@/screens/Nugget";

export default function NuggetScreen() {
  const { id: nugget_id } = useLocalSearchParams<{ id: string }>();

  if (!nugget_id) return <Text>No nugget selected</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Turn this idea into action!",
        }}
      />
      <Nugget nugget_id={nugget_id} />
    </>
  );
}
