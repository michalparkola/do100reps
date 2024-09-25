import React, { useState } from "react";
import { View, ScrollView, Text, Switch } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useUpdateRecipe } from "./useUpdateRecipe";
import { getNugget } from "@/supabase/supabase-queries";
import { gs } from "@/global-styles";
import EditableTextInputWithCancelSave from "@/components/EditableTextInputWithCancelSave";

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

  const updateRecipeMutation = useUpdateRecipe(Number(nugget_id));

  const [isShelved, setIsShelved] = useState(nugget?.is_todo ?? true);

  if (isPending) return <Text>Loading recipe...</Text>;
  if (error)
    return (
      <Text>
        Error getting recipe: {error.name}, {error.message}
      </Text>
    );

  function handleIsShelvedSwitch(switch_value: boolean) {
    if (!nugget) return;

    updateRecipeMutation.mutate(
      { ...nugget, is_todo: !nugget.is_todo },
      {
        onSuccess: () => {
          setIsShelved(switch_value);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }

  return (
    <ScrollView contentContainerStyle={{ margin: 12 }}>
      <Text style={gs.label}>Shelved</Text>
      <Switch
        style={{ margin: 12 }}
        value={isShelved}
        onValueChange={(value) => {
          console.log("Swith: ", value);
          handleIsShelvedSwitch(value);
        }}
      />
      <Text style={gs.label}>Title</Text>
      <View style={{ padding: 6 }}>
        <EditableTextInputWithCancelSave
          text={nugget.title || ""}
          handleSave={(text: string) =>
            updateRecipeMutation.mutate({ ...nugget, title: text })
          }
        />
      </View>
      <Text style={gs.label}>Text</Text>
      <View style={{ padding: 6 }}>
        <EditableTextInputWithCancelSave
          text={nugget.text || ""}
          handleSave={(text: string) =>
            updateRecipeMutation.mutate({ ...nugget, text: text })
          }
        />
      </View>
    </ScrollView>
  );
}
