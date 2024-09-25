import React, { useState } from "react";
import { View, Text, SectionList, Switch } from "react-native";
import { Link } from "expo-router";

import { Tables } from "@/supabase/database.types";
import PracticeGrid from "@/screens/practice/PracticeGrid";
import { AddPractice } from "./AddPractice";
import { usePractices } from "@/screens/practice/usePractices";

import { gs } from "@/global-styles";

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
  const [showShelved, setShowShelved] = useState(false);

  const {
    isPending: isPendingPractices,
    error: errorPractices,
    data: practices,
  } = usePractices();

  if (isPendingPractices) return <Text>Loading...</Text>;
  if (errorPractices) return <Text>Error!</Text>;

  const filteredPractices =
    practices?.filter((practice) => showShelved || !practice.is_shelved) ?? [];
  const categories = groupPracticesByCategory(filteredPractices);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 12 }}>
        <Text>Show shelved recipes:</Text>
        <Switch
          style={{ marginLeft: 12 }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={showShelved ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setShowShelved}
          value={showShelved}
        />
      </View>
      <SectionList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        sections={categories}
        keyExtractor={(item) => item.do100reps_title ?? "No title"}
        renderItem={({ item }) => (
          <Link href={"/practice/" + item.id}>
            <View
              style={item.is_shelved ? gs.shelvedContainer : gs.itemContainer}
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
