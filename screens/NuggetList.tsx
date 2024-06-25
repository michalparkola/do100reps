import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getNuggets } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { Picker } from "@react-native-picker/picker";

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
  console.log(grouped_nuggets);

  const filteredNuggets =
    selectedPractice === "(any)"
      ? nuggets
      : nuggets.filter((nugget) => nugget.practice === selectedPractice);

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
      <FlatList
        style={styles.flatlist}
        data={filteredNuggets}
        renderItem={({ item }: { item: Tables<"Nuggets"> }) => (
          <View style={styles.itemContainer}>
            <Link href={"/nugget/" + item.id}>
              <View>
                <Text style={styles.text}>{item.title}</Text>
                {(item.is_todo && (
                  <Text style={styles.secondaryText}>TODO</Text>
                )) || <Text style={styles.secondaryText}>Shelved</Text>}
              </View>
            </Link>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatlist: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  text: {
    fontSize: 16,
  },
  secondaryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});
