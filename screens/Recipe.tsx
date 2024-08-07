import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNugget, updateNugget } from "@/supabase/supabase-queries";
import { gs } from "@/global-styles";
import EditableTextInputWithCancelSave from "@/components/EditableTextInputWithCancelSave";
import { Tables } from "@/supabase/database.types";
import EditableTODOSwitch from "@/components/EditableTODOSwitch";

interface Props {
  nugget_id: string;
}

export default function Recipe({ nugget_id }: Props) {
  const queryClient = useQueryClient();

  // Query: nugget_id
  const {
    data: nugget,
    error,
    isPending,
  } = useQuery({
    queryFn: () => getNugget(nugget_id),
    queryKey: ["nugget", nugget_id],
  });

  const updateNuggetMutation = useMutation({
    mutationFn: (new_nugget: Tables<"Nuggets">) => updateNugget(new_nugget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nugget", nugget_id] });
      queryClient.invalidateQueries({ queryKey: ["nuggets"] });
    },
  });

  if (isPending) return <Text>Loading recipe...</Text>;
  if (error)
    return (
      <Text>
        Error getting recipe: {error.name}, {error.message}
      </Text>
    );
  return (
    <ScrollView contentContainerStyle={{ margin: 12 }}>
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
