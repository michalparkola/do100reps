import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { supabase } from "@/supabase/supabase-client";
import { Tables } from "@/supabase/database.types";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  add_to_practice: Tables<"Practices">;
}

export function AddNuggetToPractice({ add_to_practice }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const queryClient = useQueryClient();

  async function createNewNugget() {
    if (!newTitle || !newText) return;

    const { error } = await supabase.from("Nuggets").insert({
      title: newTitle,
      text: newText,
      practice_id: add_to_practice.id,
      practice: add_to_practice.name,
    });

    console.log(newTitle);
    console.log(newText);

    if (!error) {
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["nuggets"] });
    } else {
      console.error(error);
    }
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ marginTop: 24, marginRight: 12, marginLeft: 12 }}>
          <View style={{ marginTop: 36, marginRight: 12, marginLeft: 12 }}>
            <Text style={styles.text}>New nugget title</Text>
            <Text style={styles.secondaryText}>
              I suggest adding the main idea or source as well as the next
              action for how to use it.
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 18,
                padding: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewTitle(text)}
              value={newTitle}
            />
            <Text style={styles.text}>New nugget body</Text>
            <Text style={styles.secondaryText}>
              Any notes about the source, idea or plan.
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 36,
                padding: 12,
                borderWidth: 1,
                height: 400,
              }}
              onChangeText={(text) => setNewText(text)}
              value={newText}
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={createNewNugget} style={styles.button}>
                <Text>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ margin: 12, width: 150 }}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text>Add Recipe</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});
