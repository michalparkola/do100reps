import React, { useState } from "react";
import { Text, TextInput, StyleSheet, Keyboard, Pressable } from "react-native";
import { useAddRep } from "@/hooks/useAddRep";

interface Props {
  practice_id: string;
  next_rep_cnt: number;
}

export default function NextRep({ practice_id, next_rep_cnt }: Props) {
  const [nextRepText, setNextRepText] = useState("");

  const nextRepMutation = useAddRep(practice_id, next_rep_cnt);

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

      <Pressable style={styles.button} onPress={handleAddNextRep}>
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
  },
});
