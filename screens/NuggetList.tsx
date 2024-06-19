import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getNuggets } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export default function NuggetList() {
  const {
    data: nuggets,
    error,
    isPending,
  } = useQuery({
    queryFn: getNuggets,
    queryKey: ["nuggets"],
  });

  if (isPending) return <Text>Loading nuggets...</Text>;
  if (error)
    return (
      <Text>
        Error getting nuggets: {error.name}, {error.message}
      </Text>
    );
  return (
    <FlatList
      style={styles.flatlist}
      data={nuggets}
      renderItem={({ item }: { item: Tables<"Nuggets"> }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.text}>{item.title}</Text>
          <Text style={styles.secondaryText}>{item.created_at}</Text>
        </View>
      )}
    />
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
