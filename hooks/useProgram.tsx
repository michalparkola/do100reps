import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSupabaseProgramById } from "../supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function useProgram(
  programId: string
): UseQueryResult<Tables<"Programs">> {
  return useQuery({
    queryKey: ["program", programId],
    queryFn: () => getSupabaseProgramById(programId),
  });
}
