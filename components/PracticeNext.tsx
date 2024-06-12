import { Text } from "react-native";
import { supabase } from "@/supabase/supabase-client";
import {
  getSupabasePracticeById,
  getSupabaseRepsByPracticeName,
} from "@/supabase/supabase-queries";
import { useQuery } from "@tanstack/react-query";

interface Props {
  practiceId: string;
}

// Get practice title, get all reps, get all notes
// Feed to OpenAI
// Display option for what to do next...

export default function PracticeNext({ practiceId }: Props) {
  const {
    isPending: isPendingPractice,
    error: errorPractice,
    data: practice,
  } = useQuery({
    queryKey: ["practice", practiceId],
    queryFn: () => getSupabasePracticeById(practiceId),
  });

  async function getAiSuggestion(practiceId: string) {
    const { data, error } = await supabase.functions.invoke("openai", {
      body: {
        query:
          "Given my goal is to " +
          practice.do100reps_title +
          "What are three things I might want to do next?",
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
    enabled: !!practice,
  });

  if (isPendingPractice || errorPractice)
    return <Text>No practice (yet).</Text>;

  return (
    <>
      <Text style={{ margin: 12 }}>
        Given my goal is to {practice.do100reps_title} What are three things I
        might want to do next?"
      </Text>
      <Text style={{ margin: 12 }}>{ai_suggestion}</Text>
    </>
  );
}
