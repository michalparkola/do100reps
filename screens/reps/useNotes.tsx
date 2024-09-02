import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Tables } from "@/supabase/database.types";
import { getNotesByRepId } from "@/supabase/supabase-queries";

export function useNotes(rep_id: number): UseQueryResult<Tables<"RepNotes">[]> {
  return useQuery({
    queryKey: ["notes", rep_id],
    queryFn: () => getNotesByRepId(rep_id),
  });
}
