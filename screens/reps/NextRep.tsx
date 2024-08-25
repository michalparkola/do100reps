import React, { useState } from "react";
import { Text, TextInput, StyleSheet, Keyboard, Pressable } from "react-native";
import { gs } from "@/global-styles";
import { useAddRep } from "@/hooks/useAddRep";

interface Props {
  practice_id: string;
  next_rep_cnt: number;
  activity_id?: number;
}

export default function NextRep({
  practice_id,
  next_rep_cnt,
  activity_id,
}: Props) {
  const [nextRepText, setNextRepText] = useState("");

  const nextRepMutation = useAddRep(practice_id, next_rep_cnt, activity_id);

  async function handleAddNextRep() {
    if (nextRepText.length == 0) {
      console.log("Not saving an empty rep");
      return;
    }
    console.log("Saving", nextRepText, practice_id);

    nextRepMutation.mutate(nextRepText);

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

      <Pressable style={gs.button} onPress={handleAddNextRep}>
        <Text style={gs.text}>Record the next rep</Text>
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
});
