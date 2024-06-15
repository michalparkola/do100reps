import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  getSupabasePracticeById,
  getSupabaseRepsByPracticeName,
} from "@/supabase/supabase-queries";

import EditablePracticeTitle from "./EditablePracticeTitle";
import PracticeProgress from "./PracticeProgress";

interface Props {
  practiceId: string;
}

export default function PracticeView({ practiceId }: Props) {
  const [nextRepText, setNextRepText] = useState("");

  // query: practice
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = useQuery({
    queryKey: ["practice", practiceId],
    queryFn: () => getSupabasePracticeById(practiceId),
  });

  // query: reps
  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useQuery({
    queryKey: ["reps", practiceId],
    queryFn: () => getSupabaseRepsByPracticeName(practice.name),
    enabled: !!practice,
  });

  if (isPendingPractice || errorPractice) return <Text>Loading...</Text>;
  if (isPendingReps || errorReps) return <Text>Loading...</Text>;

  return (
    <FlatList
      style={styles.list}
      data={reps}
      ListHeaderComponent={
        <View style={{ marginBottom: 12 }}>
          <EditablePracticeTitle
            practice_id={practice.id}
            practice_title={practice.do100reps_title}
          />
          <PracticeProgress completed_reps_count={reps.length} />

          <Text style={{ fontSize: 16, marginTop: 12 }}>
            Describe the result of the next rep:
          </Text>
          <TextInput
            style={{
              height: 150,
              marginTop: 12,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: "lightgray",
              padding: 10,
            }}
            multiline
            onChangeText={setNextRepText}
            value={nextRepText}
          />
          <View>
            <Button
              onPress={() => console.log("TODO: saveNextRep")}
              title="Save Rep"
              color="lightgreen"
              accessibilityLabel="Save the rep and prepare for the next one."
            />
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.repContainer}>
          <Link href={"/rep/" + item.id}>
            <View>
              <Text style={styles.repText}>{item.summary}</Text>
              <Text style={styles.repSecondaryText}>
                Rep {reps.length - index} {item.created_at}{" "}
              </Text>
            </View>
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  repContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  repText: {
    fontSize: 16,
  },
  repSecondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});
