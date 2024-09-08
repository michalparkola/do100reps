import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Tables } from "@/supabase/database.types";

import { gs } from "@/global-styles";
import { useUpdateActivity } from "./useUpdateActivity";

export function EditableActivityCard({
  activity,
}: {
  activity: Tables<"Activities">;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");

  const updateActivityMutation = useUpdateActivity(activity);

  function handleSaveActivity() {
    console.log("Saving activity: ", activity);
    updateActivityMutation.mutate({
      new_title: title,
      new_description: description,
    });
  }

  return (
    <View style={gs.activityContainer}>
      {isEditingTitle ? (
        <View style={{ marginVertical: 10 }}>
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={title}
            onChangeText={setTitle}
          />
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              onPress={() => {
                setIsEditingTitle(false);
                setTitle(activity.title);
                setDescription(activity.description ?? "");
              }}
            >
              Cancel
            </Text>
            <Pressable
              onPress={() => {
                handleSaveActivity();
                setIsEditingTitle(false);
              }}
              style={[gs.button, { height: 24 }]}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text
          style={{ marginVertical: 12 }}
          onPress={() => setIsEditingTitle(true)}
        >
          {activity.title}
        </Text>
      )}
      <View
        style={{
          borderBottomColor: "#ababab",
          borderBottomWidth: 1,
        }}
      />
      {isEditingDescription ? (
        <View style={{ marginVertical: 10 }}>
          <TextInput
            style={{ borderWidth: 1, padding: 8, height: 350 }}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              onPress={() => {
                setIsEditingDescription(false);
                setTitle(activity.title);
                setDescription(activity.description ?? "");
              }}
            >
              Cancel
            </Text>
            <Pressable
              onPress={() => {
                handleSaveActivity();
                setIsEditingDescription(false);
              }}
              style={[gs.button, { height: 24 }]}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text
          style={{ marginVertical: 12, minHeight: 20 }}
          onPress={() => setIsEditingDescription(true)}
        >
          {activity.description || "..."}
        </Text>
      )}
    </View>
  );
}
