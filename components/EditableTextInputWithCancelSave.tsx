import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { gs } from "@/global-styles";

interface Props {
  text: string;
  handleSave: (text: string) => void;
}

export default function EditableTextInputWithCancelSave({
  text,
  handleSave,
}: Props) {
  const [isEditing, setIsditing] = useState(false);
  const [_text, setText] = useState(text);
  const [_height, setHeight] = useState(0);

  return (
    <>
      {isEditing ? (
        <View style={{ backgroundColor: "white" }}>
          <TextInput
            style={{ height: _height, padding: 6 }}
            value={_text}
            onChangeText={setText}
            onSubmitEditing={() => {
              setIsditing(false);
              handleSave(_text);
            }}
            autoFocus={true}
            multiline={true}
            onContentSizeChange={(e) =>
              setHeight(e.nativeEvent.contentSize.height)
            }
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ margin: 12 }}
              onPress={() => {
                setText(text);
                setIsditing(false);
              }}
            >
              Cancel
            </Text>
            <Pressable
              style={[gs.button, { margin: 12, height: 24 }]}
              onPress={() => {
                setIsditing(false);
                handleSave(_text);
              }}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <Pressable onPress={() => setIsditing(true)}>
            <Text style={{ padding: 6 }}>{_text}</Text>
          </Pressable>
        </>
      )}
    </>
  );
}
