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
import { useQueryClient } from "@tanstack/react-query";

export function AddPractice() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPracticeName, setNewPracticeName] = useState("");
  const [newPracticeTitle, setNewPracticeTitle] = useState("");

  const queryClient = useQueryClient();

  async function createNewPractice() {
    if (!newPracticeName || !newPracticeTitle) return;

    const { error } = await supabase
      .from("Practices")
      .insert({ name: newPracticeName, do100reps_title: newPracticeTitle });

    console.log(newPracticeName);
    console.log(newPracticeTitle);

    if (!error) {
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["practices"] });
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
            <Text style={styles.text}>New practice short name</Text>
            <Text style={styles.secondaryText}>
              Used as additional heading in practice list.
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 18,
                padding: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeName(text)}
              value={newPracticeName}
            />
            <Text style={styles.text}>New practice title</Text>
            <Text style={styles.secondaryText}>
              For best results describe the unit of progress (what you consider
              one rep) and the goal of doing them.
            </Text>
            <TextInput
              style={{
                marginTop: 12,
                marginBottom: 36,
                padding: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeTitle(text)}
              value={newPracticeTitle}
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
              <Pressable
                onPress={createNewPractice}
                style={[styles.button, { width: 100 }]}
              >
                <Text>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: "flex-end", margin: 12 }}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text>Add Practice</Text>
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
