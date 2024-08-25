import React from "react";
import { View, ScrollView, Text, FlatList } from "react-native";

import { useProgram } from "@/hooks/useProgram";
import { useReps } from "@/hooks/useReps";

import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

import RepCard from "../reps/RepCard";
import { ConnectRepToActivityModal } from "./ConnectRepToActivityModal";

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

  function getRepById(id: number): Tables<"Reps"> | undefined {
    return reps?.find((rep) => rep.id === id);
  }

  return (
    <ScrollView style={{ marginHorizontal: 12 }}>
      <Text style={gs.h2}>Program Title</Text>
      <Text style={{ margin: 12 }}>{program.title}</Text>
      <Text style={gs.h2}>Description</Text>
      <Text style={{ margin: 12 }}>{program.description}</Text>
      <Text style={gs.h2}>Activities</Text>
      <View style={{ flexGrow: 0 }}>
        <FlatList
          style={{ margin: 12 }}
          data={program.activities}
          renderItem={({ item }) => (
            <>
              <View style={gs.activityContainer}>
                <Text style={{ marginVertical: 12 }}>{item.title}</Text>
                <Text style={{ marginVertical: 12 }}>{item.description}</Text>
              </View>
              <FlatList
                style={{ marginLeft: 12 }}
                data={item.related_reps}
                keyExtractor={(innerItem) => innerItem.toString()}
                renderItem={({ item, index }) => (
                  <RepCard
                    rep={getRepById(item)}
                    rep_number={reps.length - index}
                  />
                )}
                ListFooterComponent={
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginBottom: 20,
                    }}
                  >
                    <ConnectRepToActivityModal
                      practice_id={String(program?.practice ?? "")}
                      activity_id={item.id}
                    />
                  </View>
                }
              />
            </>
          )}
        />
      </View>
    </ScrollView>
  );
}
