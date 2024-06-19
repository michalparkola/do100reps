import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getNugget } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

interface Props {
  nugget_id: string;
}

export default function Nugget({ nugget_id }: Props) {
  const {
    data: nugget,
    error,
    isPending,
  } = useQuery({
    queryFn: () => getNugget(nugget_id),
    queryKey: ["nugget", nugget_id],
  });

  if (isPending) return <Text>Loading nugget...</Text>;
  if (error)
    return (
      <Text>
        Error getting nugget: {error.name}, {error.message}
      </Text>
    );
  return (
    <>
      <Text>Id: {nugget.id}</Text>
      <Text>Created at: {nugget.created_at}</Text>
      <Text>Next_review: {nugget.next_review}</Text>
      <Text>TODO: {nugget.is_todo}</Text>
      <Text>Practice_id: {nugget.practice_id}</Text>
      <Text>Practice: {nugget.practice}</Text>
      <Text>Title: {nugget.title}</Text>
      <Text>Text: {nugget.text}</Text>
      <Text>Rating: {nugget.rating}</Text>
      <Text>Tags: {nugget.tags}</Text>
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
