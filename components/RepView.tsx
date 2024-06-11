import { useState } from "react";
import { Text, TextInput, Pressable, FlatList, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import { getNotesByRepId } from "@/helpers/supabase-queries";

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
          renderItem={({ item, index }) => (
            <Text style={{ marginTop: 12, marginBottom: 12 }}>
              {item.created_at.substring(0, 10)} {item.text}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#ccc" }} />
          )}
        />
      )}
    </>
  );
}
