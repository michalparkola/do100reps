import React from "react";
import { View, Text, FlatList } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getNuggets } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

interface Props {
  practice_title: string;
}

export default function NuggetListForPractice({ practice_title }: Props) {
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

  if (nuggets.length === 0) return;

  return (
    <>
      <FlatList
        style={gs.flatlist}
        data={filteredNuggets}
        renderItem={({ item }: { item: Tables<"Nuggets"> }) => (
          <View style={gs.itemContainer}>
            <Link href={"/nugget/" + item.id}>
              <View>
                <Text style={gs.text}>{item.title}</Text>
                {(item.is_todo && (
                  <Text style={gs.secondaryText}>TODO</Text>
                )) || <Text style={gs.secondaryText}>Shelved</Text>}
              </View>
            </Link>
          </View>
        )}
      />
    </>
  );
}
