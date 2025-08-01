import React from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  FlatList,
  View,
  ScrollView,
} from "react-native";

import { Calendar, DateData } from "react-native-calendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/supabase/database.types";
import { updateNote } from "@/supabase/supabase-queries";

import { useNotes } from "./useNotes";

import { gs } from "@/global-styles";
import { AddRepNote } from "./AddNote";

interface RepViewProps {
  rep: Tables<"Reps">;
  handleRepChange: (newRepSummary: string, newRepDate: string) => void;
}

export default function Rep({ rep, handleRepChange }: RepViewProps) {
  const [isEditingRepSummary, setIsEditingRepSummary] = useState(false);
  const [repSummary, setRepSummary] = useState(rep.summary);

  const [date, setDate] = useState<string>(rep.created_at);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNoteText, setEditedNoteText] = useState<string>("");

  const queryClient = useQueryClient();

  function handleDatePicked(dateString: string) {
    setDate(dateString);
    setIsEditingDate(false);
    handleRepChange(repSummary, dateString);
  }

  const {
    isPending: isPendingNotes,
    error: errorNotes,
    data: notes,
  } = useNotes(rep.id);

  const updateNoteMutation = useMutation({
    mutationFn: ({ note_id, newText }: { note_id: string; newText: string }) =>
      updateNote(note_id, newText),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", rep.id] }),
  });

  if (isPendingNotes) return <Text>Loading notes...</Text>;
  if (errorNotes) return <Text>Error loading notes: {errorNotes.message}</Text>;

  return (
    <ScrollView>
      {isEditingDate ? (
        <>
          <Calendar
            showWeekNumbers
            onDayPress={(day: DateData) => {
              handleDatePicked(day.dateString);
            }}
          />
          <Text style={{ margin: 12 }} onPress={() => setIsEditingDate(false)}>
            Cancel
          </Text>
        </>
      ) : (
        <>
          <Text style={[gs.h2, { margin: 12 }]}>Created at</Text>
          <Text
            style={{ marginHorizontal: 12, marginBottom: 12 }}
            onPress={() => setIsEditingDate(true)}
          >
            {date}
          </Text>
        </>
      )}

      <Text style={[gs.h2, { marginHorizontal: 12, marginTop: 12 }]}>
        Rep summary
      </Text>
      {isEditingRepSummary ? (
        <View style={{ backgroundColor: "white" }}>
          <TextInput
            style={{ margin: 6, padding: 6, height: 150 }}
            value={repSummary}
            onChangeText={setRepSummary}
            onSubmitEditing={() => {
              setIsEditingRepSummary(false);
              handleRepChange(repSummary, date);
            }}
            autoFocus={true}
            multiline={true}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ margin: 12 }}
              onPress={() => {
                setRepSummary(rep.summary);
                setIsEditingRepSummary(false);
              }}
            >
              Cancel
            </Text>
            <Pressable
              style={[gs.button, { margin: 12, height: 24 }]}
              onPress={() => {
                setIsEditingRepSummary(false);
                handleRepChange(repSummary, date);
              }}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <Pressable onPress={() => setIsEditingRepSummary(true)}>
            <Text style={{ margin: 12 }}>{repSummary}</Text>
          </Pressable>
        </>
      )}

      <Text style={[gs.h2, { margin: 12 }]}>Notes</Text>
      {isPendingNotes || errorNotes || notes.length == 0 ? (
        <Text style={{ margin: 12 }}>No notes (yet)</Text>
      ) : (
        <View style={{ flexGrow: 0 }}>
          <FlatList
            style={{ marginHorizontal: 12 }}
            data={notes}
            renderItem={({ item }) => (
              <View style={gs.noteContainer}>
                {editingNoteId === item.id ? (
                  <>
                    <TextInput
                      style={{ padding: 5 }}
                      value={editedNoteText}
                      onChangeText={setEditedNoteText}
                      onSubmitEditing={() => {
                        updateNoteMutation.mutate({
                          note_id: item.id.toString(),
                          newText: editedNoteText,
                        });
                        setEditingNoteId(null);
                      }}
                      autoFocus
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
                          setEditingNoteId(null);
                        }}
                      >
                        Cancel
                      </Text>
                      <Pressable
                        onPress={() => {
                          updateNoteMutation.mutate({
                            note_id: item.id.toString(),
                            newText: editedNoteText,
                          });
                          setEditingNoteId(null);
                        }}
                        style={[gs.button, { height: 24 }]}
                      >
                        <Text>Save</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <Pressable
                    onPress={() => {
                      setEditingNoteId(item.id);
                      setEditedNoteText(item.text);
                    }}
                  >
                    <Text style={{ marginVertical: 12 }}>{item.text}</Text>
                    <Text style={gs.repSecondaryText}>
                      {item.modified_at.substring(0, 10)}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          />
        </View>
      )}

      <AddRepNote rep_id={rep.id} />
    </ScrollView>
  );
}
