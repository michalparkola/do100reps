import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Keyboard,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import PracticeGrid from "@/components/PracticeGrid";
import { supabase } from "@/supabase/supabase-client";
import {
  getSupabasePracticeById,
  getSupabaseRepsByPracticeName,
} from "@/supabase/supabase-queries";

interface Props {
  practiceId: string;
}

export default function PracticeView({ practiceId }: Props) {
  // TODO check if valid practiceId

  const [nextRep, setNextRep] = useState<number>(1);
  const [nextRepText, setNextRepText] = useState("");
  const [practice, setPractice] = useState<any>(null);
  const [reps, setReps] = useState<any[]>([]);
  const [isEditingPracticeTitle, setIsEditingPracticeTitle] = useState(false);
  const [practiceTitle, setPracticeTitle] = useState("Practice Title");

  React.useEffect(() => {
    getRepsFromSupabase();
  }, []);

  async function getRepsFromSupabase() {
    let p = await getSupabasePracticeById(practiceId);

    const practiceName = p ? p.name : "";
    const practiceTitle = p ? p.do100reps_title : "";

    setPractice(p);
    setPracticeTitle(practiceTitle);

    const reps = await getSupabaseRepsByPracticeName(practiceName);
    setReps(reps);
    setNextRep(reps.length + 1);
  }

  async function savePracticeTitle(id: string, title: string) {
    await supabase
      .from("Practices")
      .update({ do100reps_title: title })
      .eq("id", id);
  }

  async function saveNextRep() {
    await supabase
      .from("Reps")
      .insert({ summary: nextRepText, practice: practice.name });

    await supabase
      .from("Practices")
      .update({ do100reps_count: nextRep })
      .eq("id", practice.id);

    setReps((prevReps) => [
      {
        summary: nextRepText,
        created_at: new Date().toISOString().split("T")[0],
      },
      ...prevReps,
    ]);

    setNextRep(nextRep + 1);
    setNextRepText("");
    Keyboard.dismiss();
  }

  return (
    <FlatList
      style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
      data={reps}
      ListHeaderComponent={
        <View style={{ marginBottom: 12 }}>
          {isEditingPracticeTitle ? (
            <TextInput
              style={{
                fontSize: 40,
                fontWeight: "bold",
                marginBottom: 12,
              }}
              value={practiceTitle}
              onChangeText={setPracticeTitle}
              onSubmitEditing={() => {
                setIsEditingPracticeTitle(false);
                savePracticeTitle(practice.id, practiceTitle);
              }}
              autoFocus={true}
            />
          ) : (
            <Pressable onPress={() => setIsEditingPracticeTitle(true)}>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  marginBottom: 12,
                }}
              >
                {practiceTitle}
              </Text>
            </Pressable>
          )}

          <View style={{ flexDirection: "row" }}>
            <View>
              <PracticeGrid nextRep={nextRep} size={10} />
            </View>
            <Text style={{ fontSize: 32, marginLeft: 12 }}>
              Next rep {nextRep.toString()}/100
            </Text>
          </View>
          <Text style={{ fontSize: 16, marginTop: 12 }}>
            Describe the result of the next rep:
          </Text>
          <TextInput
            style={{
              height: 150,
              marginTop: 12,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: "lightgray",
              padding: 10,
            }}
            multiline
            onChangeText={setNextRepText}
            value={nextRepText}
          />
          <View>
            <Button
              onPress={saveNextRep}
              title="Save Rep"
              color="lightgreen"
              accessibilityLabel="Save the rep and prepare for the next one."
            />
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            padding: 12,
            marginBottom: 12,
            elevation: 5,
          }}
        >
          <Link href={"/rep/" + item.id}>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Rep {nextRep - 1 - index} ({item.created_at}): {item.summary}
            </Text>
          </Link>
        </View>
      )}
    />
  );
}
