import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";

import { gs } from "@/global-styles";

interface Props {
  rep_id: number;
}

export function AddRepNote({ rep_id }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newText, setNewText] = useState("");

  async function handleSave() {
    return;
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
            <Text style={gs.h2}>Add note</Text>
            <Text style={gs.secondaryText}>
              Capture additiona details about this rep.
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
                  setNewText("");
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
          <Text>Add Note</Text>
        </Pressable>
      </View>
    </>
  );
}
