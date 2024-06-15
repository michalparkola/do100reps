import React, { useState } from "react";
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
            practice_id={practice.id}
            practice_title={practice.do100reps_title}
          />
          <PracticeProgress completed_reps_count={reps.length} />
          <NextRep practice_id={practiceId} next_rep_cnt={reps.length + 1} />
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
