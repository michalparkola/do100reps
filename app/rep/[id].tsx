import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Text } from "react-native";
import { supabase } from "@/helpers/supabase";
import RepView from "@/components/RepView";

interface Rep {
  id: string;
  user_id: string;
  summary: string;
}

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [rep, setRep] = useState<Rep | null>(null);
  useEffect(() => {
    getRepFromSupabase();
  }, []);

  async function getRepFromSupabase() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      let userId = null;
      if (userData && userData.user && !userError) {
        userId = userData.user.id;
      } else throw userError;

      const { data: repData, error: repError } = await supabase
        .from("Reps")
        .select()
        .eq("id", id)
        .eq("user_id", userId);

      if (repError) throw repError;

      if (repData) {
        setRep(repData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rep details",
        }}
      />
      {rep ? <RepView rep={rep} /> : <Text>Loading...</Text>}
    </>
  );
}
