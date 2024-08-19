import React from "react";
import { View, ScrollView, Text, FlatList, StyleSheet } from "react-native";
import { useProgram } from "@/hooks/useProgram";
import { useReps } from "@/hooks/useReps";

interface ProgramProps {
  programId: string;
}

export default function Program({ programId }: ProgramProps) {
  const {
    isPending: isPendingProgram,
    error: errorProgram,
    data: program,
  } = useProgram(programId);
  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useReps(String(program?.practice ?? ""));

  if (isPendingProgram || isPendingReps) return <Text>Loading ...</Text>;
  if (errorProgram || errorReps) return <Text>Error ...</Text>;

  console.log(reps);

  return (
    <ScrollView>
      <Text style={[styles.text, { marginHorizontal: 12, marginTop: 12 }]}>
        Program Title
      </Text>
      <Text style={{ margin: 12 }}>{program.title}</Text>
      <Text style={[styles.text, { marginHorizontal: 12, marginTop: 12 }]}>
        Program Description
      </Text>
      <Text style={{ margin: 12 }}>{program.description}</Text>
      <Text style={[styles.text, { marginHorizontal: 12, marginTop: 12 }]}>
        Program Activities
      </Text>
      <View style={{ flexGrow: 0 }}>
        <FlatList
          style={{ margin: 12 }}
          data={program.activities}
          renderItem={({ item }) => (
            <View style={styles.activityContainer}>
              <Text style={{ marginVertical: 12 }}>{item.title}</Text>
              <Text style={{ marginVertical: 12 }}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightgreen",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
  activityContainer: {
    backgroundColor: "#c7f2ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
