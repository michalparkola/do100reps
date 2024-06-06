import { useLocalSearchParams, Stack } from "expo-router";
import RepView from "@/components/RepView";

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rep details",
        }}
      />
      <RepView />
    </>
  );
}
