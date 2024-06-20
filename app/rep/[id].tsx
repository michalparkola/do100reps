import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Text, Keyboard } from "react-native";
import { supabase } from "@/supabase/supabase-client";
import RepView from "@/screens/RepView";

interface Rep {
  id: string;
  user_id: string;
  summary: string;
  created_at: string;
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

  async function updateRepInSupabase(
    newRepSummary: string,
    newRepDate: string
  ) {
    try {
      if (!rep) throw Error("No rep!");
      await supabase
        .from("Reps")
        .update({ summary: newRepSummary, created_at: newRepDate })
        .eq("id", rep.id);
      Keyboard.dismiss();
      console.log("Changing the rep!");
    } catch (e) {
      console.log("Error saving the rep :(", e);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rep details",
        }}
      />
      {rep ? (
        <RepView rep={rep} handleRepChange={updateRepInSupabase} />
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
}
