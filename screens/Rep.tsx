import React from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  FlatList,
  View,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotesByRepId,
  updateNote,
  createNote,
} from "@/supabase/supabase-queries";

interface Rep {
  id: string;
  user_id: string;
  summary: string;
  created_at: string;
}

interface RepViewProps {
  rep: Rep;
  handleRepChange: (newRepSummary: string, newRepDate: string) => void;
}

export default function Rep({ rep, handleRepChange }: RepViewProps) {
  const [isEditingRepSummary, setIsEditingRepSummary] = useState(false);
  const [repSummary, setRepSummary] = useState(rep.summary);

  const [date, setDate] = useState<string>(rep.created_at);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNoteText, setEditedNoteText] = useState<string>("");
  const [newNoteText, setNewNoteText] = useState<string>("");

  const queryClient = useQueryClient();

  function handleDatePicked(dateString: string) {
    setDate(dateString);
    setIsEditingDate(false);
    handleRepChange(repSummary, dateString);
  }

  // query: notes
  const {
    isPending: isPendingNotes,
    error: errorNotes,
    data: notes,
  } = useQuery({
    queryKey: ["notes", rep.id],
    queryFn: () => getNotesByRepId(rep.id),
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ note_id, newText }: { note_id: string; newText: string }) =>
      updateNote(note_id, newText),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", rep.id] }),
  });

  const createNoteMutation = useMutation({
    mutationFn: ({ rep_id, text }: { rep_id: string; text: string }) =>
      createNote(rep_id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", rep.id] });
    },
  });

  return (
    <>
      {isEditingDate ? (
        <>
          <Calendar
            showWeekNumbers
            onDayPress={(day) => {
              handleDatePicked(day.dateString);
            }}
          />
          <Text style={{ margin: 12 }} onPress={() => setIsEditingDate(false)}>
            Cancel
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.text, { margin: 12 }]}>Created at</Text>
          <Text
            style={{ marginHorizontal: 12, marginBottom: 12 }}
            onPress={() => setIsEditingDate(true)}
          >
            {date}
          </Text>
        </>
      )}

      <Text style={[styles.text, { marginHorizontal: 12, marginTop: 12 }]}>
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
              style={[styles.button, { margin: 12, height: 24 }]}
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

      <Text style={[styles.text, { marginHorizontal: 12, marginTop: 12 }]}>
        Notes
      </Text>
      {isPendingNotes || errorNotes || notes.length == 0 ? (
        <Text style={{ margin: 12 }}>No notes (yet)</Text>
      ) : (
        <View style={{ flexGrow: 0 }}>
          <FlatList
            style={{ margin: 12 }}
            data={notes}
            renderItem={({ item }) => (
              <View style={styles.noteContainer}>
                {editingNoteId === item.id ? (
                  <TextInput
                    style={{ margin: 12, padding: 6 }}
                    value={editedNoteText}
                    onChangeText={setEditedNoteText}
                    onSubmitEditing={() => {
                      updateNoteMutation.mutate({
                        note_id: item.id.toString(),
                        newText: editedNoteText,
                      });
                      setEditingNoteId(null);
                    }}
                    onBlur={() => setEditingNoteId(null)}
                    autoFocus
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      setEditingNoteId(item.id);
                      setEditedNoteText(item.text);
                    }}
                  >
                    <Text style={{ marginVertical: 12 }}>
                      {item.modified_at.substring(0, 10)} {item.text}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#ccc" }} />
            )}
          />
        </View>
      )}
      <Text
        style={[
          styles.text,
          {
            marginTop: 12,
            marginHorizontal: 12,
            marginBottom: 6,
          },
        ]}
      >
        Add note
      </Text>
      <TextInput
        value={newNoteText}
        onChangeText={setNewNoteText}
        style={{
          height: 150,
          marginLeft: 12,
          marginRight: 12,
          borderWidth: 1,
          borderColor: "lightgray",
          backgroundColor: "lightyellow",
          padding: 10,
        }}
        multiline
      />
      <View style={{ marginRight: 12, marginLeft: 12, marginTop: 6 }}>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (newNoteText.trim()) {
              createNoteMutation.mutate({ rep_id: rep.id, text: newNoteText });
              setNewNoteText(""); // Clear the input after adding
            }
          }}
        >
          <Text>Save note</Text>
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
  noteContainer: {
    backgroundColor: "lightyellow",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
