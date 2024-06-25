import React, { useState } from "react";
import { View, Text, FlatList, Switch } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getNuggets } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

interface Props {
  practice_title: string;
}

export default function NuggetListForPractice({ practice_title }: Props) {
  const [isEnabled, setIsEnabled] = useState(false);
  function toggleSwitch() {
    setIsEnabled((previousState) => !previousState);
  }

  // query nuggets
  const {
    data: nuggets,
    error: errorNuggets,
    isPending: isPendingNuggets,
  } = useQuery({
    queryFn: getNuggets,
    queryKey: ["nuggets"],
  });

  if (isPendingNuggets) return <Text>Loading...</Text>;
  if (errorNuggets) return <Text>Error!!</Text>;

  const filteredNuggets =
    practice_title === "(any)"
      ? nuggets
      : nuggets.filter((nugget) => nugget.practice === practice_title);

  const nuggetsToShow = isEnabled
    ? filteredNuggets
    : filteredNuggets.filter((n) => n.is_todo);

  return (
    <>
      <Text style={{ fontSize: 16, marginTop: 12 }}>
        Apply ideas from nuggets to your next rep:
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 12 }}>
        <Text>Also show shelved nuggets:</Text>
        <Switch
          style={{ marginLeft: 12 }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {nuggetsToShow.length > 0 ? (
        <FlatList
          data={nuggetsToShow}
          renderItem={({ item }: { item: Tables<"Nuggets"> }) => (
            <View style={gs.itemContainer}>
              <Link href={"/nugget/" + item.id}>
                <View>
                  <Text style={gs.text}>{item.title}</Text>
                </View>
              </Link>
            </View>
          )}
        />
      ) : (
        <Text style={{ margin: 12 }}>No nuggets to show</Text>
      )}
    </>
  );
}
