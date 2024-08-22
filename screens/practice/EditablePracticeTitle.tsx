import React, { useState } from "react";
import { Text, TextInput, Pressable } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePracticeTitle } from "@/supabase/supabase-queries";
import { usePractice } from "@/hooks/usePractice";
import { gs } from "@/global-styles";

interface Props {
  practice_id: string;
  practice_title: string;
}

export default function EditablePracticeTitle({
  practice_id,
  practice_title,
}: Props) {
  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(practice_title);

  // query: practice
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = usePractice(practice_id);

  // mutation: practice title
  const queryClient = useQueryClient();
  const practiceTitleMutation = useMutation({
    mutationFn: (newTitle: string) => savePracticeTitle(practice_id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice", practice_id] });
      queryClient.invalidateQueries({ queryKey: ["practices"] });
    },
  });

  if (isPendingPractice) return <Text>Loading...</Text>;
  if (errorPractice) return <Text>Error loading practice title!</Text>;

  if (!isEditing) {
    return (
      <Pressable onPress={() => setEditing(true)}>
        <Text style={gs.bigTitle}>{practice.do100reps_title}</Text>
      </Pressable>
    );
  }
  return (
    <TextInput
      style={gs.bigTitle}
      value={editedTitle}
      onChangeText={setEditedTitle}
      onSubmitEditing={() => {
        setEditing(false);
        practiceTitleMutation.mutate(editedTitle);
      }}
      multiline={true}
      onKeyPress={({ nativeEvent }) => {
        if (nativeEvent.key === "Enter") {
          setEditing(false);
          practiceTitleMutation.mutate(editedTitle);
        }
      }}
      autoFocus={true}
    />
  );
}
