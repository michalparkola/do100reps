import { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  getNuggets,
  getSupabasePractices,
  getSupabaseUserId,
} from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { Picker } from "@react-native-picker/picker";

function groupNuggetsByPractice(nuggets: any[]) {
  return Object.entries(
    nuggets.reduce((groups, nugget) => {
      const { practice } = nugget;
      (groups[practice] = groups[practice] || []).push(nugget);
      return groups;
    }, {})
  ).map(([title, data]) => ({ title, data, count: data.length })) as any[];
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

  // query: user id
  const {
    isPending: isPendingUser,
    error: errorUser,
    data: userid,
  } = useQuery({
    queryKey: ["userid"],
    queryFn: getSupabaseUserId,
  });

  // query: practices
  const {
    isPending: isPendingPractices,
    error: errorPractices,
    data: practices,
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

  if (isPendingNuggets || isPendingPractices || isPendingUser)
    return <Text>Loading...</Text>;

  if (errorNuggets || errorPractices || errorUser) return <Text>Error!!</Text>;

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
        onValueChange={(itemValue, itemIndex) => setSelectedPractice(itemValue)}
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
                <Text style={styles.secondaryText}>{item.created_at}</Text>
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
