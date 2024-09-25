import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Switch,
} from "react-native";

import { useProgram } from "@/hooks/useProgram";
import { useReps } from "@/hooks/useReps";

import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

import RepCard from "../reps/RepCard";
import { ConnectRepToActivityModal } from "./ConnectRepToActivityModal";
import { useUpdateProgram } from "./useUpdateProgram";
import { AddActivity } from "./AddActivity";
import { EditableActivityCard } from "./EditableActivityCard";

interface ProgramProps {
  programId: number;
}

export default function Program({ programId }: ProgramProps) {
  const {
    isPending: isPendingProgram,
    error: errorProgram,
    data: program,
  } = useProgram(String(programId));

  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useReps(String(program?.practice ?? ""));

  const updateProgramMutation = useUpdateProgram(programId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [title, setTitle] = useState(program?.title ?? "");
  const [description, setDescription] = useState(program?.description ?? "");
  const [isShelved, setIsShelved] = useState(program?.is_shelved ?? false);

  useEffect(() => {
    if (program) {
      setTitle(program.title);
      setDescription(program.description ?? "");
      setIsShelved(program.is_shelved ?? false);
    }
  }, [program]);

  if (isPendingProgram || isPendingReps) return <Text>Loading ...</Text>;
  if (errorProgram || errorReps) return <Text>Error ...</Text>;

  function getRepById(id: number): Tables<"Reps"> | undefined {
    return reps?.find((rep) => rep.id === id);
  }

  function handleSaveProgram() {
    updateProgramMutation.mutate(
      {
        new_title: title,
        new_description: description,
        new_is_shelved: isShelved,
      },
      {
        onSuccess: () => {
          setIsEditingTitle(false);
          setIsEditingDescription(false);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }

  function handleIsShelvedSwitch(switch_value: boolean) {
    updateProgramMutation.mutate(
      {
        new_title: title,
        new_description: description,
        new_is_shelved: switch_value,
      },
      {
        onSuccess: () => {
          setIsShelved(switch_value);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }

  return (
    <ScrollView style={{ marginHorizontal: 12 }}>
      <Text style={gs.label}>Program Title</Text>
      {isEditingTitle ? (
        <View style={{ backgroundColor: "white", padding: 5 }}>
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
                setTitle(program.title);
                setDescription(program.description ?? "");
              }}
            >
              Cancel
            </Text>
            <Pressable
              onPress={() => {
                handleSaveProgram();
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
          style={{ margin: 12 }}
          onPress={() => {
            setIsEditingTitle(true);
          }}
        >
          {program.title}
        </Text>
      )}
      <Text style={gs.label}>Description</Text>
      {isEditingDescription ? (
        <View style={{ backgroundColor: "white", padding: 5 }}>
          <TextInput
            style={{ borderWidth: 1, padding: 8, height: 250 }}
            value={description}
            onChangeText={setDescription}
            autoFocus={true}
            multiline={true}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Text
              onPress={() => {
                setIsEditingDescription(false);
                setTitle(program.title);
                setDescription(program.description ?? "");
              }}
            >
              Cancel
            </Text>
            <Pressable
              onPress={() => {
                handleSaveProgram();
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
          style={{ margin: 12 }}
          onPress={() => {
            setIsEditingDescription(true);
          }}
        >
          {program.description}
        </Text>
      )}
      <Text style={gs.label}>Shelved</Text>
      <Switch
        style={{ margin: 12 }}
        value={isShelved}
        onValueChange={(value) => {
          console.log("Swith: ", value);
          handleIsShelvedSwitch(value);
        }}
      />
      <Text style={gs.label}>Activities</Text>
      <View style={{ flexGrow: 0 }}>
        <FlatList
          style={{ margin: 12 }}
          data={program.activities}
          renderItem={({ item }) => (
            <>
              <EditableActivityCard activity={item} />
              <FlatList
                style={{ marginLeft: 12 }}
                data={item.related_reps}
                keyExtractor={(innerItem) => innerItem.toString()}
                renderItem={({ item, index }) => (
                  <RepCard
                    rep={getRepById(item)}
                    rep_number={reps.length - index}
                  />
                )}
                ListFooterComponent={
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginBottom: 20,
                    }}
                  >
                    <ConnectRepToActivityModal
                      practice_id={String(program?.practice ?? "")}
                      activity_id={item.id}
                    />
                  </View>
                }
              />
            </>
          )}
        />
      </View>
      <AddActivity program_id={programId} />
    </ScrollView>
  );
}
