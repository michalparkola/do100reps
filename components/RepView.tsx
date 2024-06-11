import { useState } from "react";
import { Text, TextInput, Pressable, FlatList, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotesByRepId, updateNote } from "@/helpers/supabase-queries";

interface Rep {
  id: string;
  user_id: string;
  summary: string;
  created_at: string;
}

interface RepViewProps {
  rep: Rep;
  onChange: (newRepSummary: string, newRepDate: string) => void;
}

export default function RepView({ rep, onChange }: RepViewProps) {
  const [isEditingRepSummary, setIsEditingRepSummary] = useState(false);
  const [repSummary, setRepSummary] = useState(rep.summary);

  const [date, setDate] = useState<string>(rep.created_at);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState<string>("");

  const queryClient = useQueryClient();

  function handleDatePicked(dateString: string) {
    setDate(dateString);
    setIsEditingDate(false);
    onChange(repSummary, dateString);
  }

  // get notes
  const {
    isPending: isPendingNotes,
    error: errorNotes,
    data: notes,
  } = useQuery({
    queryKey: ["notes", rep.id],
    queryFn: () => getNotesByRepId(rep.id),
  });

  console.log(notes);

  const updateNoteMutation = useMutation({
    mutationFn: ({ note_id, newText }: { note_id: string; newText: string }) =>
      updateNote(note_id, newText),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", rep.id] }),
  });

  return (
    <>
      {isEditingDate ? (
        <Calendar
          onDayPress={(day) => {
            handleDatePicked(day.dateString);
          }}
        />
      ) : (
        <Text style={{ margin: 12 }} onPress={() => setIsEditingDate(true)}>
          Created at: {date}
        </Text>
      )}

      <Text style={{ margin: 12 }}>Rep summary:</Text>
      {isEditingRepSummary ? (
        <TextInput
          style={{ margin: 6, padding: 6 }}
          value={repSummary}
          onChangeText={setRepSummary}
          onSubmitEditing={() => {
            setIsEditingRepSummary(false);
            onChange(repSummary, date);
          }}
          onBlur={() => {
            setIsEditingRepSummary(false);
            setRepSummary(rep.summary);
          }}
          autoFocus={true}
        />
      ) : (
        <>
          <Pressable onPress={() => setIsEditingRepSummary(true)}>
            <Text style={{ margin: 12 }}>{repSummary}</Text>
          </Pressable>
        </>
      )}

      {isPendingNotes || errorNotes || notes.length == 0 ? (
        <Text style={{ margin: 12 }}>No notes (yet)</Text>
      ) : (
        <FlatList
          style={{ margin: 12 }}
          data={notes}
          ListHeaderComponent={<Text style={{ marginBottom: 12 }}>Notes:</Text>}
          renderItem={({ item }) => (
            <View>
              {editingNoteId === item.id ? (
                <TextInput
                  style={{ margin: 12, padding: 6 }}
                  value={newNoteText}
                  onChangeText={setNewNoteText}
                  onSubmitEditing={() => {
                    updateNoteMutation.mutate({
                      note_id: item.id,
                      newText: newNoteText,
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
                    setNewNoteText(item.text);
                  }}
                >
                  <Text style={{ marginTop: 12, marginBottom: 12 }}>
                    {item.modfied_at.substring(0, 10)} {item.text}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#ccc" }} />
          )}
        />
      )}
    </>
  );
}
