import React, { useState } from "react";
import { Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSupabasePracticeById,
  savePracticeTitle,
} from "@/supabase/supabase-queries";

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
  } = useQuery({
    queryKey: ["practice", practice_id],
    queryFn: () => getSupabasePracticeById(practice_id),
  });

  // mutation: practice title
  const queryClient = useQueryClient();
  const practiceTitleMutation = useMutation({
    mutationFn: (newTitle: string) => savePracticeTitle(practice_id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice", practice_id] });
    },
  });

  if (isPendingPractice) return <Text>Loading...</Text>;
  if (errorPractice) return <Text>Error loading practice title!</Text>;

  if (!isEditing) {
    return (
      <Pressable onPress={() => setEditing(true)}>
        <Text style={styles.title}>{practice.do100reps_title}</Text>
      </Pressable>
    );
  }
  return (
    <TextInput
      style={styles.title}
      value={editedTitle}
      onChangeText={setEditedTitle}
      onSubmitEditing={() => {
        setEditing(false);
        practiceTitleMutation.mutate(editedTitle);
      }}
      autoFocus={true}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
