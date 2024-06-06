import { useState, useEffect } from "react";
import { View, Text, SectionList } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/helpers/supabase";
import PracticeGrid from "@/components/PracticeGrid";
import { AddPractice } from "./AddPractice";

export default function PracticeList() {
  const [practices, setPractices] = useState<any[]>([]);

  useEffect(() => {
    getPracticesFromSupabase();
  }, []);

  async function getPracticesFromSupabase() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      let userId = null;
      if (userData && userData.user && !userError) {
        userId = userData.user.id;
      } else throw userError;

      const { data } = await supabase
        .from("Practices")
        .select()
        .eq("user_id", userId)
        .not("do100reps_title", "is", null);

      if (data) {
        const groupedPractices = data.reduce((groups, practice) => {
          const category = practice.category;
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(practice);
          return groups;
        }, {});

        // Convert object to array of sections
        const sections = Object.keys(groupedPractices).map((category) => ({
          title: category,
          data: groupedPractices[category],
        }));
        setPractices(sections);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        sections={practices}
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
                width: "100%",
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
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ margin: 12, fontWeight: "bold" }}>
            {title != "null" ? title : ""}
          </Text>
        )}
      />
      <AddPractice onPracticeAdded={getPracticesFromSupabase} />
    </View>
  );
}
