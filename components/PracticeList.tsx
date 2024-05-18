import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/helpers/supabase";
import PracticeGrid from "@/components/PracticeGrid";

export default function PracticeList() {
  const [practices, setPractices] = useState<any[]>([]);

  useEffect(() => {
    getPracticesFromSupabase();
  }, []);

  async function getPracticesFromSupabase() {
    try {
      const { data } = await supabase
        .from("Practices")
        .select()
        .not("do100reps_title", "is", null);

      if (data) {
        setPractices(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <FlatList
      style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
      data={practices}
      keyExtractor={(item) => item.do100reps_title}
      renderItem={({ item }) => (
        <Link href={"/practice/" + item.id}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 5,
              padding: 12,
              marginBottom: 12,
              elevation: 5,
              width: 360,
            }}
          >
            <View style={{ marginRight: 5 }}>
              <PracticeGrid nextRep={item.do100reps_count + 1} size={9} />
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ marginBottom: 5 }}>{item.name}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {item.do100reps_title}
              </Text>
              <Text style={{ marginTop: 5 }}>
                Completed reps: {item.do100reps_count}/100
              </Text>
            </View>
          </View>
        </Link>
      )}
    />
  );
}
