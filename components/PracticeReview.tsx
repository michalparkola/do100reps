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
  userId: string;
  practiceId: string;
}

export default function PracticeReview({ userId, practiceId }: Props) {
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
        .eq("user_id", userId)
        .eq("id", practiceId);

      let practiceName = null;
      if (practicePromise.data) {
        setPractice(practicePromise.data[0]);
        practiceName = practicePromise.data[0].name;
      }

      const repsPromise = await supabase
        .from("Reps")
        .select()
        .eq("practice", practiceName)
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (repsPromise.data) {
        setNextRep(repsPromise.data.length + 1);
        setReps(repsPromise.data.reverse());
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginLeft: 12,
          marginBottom: 12,
        }}
      >
        {practice.do100reps_title}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <View style={{ marginLeft: 12 }}>
          <PracticeGrid nextRep={nextRep} size={10} />
        </View>
        <Text style={{ fontSize: 32, marginLeft: 12 }}>
          Next rep {nextRep.toString()}/100
        </Text>
      </View>

      <FlatList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        data={reps}
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
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Rep {nextRep - 1 - index} ({item.created_at}): {item.summary}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
