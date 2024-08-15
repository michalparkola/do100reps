import React from "react";
import { Text, View, FlatList } from "react-native";

import { supabase } from "@/supabase/supabase-client";
import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";
import PracticeProgress from "@/components/PracticeProgress";

interface Props {
  userId: string;
  practiceId: string;
}

export default function PracticeReview({ userId, practiceId }: Props) {
  // TODO check if valid practiceId
  // TODO use React Query and a custom hook to get reps and practice info

  const [isLoading, setIsLoading] = React.useState(true);
  const [practice, setPractice] = React.useState<Tables<"Practices"> | null>(
    null
  );
  const [reps, setReps] = React.useState<Tables<"Reps">[]>([]);

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

      if (practicePromise.data) {
        setPractice(practicePromise.data[0]);
      }

      const repsPromise = await supabase
        .from("Reps")
        .select()
        .eq("practice_id", practiceId)
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (repsPromise.data) {
        setReps(repsPromise.data.reverse());
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      style={{ padding: 12 }}
      ListHeaderComponent={
        <View style={{ marginBottom: 12 }}>
          {practice && (
            <Text style={gs.bigTitle}>{practice.do100reps_title}</Text>
          )}

          <PracticeProgress completed_reps_count={reps.length} />
        </View>
      }
      data={reps}
      renderItem={({ item, index }) => (
        <View style={gs.repContainer}>
          <Text style={gs.repText}>{item.summary}</Text>
          <Text style={gs.repSecondaryText}>
            Rep {reps.length - index} {item.created_at}{" "}
          </Text>
        </View>
      )}
    />
  );
}
