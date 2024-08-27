import React, { useState } from "react";
import { View, Text, FlatList, Switch, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { usePrograms } from "@/hooks/usePrograms";
import { Tables } from "@/supabase/database.types";

interface Props {
  practice_id: number;
}

export default function ProgramsListForPractice({ practice_id }: Props) {
  const [isEnabled, setIsEnabled] = useState(false);
  function toggleSwitch() {
    setIsEnabled((previousState) => !previousState);
  }

  const {
    data: programs,
    error: errorPrograms,
    isPending: isPendingPrograms,
  } = usePrograms(practice_id);

  if (isPendingPrograms) return <Text>Loading...</Text>;
  if (errorPrograms) return <Text>Error!!</Text>;

  const programsToShow: Tables<"Programs">[] = isEnabled
    ? programs
    : programs.filter((program) => !program.is_shelved);

  return (
    <>
      <Text style={{ fontSize: 16, marginTop: 12 }}>
        Learn just enough to do something interesting by following PROGRAMS:
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 12 }}>
        <Text>Also show shelved programs:</Text>
        <Switch
          style={{ marginLeft: 12 }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {programsToShow.length > 0 ? (
        <FlatList
          data={programsToShow}
          renderItem={({ item }: { item: Tables<"Programs"> }) => (
            <View style={styles.card}>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Link href={"/program/" + item.id}>
                  <Text style={{ marginBottom: 5 }}>{item.title}</Text>
                </Link>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={{ margin: 12 }}>No recipes to show</Text>
      )}
    </>
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
