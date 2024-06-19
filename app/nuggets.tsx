import { Stack } from "expo-router";
import NuggetList from "@/screens/NuggetList";

export default function Nuggets() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Learn just enough to do something interesting",
        }}
      />
      <NuggetList />
    </>
  );
}
