import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  getSupabasePracticeById,
  getSupabaseRepsByPracticeId,
} from "@/supabase/supabase-queries";

import EditablePracticeTitle from "../components/EditablePracticeTitle";
import PracticeProgress from "../components/PracticeProgress";
import NextRep from "../components/NextRep";
import NuggetListForPractice from "@/components/NuggetListForPractice";
import { AddRecipeToPractice } from "./AddRecipe";
import { gs } from "@/global-styles";

interface Props {
  practiceId: string;
}

export default function PracticeView({ practiceId }: Props) {
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
    queryFn: () => getSupabaseRepsByPracticeId(practiceId),
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
            practice_id={practice.id.toString()}
            practice_title={practice.do100reps_title ?? ""}
          />
          <PracticeProgress completed_reps_count={reps.length} />
          <NuggetListForPractice practice_title={practice.name} />
          <AddRecipeToPractice add_to_practice={practice} />
          <NextRep practice_id={practiceId} next_rep_cnt={reps.length + 1} />
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={gs.repContainer}>
          <Link href={"/rep/" + item.id}>
            <View>
              <Text style={gs.repText}>{item.summary}</Text>
              <Text style={gs.repSecondaryText}>
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
});
