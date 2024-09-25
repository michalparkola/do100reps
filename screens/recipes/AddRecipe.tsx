import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";

import { supabase } from "@/supabase/supabase-client";
import { Tables } from "@/supabase/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { gs } from "@/global-styles";

interface Props {
  add_to_practice: Tables<"Practices">;
}

export function AddRecipeToPractice({ add_to_practice }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const queryClient = useQueryClient();

  async function createNewNugget() {
    if (!newTitle) return;

    const { error } = await supabase.from("Nuggets").insert({
      title: newTitle,
      text: newText,
      practice_id: add_to_practice.id,
      practice: add_to_practice.name,
    });

    if (!error) {
      setNewTitle("");
      setNewText("");
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
            <Text style={gs.h2}>New Recipe Title</Text>
            <Text style={gs.secondaryText}>
              What&apos;s the main idea or action?
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
            <Text style={gs.h2}>New Recipe Description</Text>
            <Text style={gs.secondaryText}>
              Describe the ACTION, desired result and any other helpful details.
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
                onPress={() => {
                  setNewTitle("");
                  setNewText("");
                  setModalVisible(false);
                }}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={createNewNugget} style={gs.button}>
                <Text>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ margin: 12, width: 150 }}>
        <Pressable
          style={gs.smallButton}
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
