import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";

import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";
import { useAddProgram } from "./useAddProgram";

interface Props {
  practice: Tables<"Practices">;
}

export function AddProgramToPractice({ practice }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

  const addProgramMutation = useAddProgram(practice?.id);

  async function handleSaveProgram() {
    if (!title) return;

    addProgramMutation.mutate(title, {
      onSuccess: () => {
        setTitle("");
        setModalVisible(false);
      },
      onError: (error) => {
        console.error(error);
      },
    });
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
            <Text style={gs.h2}>New Program Title</Text>
            <Text style={gs.secondaryText}>
              What&apos;s the title of the new program?
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 18,
                padding: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setTitle(text)}
              value={title}
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
                  setTitle("");
                  setModalVisible(false);
                }}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveProgram} style={gs.button}>
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
          <Text>Add Program</Text>
        </Pressable>
      </View>
    </>
  );
}
