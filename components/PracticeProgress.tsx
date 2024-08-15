import React from "react";
import { Text, View } from "react-native";
import PracticeGrid from "@/components/PracticeGrid";

interface Props {
  completed_reps_count: number;
}

export default function PracticeProgress({ completed_reps_count }: Props) {
  return (
    <View style={{ flexDirection: "row" }}>
      <PracticeGrid nextRep={completed_reps_count + 1} size={10} />
      <View>
        <Text style={{ fontSize: 32, marginLeft: 12 }}>
          Next rep: {completed_reps_count + 1}
        </Text>
        <Text style={{ fontSize: 22, marginLeft: 12 }}>
          Level: {Math.ceil(completed_reps_count / 10)}
        </Text>
      </View>
    </View>
  );
}
