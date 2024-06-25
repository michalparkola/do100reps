import React from "react";
import { Text } from "react-native";

interface Props {
  is_todo: boolean;
  handleToggle: () => void;
}

export default function EditableTODOSwitch({ is_todo, handleToggle }: Props) {
  if (is_todo)
    return (
      <Text style={{ margin: 12 }} onPress={handleToggle}>
        TODO
      </Text>
    );
  else
    return (
      <Text style={{ margin: 12 }} onPress={handleToggle}>
        Shelved
      </Text>
    );
}
