import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

import { Tables } from "@/supabase/database.types";
import { gs } from "@/global-styles";

interface RepCardProps {
  rep: Tables<"Reps"> | undefined;
  rep_number: number;
}

export default function RepCard({ rep, rep_number }: RepCardProps) {
  if (!rep) return <></>;
  return (
    <View style={gs.repContainer}>
      <Link href={"/rep/" + rep.id}>
        <View>
          <Text style={gs.repText}>{rep.summary}</Text>
          <Text style={gs.repSecondaryText}>
            Rep {rep_number} {rep.created_at}{" "}
          </Text>
        </View>
      </Link>
    </View>
  );
}
