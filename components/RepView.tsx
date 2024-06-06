import { useState } from "react";
import { Text, TextInput, Pressable, Button } from "react-native";
import { Calendar } from "react-native-calendars";

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
          {date}
        </Text>
      )}

      {isEditingRepSummary ? (
        <TextInput
          style={{ margin: 12 }}
          value={repSummary}
          onChangeText={setRepSummary}
          onSubmitEditing={() => {
            setIsEditingRepSummary(false);
            onChange(repSummary, date);
          }}
          autoFocus={true}
        />
      ) : (
        <Pressable onPress={() => setIsEditingRepSummary(true)}>
          <Text style={{ margin: 12 }}>{repSummary}</Text>
        </Pressable>
      )}
    </>
  );
}
