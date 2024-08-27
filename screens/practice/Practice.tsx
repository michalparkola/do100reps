import React from "react";
import { Text, View, FlatList } from "react-native";

import { usePractice } from "@/hooks/usePractice";
import { useReps } from "@/hooks/useReps";

import EditablePracticeTitle from "./EditablePracticeTitle";
import PracticeProgress from "./PracticeProgress";
import NextRep from "../reps/NextRep";
import RepCard from "../reps/RepCard";
import RecipeListForPractice from "@/screens/recipes/RecipeListForPractice";
import { AddRecipeToPractice } from "../recipes/AddRecipe";
import ProgramsListForPractice from "../programs/ProgramsListForPractice";

interface Props {
  practiceId: string;
}

export default function PracticeView({ practiceId }: Props) {
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = usePractice(practiceId);

  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useReps(practiceId);

  if (isPendingPractice || errorPractice) return <Text>Loading...</Text>;
  if (isPendingReps || errorReps) return <Text>Loading...</Text>;

  return (
    <FlatList
      style={{ padding: 12 }}
      data={reps}
      ListHeaderComponent={
        <View style={{ marginBottom: 12 }}>
          <EditablePracticeTitle
            practice_id={practice.id.toString()}
            practice_title={practice.do100reps_title ?? ""}
          />
          <PracticeProgress completed_reps_count={reps.length} />
          <ProgramsListForPractice practice_id={practice.id} />
          <RecipeListForPractice practice_title={practice.name} />
          <AddRecipeToPractice add_to_practice={practice} />
          <NextRep practice_id={practiceId} next_rep_cnt={reps.length + 1} />
        </View>
      }
      renderItem={({ item, index }) => (
        <RepCard rep={item} rep_number={reps.length - index} />
      )}
    />
  );
}
