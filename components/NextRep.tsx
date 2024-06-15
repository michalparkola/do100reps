import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Keyboard,
  Pressable,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase-client";

interface Props {
  practice_id: string;
  next_rep_cnt: number;
}

export default function NextRep({ practice_id, next_rep_cnt }: Props) {
  const [nextRepText, setNextRepText] = useState("");

  // mutation: practice title
  const queryClient = useQueryClient();
  const nextRepMutation = useMutation({
    mutationFn: () => saveNextRep(practice_id, nextRepText, next_rep_cnt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reps", practice_id] });
    },
  });

  async function saveNextRep(
    practice_id: string,
    next_rep_text: string,
    next_rep_cnt: number
  ) {
    if (nextRepText.length == 0) {
      console.log("Not saving an empty rep");
      return;
    }
    console.log("Saving", next_rep_text, practice_id);

    await supabase
      .from("Reps")
      .insert({ summary: nextRepText, practice_id: practice_id });

    await supabase
      .from("Practices")
      .update({ do100reps_count: next_rep_cnt })
      .eq("id", practice_id);

    setNextRepText("");
    Keyboard.dismiss();
  }

  return (
    <>
      <Text style={{ fontSize: 16, marginTop: 12 }}>
        Describe the result of the next rep:
      </Text>
      <TextInput
        style={styles.nextRepInput}
        multiline
        onChangeText={setNextRepText}
        value={nextRepText}
      />

      <Pressable
        style={styles.button}
        onPress={(e) => nextRepMutation.mutate()}
      >
        <Text style={styles.text}>Record the next rep</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  nextRepInput: {
    height: 150,
    marginTop: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
  },
  button: {
    backgroundColor: "lightgreen",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
