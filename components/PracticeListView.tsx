import { useState, useEffect } from "react";
import { View, Text, SectionList } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/helpers/supabase";
import PracticeGrid from "@/components/PracticeGrid";
import { AddPractice } from "./AddPractice";
import { useQuery } from "@tanstack/react-query";

async function getSupabaseUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  } else {
    return data.user.id;
  }
}

async function getSupabasePractices(userid: string) {
  const { data, error } = await supabase
    .from("Practices")
    .select()
    .eq("user_id", userid)
    .not("do100reps_title", "is", null);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

function groupPracticesByCategory(practices: any[]) {
  return Object.entries(
    practices.reduce((groups, practice) => {
      const { category } = practice;
      (groups[category] = groups[category] || []).push(practice);
      return groups;
    }, {})
  ).map(([title, data]) => ({ title, data })) as any[];
}

export default function PracticeList() {
  const {
    isPending: isPendingUser,
    error: errorUser,
    data: userid,
  } = useQuery({
    queryKey: ["userid"],
    queryFn: getSupabaseUserId,
  });

  const {
    isPending: isPendingPractices,
    error: errorPractices,
    data: tsq_practices,
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

  const tsq_categories = groupPracticesByCategory(tsq_practices ?? []);

  return (
    <View style={{ flex: 1 }}>
      <Text>{userid}</Text>
      <Text>{tsq_practices?.length}</Text>
      <SectionList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        sections={tsq_categories}
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
      <AddPractice />
    </View>
  );
}
