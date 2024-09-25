import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useUpdateRecipe } from "./useUpdateRecipe";
import { getNugget } from "@/supabase/supabase-queries";
import { gs } from "@/global-styles";
import EditableTextInputWithCancelSave from "@/components/EditableTextInputWithCancelSave";
import EditableTODOSwitch from "@/components/EditableTODOSwitch";

interface Props {
  nugget_id: string;
}

export default function Recipe({ nugget_id }: Props) {
  // Query: nugget_id
  const {
    data: nugget,
    error,
    isPending,
  } = useQuery({
    queryFn: () => getNugget(nugget_id),
    queryKey: ["nugget", nugget_id],
  });

  const updateNuggetMutation = useUpdateRecipe(Number(nugget_id));

  if (isPending) return <Text>Loading recipe...</Text>;
  if (error)
    return (
      <Text>
        Error getting recipe: {error.name}, {error.message}
      </Text>
    );
  return (
    <ScrollView contentContainerStyle={{ margin: 12 }}>
      <Text style={gs.label}>Shelved</Text>
      <EditableTODOSwitch
        is_todo={nugget.is_todo}
        handleToggle={() => {
          updateNuggetMutation.mutate({ ...nugget, is_todo: !nugget.is_todo });
        }}
      />
      <Text style={gs.label}>Created at</Text>
      <Text style={{ margin: 12 }}>{nugget.created_at}</Text>
      <Text style={gs.label}>Practice</Text>
      <Text style={{ margin: 12 }}>{nugget.practice}</Text>
      <Text style={gs.label}>Title</Text>
      <View style={{ padding: 6 }}>
        <EditableTextInputWithCancelSave
          text={nugget.title || ""}
          handleSave={(text: string) =>
            updateNuggetMutation.mutate({ ...nugget, title: text })
          }
        />
      </View>
      <Text style={gs.label}>Text</Text>
      <View style={{ padding: 6 }}>
        <EditableTextInputWithCancelSave
          text={nugget.text || ""}
          handleSave={(text: string) =>
            updateNuggetMutation.mutate({ ...nugget, text: text })
          }
        />
      </View>
    </ScrollView>
  );
}
