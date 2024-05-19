import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Keyboard,
  ScrollView,
} from "react-native";
import PracticeGrid from "@/components/PracticeGrid";
import { supabase } from "@/helpers/supabase";

interface Props {
  practiceId?: string;
}

export default function PracticeView({ practiceId }: Props) {
  // TODO check if valid practiceId

  const [isLoading, setIsLoading] = React.useState(true);
  const [nextRep, setNextRep] = React.useState<number>(1);
  const [nextRepText, setNextRepText] = React.useState("");
  const [practice, setPractice] = React.useState<any>(null);
  const [reps, setReps] = React.useState<any[]>([]);

  React.useEffect(() => {
    getRepsFromSupabase();
  }, []);

  async function getRepsFromSupabase() {
    try {
      const practicePromise = await supabase
        .from("Practices")
        .select()
        .eq("id", practiceId);

      let practiceName = null;
      if (practicePromise.data) {
        setPractice(practicePromise.data[0]);
        console.log(practice);
        practiceName = practicePromise.data[0].name;
      }

      const repsPromise = await supabase
        .from("Reps")
        .select()
        .eq("practice", practiceName)
        .order("created_at", { ascending: true });

      if (repsPromise.data) {
        setNextRep(repsPromise.data.length + 1);
        let tmp: Array<{ repNumber: number; repText: string }> = [];
        for (let rep in repsPromise.data) {
          tmp.push({
            repNumber: Number(rep) + 1,
            repText: repsPromise.data[rep].summary,
          });
        }
        setReps(tmp.reverse());
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function goToNextRep() {
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
      console.log("Next rep saving error", e);
    }
  }

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
      data={reps}
      keyExtractor={(item) => item.repNumber}
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            {practice.do100reps_title}
          </Text>
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
              onPress={goToNextRep}
              title="Close Rep"
              color="lightgreen"
              accessibilityLabel="Close the rep and open the next one."
            />
          </View>
        </View>
      )}
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
            Rep {item.repNumber}: {item.repText}
          </Text>
        </View>
      )}
    />
  );
}
