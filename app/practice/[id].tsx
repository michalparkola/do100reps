import PracticeView from "@/components/PracticeView";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PracticeView practiceId={id} />;
}
