import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { getSupabasePrograms } from "@/supabase/supabase-queries";

export default function Programs() {
  // Query: stories
  const {
    isPending: isPending,
    error: error,
    data: stories,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: () => {
      return getSupabasePrograms();
    },
  });

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Error!</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={stories}
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        keyExtractor={(item) => item.id?.toString() ?? "None"}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ marginBottom: 5 }}>{item.title}</Text>
              <View style={styles.horizontalRule} />
              <Text style={{ marginTop: 5 }}>{item.description}</Text>
            </View>
          </View>
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
