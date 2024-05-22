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
import PracticeGrid from "@/components/PracticeGrid";
import { supabase } from "@/helpers/supabase";

interface Props {
  practiceId?: string;
}

export default function PracticeView({ practiceId }: Props) {
  // TODO check if valid practiceId

  const [isLoading, setIsLoading] = useState(true);
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
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      let userId = null;
      if (userData && userData.user && !userError) {
        userId = userData.user.id;
      } else throw userError;

      const { data: practiceData, error: practiceError } = await supabase
        .from("Practices")
        .select()
        .eq("user_id", userId)
        .eq("id", practiceId);

      let practiceName = null;
      if (practiceData) {
        setPractice(practiceData[0]);
        practiceName = practiceData[0].name;
        setPracticeTitle(practiceData[0].do100reps_title);
      }

      const { data: repsData, error: repsError } = await supabase
        .from("Reps")
        .select()
        .eq("practice", practiceName)
        .order("created_at", { ascending: true });

      if (practiceError) throw practiceError;
      if (repsError) throw repsError;
      if (userError) throw userError;

      // TODO keep the raw reps without restructuring?
      if (repsData) {
        const reps = repsData
          .map((rep, index) => ({
            repNumber: index + 1,
            repText: rep.summary,
            repDate: rep.created_at,
          }))
          .reverse();

        setReps(reps);
        setNextRep(reps.length + 1);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function savePracticeTitle() {
    try {
      await supabase
        .from("Practices")
        .update({ do100reps_title: practiceTitle })
        .eq("id", practice.id);
    } catch (e) {
      console.log("Error saving practice title :(", e);
    }
  }

  async function saveNextRep() {
    try {
      await supabase
        .from("Reps")
        .insert({ summary: nextRepText, practice: practice.name });

      await supabase
        .from("Practices")
        .update({ do100reps_count: nextRep })
        .eq("id", practice.id);

      setReps((prevReps) => [
        { repNumber: nextRep.toString(), repText: nextRepText },
        ...prevReps,
      ]);

      setNextRep(nextRep + 1);
      setNextRepText("");
      Keyboard.dismiss();
    } catch (e) {
      console.log("Error saving the next rep :(", e);
    }
  }

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
      data={reps}
      keyExtractor={(item) => item.repNumber}
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
                savePracticeTitle();
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
              title="Close Rep"
              color="lightgreen"
              accessibilityLabel="Close the rep and open the next one."
            />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            padding: 12,
            marginBottom: 12,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
            }}
          >
            Rep {item.repNumber} ({item.repDate}): {item.repText}
          </Text>
        </View>
      )}
    />
  );
}
