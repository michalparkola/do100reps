import React, { useState } from "react";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getNuggets } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { Picker } from "@react-native-picker/picker";
import NuggetListForPractice from "@/components/NuggetListForPractice";

function groupNuggetsByPractice(nuggets: Tables<"Nuggets">[]) {
  function reducer(
    groups: Record<string, Tables<"Nuggets">[]>,
    nugget: Tables<"Nuggets">
  ) {
    const { practice } = nugget;
    const practiceKey = practice ?? "(none)";
    (groups[practiceKey] = groups[practiceKey] || []).push(nugget);
    return groups;
  }

  const reduced = nuggets.reduce(
    reducer,
    {} as Record<string, Tables<"Nuggets">[]>
  );

  const entries = Object.entries(reduced);

  const mapped = entries.map(([title, data]) => ({
    title,
    data,
    count: data.length,
  })) as {
    title: string;
    data: Tables<"Nuggets">[];
    count: number;
  }[];

  return mapped;
}

export default function NuggetList() {
  const [selectedPractice, setSelectedPractice] = useState("(any)");

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

  const grouped_nuggets = groupNuggetsByPractice(nuggets ?? []);

  return (
    <>
      <Picker
        style={{ margin: 12, padding: 6 }}
        selectedValue={selectedPractice}
        onValueChange={(itemValue) => setSelectedPractice(itemValue)}
      >
        <Picker.Item label="(any)" value="(any)" />
        {grouped_nuggets?.map((ng, idx) => (
          <Picker.Item
            key={idx}
            label={ng.title + " (" + ng.count + ")"}
            value={ng.title}
          />
        ))}
      </Picker>
      <View style={{ margin: 12 }}>
        <NuggetListForPractice practice_title={selectedPractice} />
      </View>
    </>
  );
}
