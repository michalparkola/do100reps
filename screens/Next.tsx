import { Text, View, ScrollView, Pressable } from "react-native";
import { supabase } from "@/supabase/supabase-client";
import { getSupabasePracticeById, getSupabaseRepsByPracticeId } from "@/supabase/supabase-queries";
import { useQuery } from "@tanstack/react-query";
import { gs } from "@/global-styles";
import { useAddRep } from "@/hooks/useAddRep";

interface Props {
  practiceId: string;
}

// Get practice title, get all reps, get all notes
// Feed to OpenAI
// Display option for what to do next...

export default function Next({ practiceId }: Props) {
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = useQuery({
    queryKey: ["practice", practiceId],
    queryFn: () => getSupabasePracticeById(practiceId),
  });

  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useQuery({
    queryKey: ["reps", practiceId],
    queryFn: () => getSupabaseRepsByPracticeId(practiceId),
    enabled: !!practice,
  });

  const addRepMutation = useAddRep(practiceId, (reps?.length || 0) + 1);

  async function getAiSuggestion(practiceId: string) {
    const { data, error } = await supabase.functions.invoke("openai", {
      body: {
        query:
          "Given my goal is to " +
          practice?.do100reps_title +
          " and my previous reps are: " +
          (reps?.map(rep => rep.summary).join(", ") || "none yet") +
          ". What are three things I might want to do next?",
      },
    });

    if (error) {
      throw new Error(error.message);
    } else {
      return data;
    }
  }

  const {
    isPending: isPendingAI,
    error: errorAI,
    data: ai_suggestion,
  } = useQuery({
    queryKey: ["ai_suggestion", practiceId],
    queryFn: () => getAiSuggestion(practiceId),
    enabled: !!practice && !!reps,
  });

  if (isPendingPractice || errorPractice)
    return <Text>No practice (yet).</Text>;

  // Parse AI suggestions into individual items
  const suggestions = ai_suggestion 
    ? ai_suggestion.split('\n').filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
      .filter((suggestion: string) => suggestion.length > 0)
    : [];

  const handleCreateRep = (suggestion: string) => {
    addRepMutation.mutate(suggestion);
  };

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={[gs.h2, { marginBottom: 12 }]}>
        AI Suggestions for: {practice.do100reps_title}
      </Text>
      <Text style={[gs.secondaryText, { marginBottom: 16 }]}>
        Based on your {reps?.length || 0} previous reps
      </Text>
      {isPendingAI && (
        <View style={gs.repContainer}>
          <Text style={gs.repText}>Getting AI suggestions...</Text>
        </View>
      )}
      {suggestions.length > 0 && suggestions.map((suggestion: string, index: number) => (
        <View key={index} style={gs.repContainer}>
          <Text style={gs.repText}>{suggestion}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Text style={gs.repSecondaryText}>
              AI Suggestion {index + 1}
            </Text>
            <Pressable 
              style={gs.smallButton} 
              onPress={() => handleCreateRep(suggestion)}
              disabled={addRepMutation.isPending}
            >
              <Text style={gs.text}>
                {addRepMutation.isPending ? 'Adding...' : 'Use as Rep'}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
      {errorAI && (
        <View style={gs.repContainer}>
          <Text style={gs.repText}>Unable to get AI suggestions at this time</Text>
          <Text style={gs.repSecondaryText}>Please try again later</Text>
        </View>
      )}
    </ScrollView>
  );
}
