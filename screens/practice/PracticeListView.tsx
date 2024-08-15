import React from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import {
  getSupabaseUserId,
  getSupabasePractices,
} from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import PracticeGrid from "@/screens/practice/PracticeGrid";
import { AddPractice } from "./AddPractice";
import { useQuery } from "@tanstack/react-query";

function groupPracticesByCategory(practices: Tables<"Practices">[]) {
  return Object.entries(
    practices.reduce((groups, practice) => {
      const category = practice.category ?? "Uncategorized";
      (groups[category] = groups[category] || []).push(practice);
      return groups;
    }, {} as Record<string, Tables<"Practices">[]>)
  ).map(([title, data]) => ({ title, data }));
}

export default function PracticeList() {
  // Query: getSupabaseUserId
  const {
    isPending: isPendingUser,
    error: errorUser,
    data: userid,
  } = useQuery({
    queryKey: ["userid"],
    queryFn: getSupabaseUserId,
  });

  // Query: getSupabasePractices
  const {
    isPending: isPendingPractices,
    error: errorPractices,
    data: practices,
  } = useQuery({
    queryKey: ["practices", userid],
    queryFn: () => {
      if (userid) {
        const data = getSupabasePractices(userid);
        return data;
      }
    },
    enabled: !!userid,
  });

  if (isPendingUser || isPendingPractices) return <Text>Loading...</Text>;
  if (errorUser || errorPractices) return <Text>Error!</Text>;

  const categories = groupPracticesByCategory(practices ?? []);

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        sections={categories}
        keyExtractor={(item) => item.do100reps_title ?? "No title"}
        renderItem={({ item }) => (
          <Link href={"/practice/" + item.id}>
            <View style={styles.card}>
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
                  Completed reps: {item.do100reps_count}/100 (level{" "}
                  {Math.floor(1 + item.do100reps_count / 10)})
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
      <AddPractice />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    width: "100%",
  },
});
