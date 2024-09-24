import React, { useState } from "react";
import { View, Text, FlatList, Switch } from "react-native";
import { Link } from "expo-router";
import { usePrograms } from "@/hooks/usePrograms";
import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

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

  if (programsToShow.length === 0) return <></>;

  return (
    <>
      <Text style={{ fontSize: 16, marginTop: 12 }}>
        Learn just enough to do something interesting by following PROGRAMS:
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 12 }}>
        <Text>Show shelved programs:</Text>
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
            <View
              style={item.is_shelved ? gs.shelvedContainer : gs.itemContainer}
            >
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
