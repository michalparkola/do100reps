import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getNugget } from "@/supabase/supabase-queries";
import { gs } from "@/global-styles";

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
    <View style={{ padding: 12 }}>
      <Text style={gs.h2}>Created at:</Text>
      <Text>{nugget.created_at}</Text>
      <Text style={gs.h2}>is TODO: </Text>
      <Text>{nugget.is_todo}</Text>
      <Text style={gs.h2}>Practice: </Text>
      <Text>{nugget.practice}</Text>
      <Text style={gs.h2}>Title: </Text>
      <Text>{nugget.title}</Text>
      <Text style={gs.h2}>Text: </Text>
      <Text>{nugget.text}</Text>
    </View>
  );
}
