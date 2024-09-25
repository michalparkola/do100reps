import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Switch } from "react-native";

import { usePractice } from "./usePractice";
import { useUpdatePractice } from "./useUpdatePractice";
import { useReps } from "@/hooks/useReps";

import EditablePracticeTitle from "./EditablePracticeTitle";
import PracticeProgress from "./PracticeProgress";
import NextRep from "../reps/NextRep";
import RepCard from "../reps/RepCard";
import RecipeListForPractice from "@/screens/recipes/RecipeListForPractice";
import { AddRecipeToPractice } from "../recipes/AddRecipe";
import ProgramsListForPractice from "../programs/ProgramsListForPractice";

import { gs } from "@/global-styles";

interface Props {
  practiceId: string;
}

export default function PracticeView({ practiceId }: Props) {
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = usePractice(practiceId);

  const updatePracticeMutation = useUpdatePractice(Number(practiceId));

  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useReps(practiceId);

  const [isShelved, setIsShelved] = useState(practice?.is_shelved ?? false);

  // TODO: do I really need this useEffect?
  useEffect(() => {
    if (practice) {
      setIsShelved(practice.is_shelved ?? false);
    }
  }, [practice]);

  if (isPendingPractice || errorPractice) return <Text>Loading...</Text>;
  if (isPendingReps || errorReps) return <Text>Loading...</Text>;

  function handleIsShelvedSwitch(switch_value: boolean) {
    updatePracticeMutation.mutate(
      {
        new_title: practice?.do100reps_title || "",
        new_is_shelved: switch_value,
      },
      {
        onSuccess: () => {
          setIsShelved(switch_value);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }

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
          <Text style={gs.h2}>Shelved</Text>
          <Switch
            style={{ margin: 12 }}
            value={isShelved}
            onValueChange={(value) => {
              handleIsShelvedSwitch(value);
            }}
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
