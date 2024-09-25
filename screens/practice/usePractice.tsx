import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSupabasePracticeById } from "../../supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function usePractice(
  practiceId: string
): UseQueryResult<Tables<"Practices">> {
  return useQuery({
    queryKey: ["practice", practiceId],
    queryFn: () => getSupabasePracticeById(practiceId),
  });
}
