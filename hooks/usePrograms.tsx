import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSupabasePrograms } from "../supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function usePrograms(
  practice_id?: number
): UseQueryResult<Tables<"Programs">[]> {
  return useQuery({
    queryKey: ["programs"],
    queryFn: () => {
      return getSupabasePrograms(practice_id);
    },
  });
}
