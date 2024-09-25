import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { Link } from "expo-router";
import { Tables } from "@/supabase/database.types";

import { usePrograms } from "@/hooks/usePrograms";
import { usePractices } from "@/screens/practice/usePractices";
import { AddProgramToPractice } from "./AddProgram";

function groupProgramsByPractice(programs: Tables<"Programs">[]) {
  return Object.entries(
    programs.reduce((practices, program) => {
      const category = program.practice ?? "Uncategorized";
      (practices[category] = practices[category] || []).push(program);
      return practices;
    }, {} as Record<string, Tables<"Programs">[]>)
  ).map(([title, data]) => ({ title, data }));
}

export default function Programs() {
  const { isPending: isPending, error: error, data: programs } = usePrograms();
  const {
    isPending: isPendingPractices,
    error: errorPractices,
    data: practices,
  } = usePractices();

  if (isPending || isPendingPractices) return <Text>Loading...</Text>;
  if (error || errorPractices) return <Text>Error!</Text>;

  console.log(practices);

  const groupedPrograms = groupProgramsByPractice(programs ?? []);

  function findPracticeById(id: number) {
    return practices?.find((practice) => practice.id === id);
  }

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={groupedPrograms}
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        keyExtractor={(item) => item.id?.toString() ?? "None"}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Link href={"/program/" + item.id}>
                <Text style={{ marginBottom: 5 }}>{item.title}</Text>
              </Link>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title: id } }) => (
          <>
            <Text style={{ margin: 12, fontWeight: "bold" }}>
              {findPracticeById(Number(id))?.name || ""}
            </Text>
            {findPracticeById(Number(id)) && (
              <AddProgramToPractice practice={findPracticeById(Number(id))!} />
            )}
          </>
        )}
      />
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
  horizontalRule: {
    height: 1,
    backgroundColor: "#D3D3D3",
    marginVertical: 5,
  },
});
