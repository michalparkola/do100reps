import React from "react";
import { View, Text, FlatList } from "react-native";
import { Link } from "expo-router";
import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

interface Props {
  nuggets: Tables<"Nuggets">[];
  practice_title: string;
}

export default function NuggetListForPractice({
  nuggets,
  practice_title,
}: Props) {
  const filteredNuggets =
    practice_title === "(any)"
      ? nuggets
      : nuggets.filter((nugget) => nugget.practice === practice_title);
  return (
    <FlatList
      style={gs.flatlist}
      data={filteredNuggets}
      renderItem={({ item }: { item: Tables<"Nuggets"> }) => (
        <View style={gs.itemContainer}>
          <Link href={"/nugget/" + item.id}>
            <View>
              <Text style={gs.text}>{item.title}</Text>
              {(item.is_todo && <Text style={gs.secondaryText}>TODO</Text>) || (
                <Text style={gs.secondaryText}>Shelved</Text>
              )}
            </View>
          </Link>
        </View>
      )}
    />
  );
}
