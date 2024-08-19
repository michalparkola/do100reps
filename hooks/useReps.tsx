import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSupabaseRepsByPracticeId } from "../supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function useReps(practiceId: string): UseQueryResult<Tables<"Reps">[]> {
  return useQuery({
    queryKey: ["reps", practiceId],
    queryFn: () => getSupabaseRepsByPracticeId(practiceId),
  });
}
