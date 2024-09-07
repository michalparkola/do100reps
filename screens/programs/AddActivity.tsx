import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";

import { useAddActivity } from "./useAddActivity";

import { gs } from "@/global-styles";

export function AddActivity({ program_id }: { program_id: number }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addActivityMutation = useAddActivity(program_id);

  async function handleSave() {
    if (!title) return;

    addActivityMutation.mutate({ title, description });

    if (!addActivityMutation.error) {
      setTitle("");
      setDescription("");
      setModalVisible(false);
    } else {
      console.error(addActivityMutation.error);
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
            <Text style={gs.h2}>New Activity Title</Text>
            <Text style={gs.secondaryText}>
              What&apos;s the title of the activity?
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
            <Text style={gs.h2}>New Activity Description</Text>
            <Text style={gs.secondaryText}>
              Describe the activity your learners should DO.
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 36,
                padding: 12,
                borderWidth: 1,
                height: 200,
              }}
              onChangeText={(text) => setDescription(text)}
              value={description}
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
                  setTitle("");
                  setDescription("");
                  setModalVisible(false);
                }}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={gs.smallButton}>
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
          <Text>Add Activity</Text>
        </Pressable>
      </View>
    </>
  );
}
