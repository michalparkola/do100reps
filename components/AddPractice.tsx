import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { supabase } from "@/helpers/supabase";

export function AddPractice({
  onPracticeAdded,
}: {
  onPracticeAdded: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPracticeName, setNewPracticeName] = useState("");
  const [newPracticeTitle, setNewPracticeTitle] = useState("");
  async function createNewPractice() {
    if (!newPracticeName || !newPracticeTitle) return;

    const { error } = await supabase
      .from("Practices")
      .insert({ name: newPracticeName, do100reps_title: newPracticeTitle });

    console.log(newPracticeName);
    console.log(newPracticeTitle);

    if (!error) {
      setModalVisible(false);
      onPracticeAdded();
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
            <Text>New practice short name</Text>
            <TextInput
              style={{
                margin: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeName(text)}
              value={newPracticeName}
            />
            <Text>
              New practice title - for best results describe the unit of
              progress (what you consider one rep) and the goal of doing them.
            </Text>
            <TextInput
              style={{
                margin: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeTitle(text)}
              value={newPracticeTitle}
            />
            <View style={{ flexDirection: "row" }}>
              <Pressable onPress={createNewPractice} style={{ margin: 12 }}>
                <Text>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={{
          margin: 12,
          alignItems: "flex-end",
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text>Add Practice</Text>
      </Pressable>
    </>
  );
}
